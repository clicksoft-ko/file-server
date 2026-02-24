import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';
import { ConfigService } from '../config/config.service.js';
import { mimeToExtension, extensionToMime } from './utils/mime.util.js';

interface StoredFileInfo {
  filePath: string;
  extension: string;
  mimetype: string;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(private readonly configService: ConfigService) {}

  private get storagePath(): string {
    return this.configService.storagePath;
  }

  async upload(
    category: string,
    key: string,
    mimetype: string,
    buffer: Buffer,
  ): Promise<{ filePath: string; size: number }> {
    const ext = mimeToExtension(mimetype);
    const dirPath = path.join(this.storagePath, category);
    const fileName = `${key}.${ext}`;
    const fullPath = path.join(dirPath, fileName);

    // 기존 파일이 있으면 삭제 (다른 확장자일 수 있음)
    const existing = await this.findFile(category, key);
    if (existing) {
      await fsp.unlink(existing.filePath);
    }

    await fsp.mkdir(dirPath, { recursive: true });
    await fsp.writeFile(fullPath, buffer);

    this.logger.log(
      `File uploaded: ${category}/${fileName} (${buffer.length} bytes)`,
    );

    return { filePath: `${category}/${fileName}`, size: buffer.length };
  }

  async findFile(
    category: string,
    key: string,
  ): Promise<StoredFileInfo | null> {
    const dirPath = path.join(this.storagePath, category);

    try {
      const files = await fsp.readdir(dirPath);
      const match = files.find((f) => path.parse(f).name === key);
      if (!match) return null;

      const ext = path.extname(match).slice(1);
      return {
        filePath: path.join(dirPath, match),
        extension: ext,
        mimetype: extensionToMime(ext),
      };
    } catch {
      return null;
    }
  }

  async delete(category: string, key: string): Promise<void> {
    const fileInfo = await this.findFile(category, key);
    if (!fileInfo) {
      throw new NotFoundException(
        `파일을 찾을 수 없습니다: ${category}/${key}`,
      );
    }

    await fsp.unlink(fileInfo.filePath);
    this.logger.log(`File deleted: ${category}/${key}`);
  }

  async getFileStream(
    category: string,
    key: string,
  ): Promise<{ stream: fs.ReadStream; mimetype: string; size: number; mtimeMs: number }> {
    const fileInfo = await this.findFile(category, key);
    if (!fileInfo) {
      throw new NotFoundException(
        `파일을 찾을 수 없습니다: ${category}/${key}`,
      );
    }

    const stat = await fsp.stat(fileInfo.filePath);
    const stream = fs.createReadStream(fileInfo.filePath);

    return { stream, mimetype: fileInfo.mimetype, size: stat.size, mtimeMs: stat.mtimeMs };
  }
}

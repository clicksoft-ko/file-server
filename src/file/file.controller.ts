import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileService } from './file.service.js';
import { FileParamsDto, UploadQueryDto } from './dto/file-params.dto.js';

@ApiTags('파일')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post(':category/:key')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '파일 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'category',
    description: '파일 종류 (예: profile, document)',
  })
  @ApiParam({ name: 'key', description: '고유키 (예: user123)' })
  @ApiQuery({ name: 'mimetype', description: 'MIME 타입 (예: image/png)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  async upload(
    @Param() params: FileParamsDto,
    @Query() query: UploadQueryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('파일이 필요합니다');
    }
    return this.fileService.upload(
      params.category,
      params.key,
      query.mimetype,
      file.buffer,
    );
  }

  @Delete(':category/:key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '파일 삭제' })
  @ApiParam({ name: 'category', description: '파일 종류' })
  @ApiParam({ name: 'key', description: '고유키' })
  async delete(@Param() params: FileParamsDto): Promise<void> {
    await this.fileService.delete(params.category, params.key);
  }

  @Get(':category/:key')
  @ApiOperation({ summary: '파일 다운로드 (스트리밍)' })
  @ApiParam({ name: 'category', description: '파일 종류' })
  @ApiParam({ name: 'key', description: '고유키' })
  async stream(@Param() params: FileParamsDto): Promise<StreamableFile> {
    const { stream, mimetype, size } = await this.fileService.getFileStream(
      params.category,
      params.key,
    );
    return new StreamableFile(stream, { type: mimetype, length: size });
  }
}

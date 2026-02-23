import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const FileParamsSchema = z.object({
  category: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      '카테고리는 영문, 숫자, 하이픈, 언더스코어만 허용됩니다',
    ),
  key: z
    .string()
    .min(1)
    .max(200)
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      '고유키는 영문, 숫자, 하이픈, 점, 언더스코어만 허용됩니다',
    ),
});

export class FileParamsDto extends createZodDto(FileParamsSchema) {}

const UploadQuerySchema = z.object({
  mimetype: z
    .string()
    .min(1)
    .regex(
      /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.+-]+$/,
      '올바른 mimetype 형식이 아닙니다 (예: image/png)',
    ),
});

export class UploadQueryDto extends createZodDto(UploadQuerySchema) {}

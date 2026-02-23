import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { ErrorFilter, HttpExceptionFilter } from '../filters/index.js';

export const globalProviders: Provider[] = [
  {
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ZodSerializerInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: ErrorFilter,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];

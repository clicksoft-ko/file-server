import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { setupSwagger } from './core/setup/swagger.setup.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Trust Proxy
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

  // Security & Compression
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors();

  // Global Prefix
  app.setGlobalPrefix('api');

  // Logger (Pino)
  app.useLogger(app.get(Logger));

  // Swagger (개발 환경만)
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

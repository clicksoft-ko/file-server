import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { cleanupOpenApiDoc } from 'nestjs-zod';

export function setupSwagger(app: INestApplication): void {
  app.use(
    '/api/swagger',
    basicAuth({ challenge: true, users: { admin: '1234' } }),
  );

  const config = new DocumentBuilder()
    .setTitle('Image Server API')
    .setDescription('Image Server API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/swagger', app, cleanupOpenApiDoc(document));
}

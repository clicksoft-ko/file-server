import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from './config/config.module.js';
import { PinoConfig } from './config/pino.config.js';
import { globalProviders } from './core/providers/index.js';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot({ pinoHttp: PinoConfig.getPinoHttpConfig() }),
  ],
  controllers: [AppController],
  providers: [AppService, ...globalProviders],
})
export class AppModule {}

import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch(Error)
export class ErrorFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(error.stack, `Unhandled Exception: ${error.message}`);

    response.status(500).json({
      statusCode: 500,
      message: error.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

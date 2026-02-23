import { Options } from 'pino-http';

export class PinoConfig {
  static getPinoHttpConfig(): Options {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      level: isProduction ? 'info' : 'debug',
      transport: isProduction
        ? undefined
        : {
            target: 'pino-pretty',
            options: { colorize: true, levelFirst: true },
          },
      serializers: {
        err: (err: any) => {
          if (
            err &&
            typeof err === 'object' &&
            'status' in err &&
            typeof err.status === 'number' &&
            err.status >= 400 &&
            err.status < 500
          ) {
            return {
              type: err.name,
              message: err.message,
              status: err.status,
              errors: err.errors,
            };
          }
          return {
            type: err.name,
            message: err.message,
            status: err.status,
            stack: isProduction ? undefined : err.stack,
          };
        },
        req: (req: any) => ({
          id: req.id,
          method: req.method,
          url: req.url,
          remoteAddress: req.remoteAddress,
          xForwardedFor: req.headers?.['x-forwarded-for'],
          userAgent: req.headers?.['user-agent'],
        }),
        res: (res: any) => ({
          statusCode: res.statusCode,
        }),
      },
    };
  }
}

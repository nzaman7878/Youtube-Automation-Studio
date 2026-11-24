import { pinoHttp } from 'pino-http';
import { logger } from '../logger/index.js';
import { type Request, type Response } from 'express';

export const loggingMiddleware = pinoHttp({
  logger,
  genReqId: (req: Request) => req.id || req.headers['x-request-id'] || 'unknown',
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req: Request, res: Response) => {
    return `${req.method} ${req.url} completed with status ${res.statusCode}`;
  },
  customErrorMessage: (req: Request, res: Response, err: Error) => {
    return `${req.method} ${req.url} failed with status ${res.statusCode}: ${err.message}`;
  },
});

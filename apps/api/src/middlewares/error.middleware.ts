import { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error.js';
import { logger } from '../logger/index.js';
import { config } from '../config.js';
import { type ApiResponse } from '../utils/response.js';

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const timestamp = new Date().toISOString();
  const rawId = req.id ?? req.headers['x-request-id'];
  const requestId = rawId !== undefined ? String(rawId) : undefined;

  // 1. Handled Domain / Application Errors
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err, requestId }, `Critical non-operational error: ${err.message}`);
    }

    const payload: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId,
        timestamp,
      },
    };

    res.status(err.statusCode).json(payload);
    return;
  }

  // 2. Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const issues = err.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
    }));

    const payload: ApiResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data provided',
        details: issues,
        requestId,
        timestamp,
      },
    };

    res.status(400).json(payload);
    return;
  }

  // 3. JSON Syntax / Body Parser Errors
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    const payload: ApiResponse = {
      success: false,
      error: {
        code: 'MALFORMED_JSON',
        message: 'Malformed JSON payload in request body',
        requestId,
        timestamp,
      },
    };

    res.status(400).json(payload);
    return;
  }

  // 4. Unhandled / Internal Server Errors
  logger.error({ err, requestId }, 'Unhandled Exception');

  const isProduction = config.NODE_ENV === 'production';
  const errorMessage = isProduction
    ? 'An unexpected internal server error occurred'
    : err instanceof Error
      ? err.message
      : 'Unknown internal error';

  const payload: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage,
      details: !isProduction && err instanceof Error ? { stack: err.stack } : undefined,
      requestId,
      timestamp,
    },
  };

  res.status(500).json(payload);
}

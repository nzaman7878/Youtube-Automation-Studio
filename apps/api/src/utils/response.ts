import { type Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
    timestamp: string;
  };
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>,
): Response {
  const responsePayload: ApiResponse<T> = {
    success: true,
    data,
    meta,
  };
  return res.status(statusCode).json(responsePayload);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  meta?: Record<string, unknown>,
): Response {
  return sendSuccess(res, data, 201, meta);
}

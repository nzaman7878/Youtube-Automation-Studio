import pino from 'pino';
import { config } from '../config.js';

const isProduction = config.NODE_ENV === 'production';
const isTest = config.NODE_ENV === 'test';

export const logger = pino({
  level: isTest ? 'silent' : isProduction ? 'info' : 'debug',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-api-key"]',
      '*.password',
      '*.token',
      '*.secret',
      '*.refreshToken',
      '*.accessToken',
      '*.apiKey',
      'password',
      'token',
      'secret',
      'refreshToken',
      'accessToken',
      'apiKey',
    ],
    remove: true,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    !isProduction && !isTest
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

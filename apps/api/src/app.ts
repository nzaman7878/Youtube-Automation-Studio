import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config.js';
import { requestIdMiddleware } from './middlewares/request-id.middleware.js';
import { loggingMiddleware } from './middlewares/logging.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import v1Routes from './routes/index.js';

export function createApp(): Express {
  const app: Express = express();

  // Security headers
  app.use(helmet());

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    }),
  );

  // Response compression
  app.use(compression());

  // Request parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Tracing & Logging
  app.use(requestIdMiddleware);
  app.use(loggingMiddleware);

  // Health root alias
  app.use('/health', (_req, res) => {
    res.redirect(301, '/api/v1/health');
  });

  // API v1 Routing
  app.use('/api/v1', v1Routes);

  // Catch unmatched routes (404)
  app.use(notFoundMiddleware);

  // Centralized Global Error Handler
  app.use(errorMiddleware);

  return app;
}

export const app: Express = createApp();
export default app;

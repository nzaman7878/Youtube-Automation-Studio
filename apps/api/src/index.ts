import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { QuotaConstants } from '@yt-studio/shared';
import { config } from './config.js';

const app: Express = express();

app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'yt-automation-studio-api',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
    quotaCircuitBreakerThreshold: QuotaConstants.CIRCUIT_BREAKER_THRESHOLD_PERCENT,
  });
});

if (config.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    console.log(`YT Studio API server running on port ${config.PORT} [${config.NODE_ENV}]`);
  });
}

export default app;

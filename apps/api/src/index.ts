import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { QuotaConstants } from '@yt-studio/shared';

const app: Express = express();
const port = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'yt-automation-studio-api',
    timestamp: new Date().toISOString(),
    quotaCircuitBreakerThreshold: QuotaConstants.CIRCUIT_BREAKER_THRESHOLD_PERCENT,
  });
});

if (process.env['NODE_ENV'] !== 'test') {
  app.listen(port, () => {
    console.log(`YT Studio API server running on port ${port}`);
  });
}

export default app;

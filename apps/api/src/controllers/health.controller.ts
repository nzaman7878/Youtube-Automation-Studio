import { type Request, type Response } from 'express';
import { sendSuccess } from '../utils/response.js';
import { config } from '../config.js';
import { QuotaConstants } from '@yt-studio/shared';

export interface HealthCheckData {
  status: 'healthy' | 'degraded';
  version: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  memory: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
  };
  services: {
    api: 'up';
    database: 'pending_connection' | 'connected';
    redis: 'pending_connection' | 'connected';
  };
  quota: {
    defaultLimit: number;
    circuitBreakerThresholdPercent: number;
  };
}

export function getHealthStatus(_req: Request, res: Response): Response {
  const memoryUsage = process.memoryUsage();

  const healthData: HealthCheckData = {
    status: 'healthy',
    version: '1.0.0',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
      heapTotalMb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
      heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
    },
    services: {
      api: 'up',
      database: 'pending_connection',
      redis: 'pending_connection',
    },
    quota: {
      defaultLimit: QuotaConstants.DEFAULT_DAILY_QUOTA_LIMIT,
      circuitBreakerThresholdPercent: QuotaConstants.CIRCUIT_BREAKER_THRESHOLD_PERCENT,
    },
  };

  return sendSuccess(res, healthData);
}

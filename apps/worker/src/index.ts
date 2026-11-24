import { VideoPipelineStatus } from '@yt-studio/shared';
import { config } from './config.js';

export interface WorkerJobPayload {
  jobId: string;
  stage: VideoPipelineStatus;
  payload: Record<string, unknown>;
}

export function initializeWorker(): {
  status: string;
  environment: string;
  redisHost: string;
  supportedStages: VideoPipelineStatus[];
} {
  console.log(`Initializing YT Automation Studio BullMQ Worker subsystem [${config.NODE_ENV}]...`);
  console.log(`Connecting BullMQ queues to Redis at ${config.REDIS_HOST}:${config.REDIS_PORT}`);

  return {
    status: 'initialized',
    environment: config.NODE_ENV,
    redisHost: config.REDIS_HOST,
    supportedStages: Object.values(VideoPipelineStatus),
  };
}

if (config.NODE_ENV !== 'test') {
  initializeWorker();
}

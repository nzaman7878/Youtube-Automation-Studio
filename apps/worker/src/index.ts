import { VideoPipelineStatus } from '@yt-studio/shared';

export interface WorkerJobPayload {
  jobId: string;
  stage: VideoPipelineStatus;
  payload: Record<string, unknown>;
}

export function initializeWorker(): { status: string; supportedStages: VideoPipelineStatus[] } {
  console.log('Initializing YT Automation Studio BullMQ Worker subsystem...');
  return {
    status: 'initialized',
    supportedStages: Object.values(VideoPipelineStatus),
  };
}

if (process.env['NODE_ENV'] !== 'test') {
  initializeWorker();
}

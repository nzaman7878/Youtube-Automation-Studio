export * from './schemas/index.js';
export * from './config/index.js';

export const QuotaConstants = {
  DEFAULT_DAILY_QUOTA_LIMIT: 10000,
  COST_VIDEO_UPLOAD: 1600,
  COST_SEARCH: 100,
  COST_MUTATION: 50,
  COST_READ_LIST: 1,
  CIRCUIT_BREAKER_THRESHOLD_PERCENT: 85,
} as const;

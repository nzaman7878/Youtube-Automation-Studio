import { z } from 'zod';

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum SubscriptionTier {
  STARTER = 'STARTER',
  PRO = 'PRO',
  AGENCY = 'AGENCY',
  ENTERPRISE = 'ENTERPRISE',
}

export enum VideoPipelineStatus {
  IDEA = 'IDEA',
  RESEARCH = 'RESEARCH',
  SCRIPTING = 'SCRIPTING',
  ASSET_PREPARATION = 'ASSET_PREPARATION',
  SEO_REVIEW = 'SEO_REVIEW',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
}

export const QuotaConstants = {
  DEFAULT_DAILY_QUOTA_LIMIT: 10000,
  COST_VIDEO_UPLOAD: 1600,
  COST_SEARCH: 100,
  COST_MUTATION: 50,
  COST_READ_LIST: 1,
  CIRCUIT_BREAKER_THRESHOLD_PERCENT: 85,
} as const;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.nativeEnum(UserRole),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

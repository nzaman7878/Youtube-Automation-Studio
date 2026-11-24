import { z } from 'zod';

export enum ABTestType {
  TITLE = 'TITLE',
  THUMBNAIL = 'THUMBNAIL',
  TITLE_AND_THUMBNAIL = 'TITLE_AND_THUMBNAIL',
}

export enum ABTestStatus {
  DRAFT = 'DRAFT',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  CONCLUDED = 'CONCLUDED',
  STOPPED = 'STOPPED',
}

export const ABTestTypeSchema = z.nativeEnum(ABTestType);
export const ABTestStatusSchema = z.nativeEnum(ABTestStatus);

export const ABTestVariantSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1), // e.g. 'Variant A (Control)', 'Variant B'
  title: z.string().max(100).optional(),
  thumbnailUrl: z.string().url().optional(),
  impressions: z.number().int().nonnegative().default(0),
  clicks: z.number().int().nonnegative().default(0),
  ctrPercent: z.number().min(0).max(100).default(0),
  watchTimeMinutes: z.number().nonnegative().default(0),
  isActive: z.boolean().default(false),
  activeSince: z.date().optional(),
});

export const ABTestSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  channelId: z.string().uuid(),
  videoId: z.string().uuid(),
  testType: ABTestTypeSchema,
  status: ABTestStatusSchema.default(ABTestStatus.DRAFT),
  variants: z.array(ABTestVariantSchema).min(2).max(4),
  rotationIntervalHours: z.number().int().positive().default(24),
  confidenceThresholdPercent: z.number().min(80).max(99).default(95),
  winnerVariantId: z.string().uuid().optional(),
  currentVariantIndex: z.number().int().nonnegative().default(0),
  startedAt: z.date().optional(),
  endedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ABTestVariant = z.infer<typeof ABTestVariantSchema>;
export type ABTest = z.infer<typeof ABTestSchema>;

import { z } from 'zod';

export enum MetricTrend {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE',
}

export const MetricTrendSchema = z.nativeEnum(MetricTrend);

export const RetentionPointSchema = z.object({
  second: z.number().nonnegative(),
  percentage: z.number().min(0).max(100),
});

export const VideoAnalyticsSnapshotSchema = z.object({
  videoId: z.string().uuid(),
  youtubeVideoId: z.string(),
  views: z.number().int().nonnegative(),
  watchTimeHours: z.number().nonnegative(),
  averageViewDurationSeconds: z.number().nonnegative(),
  averageViewPercentage: z.number().min(0).max(100),
  impressions: z.number().int().nonnegative(),
  ctrPercent: z.number().min(0).max(100),
  likes: z.number().int().nonnegative(),
  comments: z.number().int().nonnegative(),
  shares: z.number().int().nonnegative(),
  estimatedRevenueUsd: z.number().nonnegative().optional(),
  retentionCurve: z.array(RetentionPointSchema).default([]),
  capturedAt: z.date(),
});

export const ChannelAnalyticsSnapshotSchema = z.object({
  channelId: z.string().uuid(),
  youtubeChannelId: z.string(),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  totalViews: z.number().int().nonnegative(),
  totalWatchTimeHours: z.number().nonnegative(),
  totalSubscribersGained: z.number().int().nonnegative(),
  totalSubscribersLost: z.number().int().nonnegative(),
  netSubscribers: z.number().int(),
  totalImpressions: z.number().int().nonnegative(),
  overallCtrPercent: z.number().min(0).max(100),
  estimatedRevenueUsd: z.number().nonnegative().optional(),
  capturedAt: z.date(),
});

export type RetentionPoint = z.infer<typeof RetentionPointSchema>;
export type VideoAnalyticsSnapshot = z.infer<typeof VideoAnalyticsSnapshotSchema>;
export type ChannelAnalyticsSnapshot = z.infer<typeof ChannelAnalyticsSnapshotSchema>;

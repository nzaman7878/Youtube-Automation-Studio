import { z } from 'zod';
import { VideoPipelineStatusSchema } from './video.schema.js';

export enum AgentType {
  RESEARCH = 'RESEARCH',
  IDEA = 'IDEA',
  SCRIPT = 'SCRIPT',
  SEO = 'SEO',
  THUMBNAIL_BRIEF = 'THUMBNAIL_BRIEF',
  MODERATION = 'MODERATION',
  ANALYTICS = 'ANALYTICS',
}

export const AgentTypeSchema = z.nativeEnum(AgentType);

export const TokenUsageSchema = z.object({
  promptTokens: z.number().int().nonnegative(),
  completionTokens: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
});

export const CostMetricsSchema = z.object({
  costUsd: z.number().nonnegative(),
  latencyMs: z.number().nonnegative(),
});

export const AIGenerationAuditSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  channelId: z.string().uuid(),
  videoId: z.string().uuid().optional(),
  agentType: AgentTypeSchema,
  stage: VideoPipelineStatusSchema.optional(),
  provider: z.string(),
  model: z.string(),
  promptSnapshot: z.string(),
  completionOutput: z.string(),
  structuredOutput: z.record(z.unknown()).optional(),
  tokenUsage: TokenUsageSchema,
  costMetrics: CostMetricsSchema,
  createdAt: z.date(),
});

export const ThumbnailBriefSchema = z.object({
  concept: z.string().min(1),
  focalPoints: z.array(z.string()).min(1),
  compositionLayout: z.string(),
  colorPalette: z.array(z.string()).min(2),
  typographyBrief: z.object({
    headline: z.string().max(30),
    fontStyle: z.string(),
    placement: z.string(),
  }),
  visualCues: z.array(z.string()).default([]),
  emotionalHook: z.string(),
});

export type AgentTypeEnum = z.infer<typeof AgentTypeSchema>;
export type TokenUsage = z.infer<typeof TokenUsageSchema>;
export type CostMetrics = z.infer<typeof CostMetricsSchema>;
export type AIGenerationAudit = z.infer<typeof AIGenerationAuditSchema>;
export type ThumbnailBrief = z.infer<typeof ThumbnailBriefSchema>;

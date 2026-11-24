import { z } from 'zod';

export const WebhookEventTypeSchema = z.enum([
  'video.drafted',
  'video.scheduled',
  'video.upload_started',
  'video.upload_progress',
  'video.published',
  'video.failed',
  'comment.received',
  'comment.flagged',
  'comment.replied',
  'quota.warning',
  'quota.circuit_breaker',
  'ab_test.concluded',
]);

export const N8nWebhookPayloadSchema = z.object({
  eventId: z.string().uuid(),
  eventType: WebhookEventTypeSchema,
  workspaceId: z.string().uuid(),
  channelId: z.string().uuid().optional(),
  data: z.record(z.unknown()),
  timestamp: z.string().datetime(),
  signature: z.string().min(1),
});

export type WebhookEventType = z.infer<typeof WebhookEventTypeSchema>;
export type N8nWebhookPayload = z.infer<typeof N8nWebhookPayloadSchema>;

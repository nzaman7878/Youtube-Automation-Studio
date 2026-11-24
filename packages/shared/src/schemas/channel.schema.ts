import { z } from 'zod';

export const YOUTUBE_CHANNEL_ID_REGEX = /^UC[a-zA-Z0-9_-]{22}$/;

export const EncryptedTokenSchema = z.object({
  iv: z.string().min(16),
  ciphertext: z.string().min(1),
  tag: z.string().min(16),
  encryptedAt: z.date().default(() => new Date()),
});

export const ChannelMetadataSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  customUrl: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  subscriberCount: z.number().int().nonnegative().default(0),
  videoCount: z.number().int().nonnegative().default(0),
  viewCount: z.number().int().nonnegative().default(0),
  defaultLanguage: z.string().default('en'),
  country: z.string().optional(),
});

export const ChannelQuotaBudgetSchema = z.object({
  allocatedDailyUnits: z.number().int().positive().default(10000),
  usedTodayUnits: z.number().int().nonnegative().default(0),
  lastResetDatePst: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const ChannelSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  youtubeChannelId: z.string().regex(YOUTUBE_CHANNEL_ID_REGEX, 'Invalid YouTube Channel ID format (must start with UC and be 24 characters)'),
  metadata: ChannelMetadataSchema,
  quotaBudget: ChannelQuotaBudgetSchema,
  credentials: z.object({
    accessTokenEncrypted: EncryptedTokenSchema,
    refreshTokenEncrypted: EncryptedTokenSchema,
    tokenExpiresAt: z.date(),
    scopes: z.array(z.string()).min(1),
  }),
  syncStatus: z.enum(['SYNCING', 'IDLE', 'ERROR']).default('IDLE'),
  lastSyncedAt: z.date().optional(),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ConnectChannelSchema = z.object({
  workspaceId: z.string().uuid(),
  code: z.string().min(1),
  redirectUri: z.string().url(),
});

export type Channel = z.infer<typeof ChannelSchema>;
export type ChannelMetadata = z.infer<typeof ChannelMetadataSchema>;
export type ChannelQuotaBudget = z.infer<typeof ChannelQuotaBudgetSchema>;
export type EncryptedToken = z.infer<typeof EncryptedTokenSchema>;
export type ConnectChannelInput = z.infer<typeof ConnectChannelSchema>;

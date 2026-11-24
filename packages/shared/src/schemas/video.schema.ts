import { z } from 'zod';

export const YOUTUBE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

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

export enum PrivacyStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

export const VideoPipelineStatusSchema = z.nativeEnum(VideoPipelineStatus);
export const PrivacyStatusSchema = z.nativeEnum(PrivacyStatus);

export const VideoMetadataSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(100, 'YouTube video title cannot exceed 100 characters'),
  description: z
    .string()
    .max(5000, 'YouTube video description cannot exceed 5000 characters')
    .default(''),
  tags: z
    .array(z.string().min(1).max(100))
    .default([])
    .refine(
      (tags) => tags.join(',').length <= 500,
      'Total character count of video tags joined with commas must not exceed 500 characters',
    ),
  categoryId: z.string().default('27'), // 27 = Education
  privacyStatus: PrivacyStatusSchema.default(PrivacyStatus.PRIVATE),
  scheduledPublishTime: z.date().optional(),
  playlistIds: z.array(z.string()).default([]),
});

export const VideoAssetsSchema = z.object({
  thumbnailUrl: z.string().url().optional(),
  thumbnailStorageKey: z.string().optional(),
  videoStorageKey: z.string().optional(),
  durationSeconds: z.number().nonnegative().optional(),
  resolution: z.string().optional(),
  srtStorageKey: z.string().optional(),
});

export const VideoSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  channelId: z.string().uuid(),
  youtubeVideoId: z.string().regex(YOUTUBE_VIDEO_ID_REGEX).optional(),
  status: VideoPipelineStatusSchema.default(VideoPipelineStatus.IDEA),
  metadata: VideoMetadataSchema,
  assets: VideoAssetsSchema.default({}),
  uploadProgressPercent: z.number().min(0).max(100).default(0),
  activeABTestId: z.string().uuid().optional(),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateVideoDraftSchema = z.object({
  workspaceId: z.string().uuid(),
  channelId: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(5000).optional(),
  status: VideoPipelineStatusSchema.optional(),
});

export const UpdateVideoMetadataSchema = VideoMetadataSchema.partial();

export type Video = z.infer<typeof VideoSchema>;
export type VideoMetadata = z.infer<typeof VideoMetadataSchema>;
export type VideoAssets = z.infer<typeof VideoAssetsSchema>;
export type CreateVideoDraftInput = z.infer<typeof CreateVideoDraftSchema>;
export type UpdateVideoMetadataInput = z.infer<typeof UpdateVideoMetadataSchema>;

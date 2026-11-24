import { z } from 'zod';

export enum CommentCategory {
  PRAISE = 'PRAISE',
  QUESTION = 'QUESTION',
  IDEA = 'IDEA',
  CRITIQUE = 'CRITIQUE',
  SPAM = 'SPAM',
  ABUSE = 'ABUSE',
}

export enum ModerationStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REPLIED = 'REPLIED',
}

export const CommentCategorySchema = z.nativeEnum(CommentCategory);
export const ModerationStatusSchema = z.nativeEnum(ModerationStatus);

export const CommentAuthorSchema = z.object({
  displayName: z.string(),
  channelId: z.string(),
  profileImageUrl: z.string().url().optional(),
  isChannelOwner: z.boolean().default(false),
});

export const CommentDraftReplySchema = z.object({
  replyText: z.string().min(1).max(500),
  generatedByAgent: z.string(),
  generatedAt: z.date(),
  approvedByUserId: z.string().uuid().optional(),
  approvedAt: z.date().optional(),
  publishedToYouTube: z.boolean().default(false),
  youtubeReplyId: z.string().optional(),
});

export const CommentSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  channelId: z.string().uuid(),
  videoId: z.string().uuid(),
  youtubeCommentId: z.string().min(1),
  parentYoutubeCommentId: z.string().optional(),
  text: z.string(),
  author: CommentAuthorSchema,
  likeCount: z.number().int().nonnegative().default(0),
  category: CommentCategorySchema.default(CommentCategory.QUESTION),
  sentimentScore: z.number().min(-1).max(1).default(0),
  moderationStatus: ModerationStatusSchema.default(ModerationStatus.PENDING_APPROVAL),
  draftReply: CommentDraftReplySchema.optional(),
  publishedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Comment = z.infer<typeof CommentSchema>;
export type CommentAuthor = z.infer<typeof CommentAuthorSchema>;
export type CommentDraftReply = z.infer<typeof CommentDraftReplySchema>;

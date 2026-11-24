import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import {
  UserSchema,
  UserRole,
  WorkspaceSchema,
  SubscriptionTier,
  ChannelSchema,
  YOUTUBE_CHANNEL_ID_REGEX,
  VideoMetadataSchema,
  VideoSchema,
  PrivacyStatus,
  VideoPipelineStatus,
  AIGenerationAuditSchema,
  AgentType,
  CommentSchema,
  CommentCategory,
  ModerationStatus,
  ABTestSchema,
  ABTestType,
  AuditLogEntrySchema,
  AuditAction,
  AuditTarget,
  N8nWebhookPayloadSchema,
} from '../index.js';

describe('Domain Schemas & Validation Constraints', () => {
  describe('User Schema', () => {
    it('validates a correct user object', () => {
      const validUser = {
        id: crypto.randomUUID(),
        email: 'creator@example.com',
        name: 'Jordan Sparks',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.emailVerified).toBe(false);
        expect(result.data.profile.timezone).toBe('UTC');
      }
    });

    it('rejects invalid email formats and non-uuid IDs', () => {
      const invalid = {
        id: 'not-a-uuid',
        email: 'invalid-email-address',
        name: 'Alex',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('Workspace Schema', () => {
    it('validates a valid workspace with valid slug', () => {
      const valid = {
        id: crypto.randomUUID(),
        name: 'Aura Media Global',
        slug: 'aura-media-global',
        ownerId: crypto.randomUUID(),
        tier: SubscriptionTier.AGENCY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorkspaceSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.quotaConfig.dailyQuotaLimit).toBe(10000);
        expect(result.data.quotaConfig.circuitBreakerPercent).toBe(85);
      }
    });

    it('rejects uppercase or invalid symbols in workspace slug', () => {
      const invalid = {
        id: crypto.randomUUID(),
        name: 'Invalid Slug Space',
        slug: 'Aura Media!',
        ownerId: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorkspaceSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('Channel & YouTube Constraints', () => {
    it('matches exact YouTube channel ID format', () => {
      expect(YOUTUBE_CHANNEL_ID_REGEX.test('UC_x5XG1OV2P6uZZ5FSM9Ttw')).toBe(true);
      expect(YOUTUBE_CHANNEL_ID_REGEX.test('UC1234567890123456789012')).toBe(true);
      // Fails if does not start with UC
      expect(YOUTUBE_CHANNEL_ID_REGEX.test('AB_x5XG1OV2P6uZZ5FSM9Ttw')).toBe(false);
      // Fails if wrong length
      expect(YOUTUBE_CHANNEL_ID_REGEX.test('UC_short')).toBe(false);
    });

    it('validates channel schema with encrypted tokens', () => {
      const channel = {
        id: crypto.randomUUID(),
        workspaceId: crypto.randomUUID(),
        youtubeChannelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
        metadata: {
          title: 'Aura Tech Academy',
        },
        quotaBudget: {
          allocatedDailyUnits: 10000,
          usedTodayUnits: 1600,
          lastResetDatePst: '2026-11-24',
        },
        credentials: {
          accessTokenEncrypted: {
            iv: '1234567890abcdef',
            ciphertext: 'encrypted_access_data',
            tag: '1234567890abcdef',
          },
          refreshTokenEncrypted: {
            iv: '1234567890abcdef',
            ciphertext: 'encrypted_refresh_data',
            tag: '1234567890abcdef',
          },
          tokenExpiresAt: new Date(Date.now() + 3600000),
          scopes: ['https://www.googleapis.com/auth/youtube.upload'],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = ChannelSchema.safeParse(channel);
      expect(result.success).toBe(true);
    });
  });

  describe('Video & YouTube Upload Hard Constraints', () => {
    it('enforces YouTube title limit of 100 characters', () => {
      const validTitle = 'A'.repeat(100);
      const invalidTitle = 'A'.repeat(101);

      expect(VideoMetadataSchema.safeParse({ title: validTitle }).success).toBe(true);
      expect(VideoMetadataSchema.safeParse({ title: invalidTitle }).success).toBe(false);
      expect(VideoMetadataSchema.safeParse({ title: '' }).success).toBe(false);
    });

    it('enforces YouTube description limit of 5,000 characters', () => {
      const validDesc = 'D'.repeat(5000);
      const invalidDesc = 'D'.repeat(5001);

      expect(VideoMetadataSchema.safeParse({ title: 'Valid Title', description: validDesc }).success).toBe(true);
      expect(VideoMetadataSchema.safeParse({ title: 'Valid Title', description: invalidDesc }).success).toBe(false);
    });

    it('enforces YouTube tags cumulative character limit of 500 characters', () => {
      // 5 tags of 90 chars joined by commas = 5*90 + 4 = 454 chars (valid)
      const validTags = Array(5).fill('a'.repeat(90));
      expect(VideoMetadataSchema.safeParse({ title: 'Valid Title', tags: validTags }).success).toBe(true);

      // 6 tags of 90 chars joined by commas = 6*90 + 5 = 545 chars (invalid > 500)
      const invalidTags = Array(6).fill('a'.repeat(90));
      expect(VideoMetadataSchema.safeParse({ title: 'Valid Title', tags: invalidTags }).success).toBe(false);
    });

    it('validates full Video schema lifecycle', () => {
      const video = {
        id: crypto.randomUUID(),
        workspaceId: crypto.randomUUID(),
        channelId: crypto.randomUUID(),
        youtubeVideoId: 'dQw4w9WgXcQ',
        status: VideoPipelineStatus.SEO_REVIEW,
        metadata: {
          title: 'Top 10 AI Breakthroughs in 2026',
          description: 'A deep dive into frontier AI agents and architectures.',
          tags: ['ai', 'tech', 'future'],
          privacyStatus: PrivacyStatus.UNLISTED,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = VideoSchema.safeParse(video);
      expect(result.success).toBe(true);
    });
  });

  describe('AI Agent Audit Schema', () => {
    it('validates complete AI execution record with costs and tokens', () => {
      const audit = {
        id: crypto.randomUUID(),
        workspaceId: crypto.randomUUID(),
        channelId: crypto.randomUUID(),
        agentType: AgentType.SCRIPT,
        provider: 'gemini',
        model: 'gemini-2.0-flash',
        promptSnapshot: 'Generate a 10-minute video script on quantum computing.',
        completionOutput: '# Hook\nWhat if computers could think in multiple realities?',
        tokenUsage: {
          promptTokens: 120,
          completionTokens: 850,
          totalTokens: 970,
        },
        costMetrics: {
          costUsd: 0.00035,
          latencyMs: 1420,
        },
        createdAt: new Date(),
      };

      const result = AIGenerationAuditSchema.safeParse(audit);
      expect(result.success).toBe(true);
    });
  });

  describe('Human-in-the-Loop Comment Moderation Schema', () => {
    it('defaults moderation status to PENDING_APPROVAL and validates category', () => {
      const comment = {
        id: crypto.randomUUID(),
        workspaceId: crypto.randomUUID(),
        channelId: crypto.randomUUID(),
        videoId: crypto.randomUUID(),
        youtubeCommentId: 'UgxK918237192837',
        text: 'Where can I find the GitHub repository for this project?',
        author: {
          displayName: 'DevGuru',
          channelId: 'UC1234567890123456789012',
        },
        category: CommentCategory.QUESTION,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = CommentSchema.safeParse(comment);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.moderationStatus).toBe(ModerationStatus.PENDING_APPROVAL);
      }
    });
  });

  describe('A/B Testing & Audit Schema', () => {
    it('validates an A/B test with at least 2 variants', () => {
      const abTest = {
        id: crypto.randomUUID(),
        workspaceId: crypto.randomUUID(),
        channelId: crypto.randomUUID(),
        videoId: crypto.randomUUID(),
        testType: ABTestType.TITLE,
        variants: [
          {
            id: crypto.randomUUID(),
            label: 'Variant A (Control)',
            title: 'How to Build an AI Agent in 2026',
            isActive: true,
          },
          {
            id: crypto.randomUUID(),
            label: 'Variant B',
            title: 'Building AI Agents: The Ultimate Masterclass',
            isActive: false,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = ABTestSchema.safeParse(abTest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.confidenceThresholdPercent).toBe(95);
      }
    });

    it('validates an audit log entry', () => {
      const entry = {
        id: crypto.randomUUID(),
        workspaceId: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        action: AuditAction.PUBLISH,
        targetType: AuditTarget.VIDEO,
        targetId: 'video_id_99',
        createdAt: new Date(),
      };

      expect(AuditLogEntrySchema.safeParse(entry).success).toBe(true);
    });

    it('validates n8n webhook payload with ISO timestamp', () => {
      const webhook = {
        eventId: crypto.randomUUID(),
        eventType: 'video.published',
        workspaceId: crypto.randomUUID(),
        data: { videoId: '123', url: 'https://youtube.com/watch?v=123' },
        timestamp: new Date().toISOString(),
        signature: 'sha256_mock_sig',
      };

      expect(N8nWebhookPayloadSchema.safeParse(webhook).success).toBe(true);
    });
  });
});

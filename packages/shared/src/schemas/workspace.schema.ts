import { z } from 'zod';
import { UserRole, UserRoleSchema } from './user.schema.js';

export enum SubscriptionTier {
  STARTER = 'STARTER',
  PRO = 'PRO',
  AGENCY = 'AGENCY',
  ENTERPRISE = 'ENTERPRISE',
}

export const SubscriptionTierSchema = z.nativeEnum(SubscriptionTier);

export const WorkspaceQuotaConfigSchema = z.object({
  dailyQuotaLimit: z.number().int().positive().default(10000),
  reservedUploadQuota: z.number().int().nonnegative().default(6000),
  circuitBreakerPercent: z.number().min(50).max(95).default(85),
});

export const WorkspaceMemberSchema = z.object({
  userId: z.string().uuid(),
  role: UserRoleSchema,
  joinedAt: z.date(),
});

export const WorkspaceInvitationSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: UserRoleSchema.default(UserRole.EDITOR),
  token: z.string().min(16),
  invitedByUserId: z.string().uuid(),
  status: z.enum(['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED']).default('PENDING'),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and dashes'),
  tier: SubscriptionTierSchema.default(SubscriptionTier.STARTER),
  ownerId: z.string().uuid(),
  members: z.array(WorkspaceMemberSchema).default([]),
  quotaConfig: WorkspaceQuotaConfigSchema.default({
    dailyQuotaLimit: 10000,
    reservedUploadQuota: 6000,
    circuitBreakerPercent: 85,
  }),
  isDeleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateWorkspaceSchema = WorkspaceSchema.pick({
  name: true,
  slug: true,
});

export const UpdateWorkspaceSchema = WorkspaceSchema.pick({
  name: true,
  quotaConfig: true,
}).partial();

export type Workspace = z.infer<typeof WorkspaceSchema>;
export type WorkspaceMember = z.infer<typeof WorkspaceMemberSchema>;
export type WorkspaceInvitation = z.infer<typeof WorkspaceInvitationSchema>;
export type WorkspaceQuotaConfig = z.infer<typeof WorkspaceQuotaConfigSchema>;
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;

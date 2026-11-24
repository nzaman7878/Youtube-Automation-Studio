import { z } from 'zod';

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  SUSPENDED = 'SUSPENDED',
}

export const UserRoleSchema = z.nativeEnum(UserRole);
export const UserStatusSchema = z.nativeEnum(UserStatus);

export const UserProfileSchema = z.object({
  avatarUrl: z.string().url().optional(),
  timezone: z.string().default('UTC'),
  bio: z.string().max(500).optional(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: UserRoleSchema.default(UserRole.EDITOR),
  status: UserStatusSchema.default(UserStatus.PENDING_VERIFICATION),
  profile: UserProfileSchema.default({ timezone: 'UTC' }),
  emailVerified: z.boolean().default(false),
  lastLoginAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = UserSchema.pick({
  email: true,
  name: true,
}).extend({
  password: z.string().min(8).max(128),
  role: UserRoleSchema.optional(),
});

export const UpdateUserSchema = UserSchema.pick({
  name: true,
  profile: true,
}).partial();

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;

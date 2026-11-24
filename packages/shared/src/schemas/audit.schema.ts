import { z } from 'zod';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  PUBLISH = 'PUBLISH',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CIRCUIT_BREAKER_TRIGGERED = 'CIRCUIT_BREAKER_TRIGGERED',
}

export enum AuditTarget {
  WORKSPACE = 'WORKSPACE',
  USER = 'USER',
  CHANNEL = 'CHANNEL',
  VIDEO = 'VIDEO',
  COMMENT = 'COMMENT',
  WORKFLOW = 'WORKFLOW',
  QUOTA = 'QUOTA',
  SETTINGS = 'SETTINGS',
}

export const AuditActionSchema = z.nativeEnum(AuditAction);
export const AuditTargetSchema = z.nativeEnum(AuditTarget);

export const AuditLogEntrySchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  userId: z.string().uuid().optional(), // undefined for system actions
  action: AuditActionSchema,
  targetType: AuditTargetSchema,
  targetId: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  previousState: z.record(z.unknown()).optional(),
  newState: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
});

export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;

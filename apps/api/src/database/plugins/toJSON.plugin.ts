import { type Schema } from 'mongoose';

export interface ToJsonOptions {
  removeVersion?: boolean;
  removePrivateFields?: boolean;
  customTransform?: (ret: Record<string, unknown>) => void;
}

export const SENSITIVE_FIELDS: readonly string[] = [
  'password',
  'passwordHash',
  'token',
  'refreshToken',
  'secret',
  'encryptionKey',
  'oauthAccessToken',
  'oauthRefreshToken',
] as const;

/**
 * Mongoose Schema Plugin: toJSONPlugin
 * - Replaces `_id` with string `id`
 * - Removes `__v`
 * - Strips sensitive credentials from API serialization
 */
export function toJSONPlugin(schema: Schema, options: ToJsonOptions = {}): void {
  const { removeVersion = true, removePrivateFields = true } = options;

  schema.set(
    'toJSON',
    {
      virtuals: true,
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        // 1. Transform _id to id string
        if (ret['_id'] !== undefined) {
          ret['id'] = String(ret['_id']);
          delete ret['_id'];
        }

        // 2. Remove version key __v
        if (removeVersion && ret['__v'] !== undefined) {
          delete ret['__v'];
        }

        // 3. Strip sensitive fields
        if (removePrivateFields) {
          for (const field of SENSITIVE_FIELDS) {
            if (ret[field] !== undefined) {
              delete ret[field];
            }
          }
        }

        // 4. Run user-defined custom transform if provided
        if (options.customTransform) {
          options.customTransform(ret);
        }

        return ret;
      },
    } as unknown as Record<string, unknown>,
  );

  schema.set(
    'toObject',
    {
      virtuals: true,
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        if (ret['_id'] !== undefined) {
          ret['id'] = String(ret['_id']);
          delete ret['_id'];
        }
        if (removeVersion && ret['__v'] !== undefined) {
          delete ret['__v'];
        }
        return ret;
      },
    } as unknown as Record<string, unknown>,
  );
}

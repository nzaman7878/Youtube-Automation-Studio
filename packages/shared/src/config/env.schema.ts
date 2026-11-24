import { z } from 'zod';

export const NodeEnvEnum = z.enum(['development', 'test', 'production']);
export type NodeEnv = z.infer<typeof NodeEnvEnum>;

export const LlmProviderEnum = z.enum(['gemini', 'openai', 'anthropic']);
export type LlmProvider = z.infer<typeof LlmProviderEnum>;

export const EnvSchema = z
  .object({
    // App Core
    NODE_ENV: NodeEnvEnum.default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    CORS_ORIGIN: z.string().min(1).default('http://localhost:3000'),

    // Database & Redis
    MONGODB_URI: z
      .string()
      .regex(/^mongodb(\+srv)?:\/\/.+/, 'MONGODB_URI must start with mongodb:// or mongodb+srv://')
      .default('mongodb://localhost:27017/yt_automation_studio?replicaSet=rs0&directConnection=true'),
    REDIS_HOST: z.string().min(1).default('localhost'),
    REDIS_PORT: z.coerce.number().int().positive().default(6379),
    REDIS_PASSWORD: z.string().optional().default('redis_dev_secret_456'),
    REDIS_URL: z.string().optional(),

    // n8n Integration
    N8N_PORT: z.coerce.number().int().positive().default(5678),
    N8N_WEBHOOK_URL: z.string().url().default('http://localhost:5678/'),
    N8N_API_KEY: z.string().optional(),

    // Auth & JWT Security (Hard requirement: min 32 characters)
    JWT_ACCESS_SECRET: z
      .string()
      .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters long for cryptographic safety')
      .default('dev_jwt_access_secret_min_32_characters_random_key_1'),
    JWT_REFRESH_SECRET: z
      .string()
      .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters long for cryptographic safety')
      .default('dev_jwt_refresh_secret_min_32_characters_random_key_2'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    // Token Encryption (Hard requirement: 64 hex characters = 256-bit key for AES-256-GCM)
    TOKEN_ENCRYPTION_KEY_HEX: z
      .string()
      .regex(/^[0-9a-fA-F]{64}$/, 'TOKEN_ENCRYPTION_KEY_HEX must be exactly 64 hexadecimal characters (32 bytes)')
      .default('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),

    // Google / YouTube OAuth
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_REDIRECT_URI: z.string().url().default('http://localhost:4000/api/v1/youtube/oauth2/callback'),
    YOUTUBE_API_KEY: z.string().optional(),

    // AI Providers
    DEFAULT_LLM_PROVIDER: LlmProviderEnum.default('gemini'),
    GEMINI_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
  })
  .transform((data) => {
    // Automatically synthesize REDIS_URL if not explicitly specified
    const authPart = data.REDIS_PASSWORD ? `:${data.REDIS_PASSWORD}@` : '';
    const redisUrl = data.REDIS_URL ?? `redis://${authPart}${data.REDIS_HOST}:${data.REDIS_PORT}`;
    return {
      ...data,
      REDIS_URL: redisUrl,
    };
  });

export type AppConfig = z.infer<typeof EnvSchema>;

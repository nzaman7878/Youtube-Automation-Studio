import { describe, it, expect } from 'vitest';
import { validateConfig, ConfigValidationError } from '../index.js';

describe('Configuration System & Validation', () => {
  it('loads valid configuration with sane defaults when environment is minimal', () => {
    const config = validateConfig({});

    expect(config.NODE_ENV).toBe('development');
    expect(config.PORT).toBe(4000);
    expect(config.CORS_ORIGIN).toBe('http://localhost:3000');
    expect(config.REDIS_HOST).toBe('localhost');
    expect(config.REDIS_PORT).toBe(6379);
    expect(config.REDIS_URL).toContain('redis://:redis_dev_secret_456@localhost:6379');
    expect(config.JWT_ACCESS_SECRET.length).toBeGreaterThanOrEqual(32);
    expect(config.JWT_REFRESH_SECRET.length).toBeGreaterThanOrEqual(32);
    expect(config.TOKEN_ENCRYPTION_KEY_HEX).toHaveLength(64);
    expect(config.DEFAULT_LLM_PROVIDER).toBe('gemini');
  });

  it('coerces numeric and boolean strings correctly', () => {
    const config = validateConfig({
      PORT: '8080',
      REDIS_PORT: '6380',
      N8N_PORT: '5680',
    });

    expect(config.PORT).toBe(8080);
    expect(config.REDIS_PORT).toBe(6380);
    expect(config.N8N_PORT).toBe(5680);
  });

  it('rejects invalid NODE_ENV', () => {
    expect(() =>
      validateConfig({ NODE_ENV: 'staging' as unknown as 'development' }),
    ).toThrowError(ConfigValidationError);
  });

  it('enforces minimum 32 characters for JWT_ACCESS_SECRET', () => {
    expect(() =>
      validateConfig({
        JWT_ACCESS_SECRET: 'too-short-secret',
      }),
    ).toThrowError(ConfigValidationError);
  });

  it('enforces minimum 32 characters for JWT_REFRESH_SECRET', () => {
    expect(() =>
      validateConfig({
        JWT_REFRESH_SECRET: 'another-short-secret',
      }),
    ).toThrowError(ConfigValidationError);
  });

  it('enforces exact 64-hex character requirement for TOKEN_ENCRYPTION_KEY_HEX', () => {
    // 63 characters (too short)
    expect(() =>
      validateConfig({
        TOKEN_ENCRYPTION_KEY_HEX: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde',
      }),
    ).toThrowError(ConfigValidationError);

    // 64 characters with non-hex character 'z'
    expect(() =>
      validateConfig({
        TOKEN_ENCRYPTION_KEY_HEX: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdz!',
      }),
    ).toThrowError(ConfigValidationError);

    // Valid 64-hex key
    const valid = validateConfig({
      TOKEN_ENCRYPTION_KEY_HEX: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    });
    expect(valid.TOKEN_ENCRYPTION_KEY_HEX).toBe(
      'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    );
  });

  it('validates MONGODB_URI protocol requirements', () => {
    expect(() =>
      validateConfig({
        MONGODB_URI: 'postgres://localhost:5432/mydb',
      }),
    ).toThrowError(ConfigValidationError);

    const validMongo = validateConfig({
      MONGODB_URI: 'mongodb+srv://cluster0.example.com/yt_prod',
    });
    expect(validMongo.MONGODB_URI).toBe('mongodb+srv://cluster0.example.com/yt_prod');
  });

  it('validates URL formatting for webhooks and redirects', () => {
    expect(() =>
      validateConfig({
        N8N_WEBHOOK_URL: 'invalid-url',
      }),
    ).toThrowError(ConfigValidationError);

    expect(() =>
      validateConfig({
        GOOGLE_REDIRECT_URI: 'not-a-valid-uri',
      }),
    ).toThrowError(ConfigValidationError);
  });

  it('formats descriptive error messages listing all failing variables', () => {
    try {
      validateConfig({
        JWT_ACCESS_SECRET: 'short',
        PORT: '-10',
      });
      expect.unreachable('Should have thrown ConfigValidationError');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigValidationError);
      const validationError = err as ConfigValidationError;
      expect(validationError.issues).toHaveProperty('JWT_ACCESS_SECRET');
      expect(validationError.issues).toHaveProperty('PORT');
      expect(validationError.message).toContain('JWT_ACCESS_SECRET');
      expect(validationError.message).toContain('PORT');
    }
  });
});

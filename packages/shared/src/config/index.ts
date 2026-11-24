import { EnvSchema, type AppConfig } from './env.schema.js';
import { ZodError } from 'zod';

export * from './env.schema.js';

export class ConfigValidationError extends Error {
  public readonly issues: Record<string, string[]>;

  constructor(issues: Record<string, string[]>) {
    const formatted = Object.entries(issues)
      .map(([key, msgs]) => `  • ${key}: ${msgs.join(', ')}`)
      .join('\n');
    super(`Application Configuration Validation Failed:\n${formatted}`);
    this.name = 'ConfigValidationError';
    this.issues = issues;
  }
}

/**
 * Validates a dictionary of environment variables against EnvSchema.
 * Throws a formatted ConfigValidationError if validation fails.
 */
export function validateConfig(rawEnv: Record<string, string | undefined>): AppConfig {
  const result = EnvSchema.safeParse(rawEnv);

  if (!result.success) {
    const error = result.error as ZodError;
    const issues: Record<string, string[]> = {};

    for (const issue of error.issues) {
      const path = issue.path.join('.') || 'root';
      if (!issues[path]) {
        issues[path] = [];
      }
      issues[path].push(issue.message);
    }

    throw new ConfigValidationError(issues);
  }

  return result.data;
}

/**
 * Loads and validates configuration from process.env.
 */
export function loadConfig(): AppConfig {
  return validateConfig(process.env);
}

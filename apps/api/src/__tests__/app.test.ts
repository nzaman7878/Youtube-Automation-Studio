import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('Express API Skeleton, Middlewares & Error Handling', () => {
  it('GET /api/v1/health returns 200 with healthy status and metadata', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.environment).toBe('test');
    expect(res.body.data.quota.defaultLimit).toBe(10000);
    expect(res.body.data.quota.circuitBreakerThresholdPercent).toBe(85);
    expect(res.headers).toHaveProperty('x-request-id');
    expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
  });

  it('GET /health redirects to /api/v1/health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(301);
    expect(res.headers.location).toBe('/api/v1/health');
  });

  it('preserves client-provided X-Request-Id header in responses', async () => {
    const customId = 'client-trace-123456';
    const res = await request(app).get('/api/v1/health').set('X-Request-Id', customId);

    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toBe(customId);
  });

  it('returns 404 with structured JSON response on unmatched route', async () => {
    const res = await request(app).get('/api/v1/non-existent-endpoint');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.message).toContain('not found');
    expect(res.body.error).toHaveProperty('requestId');
    expect(res.body.error).toHaveProperty('timestamp');
  });

  it('handles custom AppError and returns mapped status code', async () => {
    const res = await request(app).get('/api/v1/test/app-error');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('BAD_REQUEST');
    expect(res.body.error.message).toBe('Invalid query parameters provided');
    expect(res.body.error.details).toEqual({ field: 'filter' });
  });

  it('handles QuotaExceededError and returns 429 status', async () => {
    const res = await request(app).get('/api/v1/test/quota-error');

    expect(res.status).toBe(429);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('QUOTA_EXCEEDED');
    expect(res.body.error.message).toContain('quota threshold exceeded');
  });

  it('handles Zod validation errors and returns 400 with issue details', async () => {
    const res = await request(app)
      .post('/api/v1/test/zod-validation')
      .send({ email: 'invalid-email', channelName: 'a' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(res.body.error.details)).toBe(true);
    expect(res.body.error.details).toHaveLength(2);
  });

  it('handles malformed JSON body payloads with 400 MALFORMED_JSON', async () => {
    const res = await request(app)
      .post('/api/v1/test/zod-validation')
      .set('Content-Type', 'application/json')
      .send('{"invalid json: true');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('MALFORMED_JSON');
  });

  it('handles unhandled 500 exceptions gracefully', async () => {
    const res = await request(app).get('/api/v1/test/unhandled-error');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(res.body.error).toHaveProperty('requestId');
  });
});

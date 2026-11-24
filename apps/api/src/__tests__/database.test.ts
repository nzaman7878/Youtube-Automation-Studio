import { describe, it, expect, beforeEach } from 'vitest';
import mongoose, { Schema, type Document } from 'mongoose';
import { database, DatabaseState } from '../database/connection.js';
import { toJSONPlugin } from '../database/plugins/toJSON.plugin.js';
import { softDeletePlugin, type SoftDeleteDocument } from '../database/plugins/soft-delete.plugin.js';
import { BaseRepository } from '../repositories/base.repository.js';
import request from 'supertest';
import { app } from '../app.js';

interface ITestUser extends Document, SoftDeleteDocument {
  name: string;
  email: string;
  password?: string;
  token?: string;
}

const TestUserSchema = new Schema<ITestUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    token: { type: String },
  },
  { timestamps: true },
);

TestUserSchema.plugin(toJSONPlugin);
TestUserSchema.plugin(softDeletePlugin);

const TestUserModel = mongoose.models['TestUser'] || mongoose.model<ITestUser>('TestUser', TestUserSchema);

class TestUserRepository extends BaseRepository<ITestUser> {
  constructor() {
    super(TestUserModel);
  }
}

describe('MongoDB Connection & Base Mongoose Patterns', () => {
  describe('DatabaseConnection Singleton', () => {
    it('initializes as a singleton with disconnected state by default', () => {
      expect(database).toBeDefined();
      expect(database.getState()).toBe(DatabaseState.DISCONNECTED);
      expect(database.isConnected()).toBe(false);
    });

    it('ping() returns false when connection is not established', async () => {
      const isPingSuccessful = await database.ping();
      expect(isPingSuccessful).toBe(false);
    });
  });

  describe('toJSONPlugin', () => {
    it('transforms _id to string id, removes __v, and strips sensitive fields', () => {
      const doc = new TestUserModel({
        name: 'Alex Creator',
        email: 'alex@example.com',
        password: 'super_secret_password_hash',
        token: 'active_session_token_123',
      });

      const json = doc.toJSON();

      // Transformed id
      expect(json).toHaveProperty('id');
      expect(typeof json['id']).toBe('string');
      expect(json['id']).toBe(String(doc._id));
      expect(json).not.toHaveProperty('_id');

      // Version key stripped
      expect(json).not.toHaveProperty('__v');

      // Sensitive fields stripped
      expect(json).not.toHaveProperty('password');
      expect(json).not.toHaveProperty('token');

      // Non-sensitive fields preserved
      expect(json['name']).toBe('Alex Creator');
      expect(json['email']).toBe('alex@example.com');
    });

    it('toObject also transforms _id to id and strips __v', () => {
      const doc = new TestUserModel({
        name: 'Elena Architect',
        email: 'elena@example.com',
      });

      const obj = doc.toObject();
      expect(obj).toHaveProperty('id');
      expect(obj).not.toHaveProperty('_id');
      expect(obj).not.toHaveProperty('__v');
    });
  });

  describe('softDeletePlugin', () => {
    it('adds isDeleted and deletedAt schema fields with default values', () => {
      const doc = new TestUserModel({
        name: 'Jordan Agency',
        email: 'jordan@example.com',
      });

      expect(doc.isDeleted).toBe(false);
      expect(doc.deletedAt).toBeNull();
    });

    it('attaches softDelete and restore instance methods to schema', () => {
      expect(TestUserSchema.methods['softDelete']).toBeDefined();
      expect(TestUserSchema.methods['restore']).toBeDefined();
      expect(TestUserSchema.statics['findDeleted']).toBeDefined();
      expect(TestUserSchema.statics['restoreById']).toBeDefined();
    });

    it('softDelete updates in-memory flags before save', async () => {
      const doc = new TestUserModel({
        name: 'Sam Producer',
        email: 'sam@example.com',
      });

      // Mock save for unit isolation
      doc.save = async () => doc;

      await doc.softDelete();
      expect(doc.isDeleted).toBe(true);
      expect(doc.deletedAt).toBeInstanceOf(Date);

      await doc.restore();
      expect(doc.isDeleted).toBe(false);
      expect(doc.deletedAt).toBeNull();
    });
  });

  describe('BaseRepository Generic Pattern', () => {
    let repo: TestUserRepository;

    beforeEach(() => {
      repo = new TestUserRepository();
    });

    it('provides complete standard repository interface', () => {
      expect(typeof repo.findById).toBe('function');
      expect(typeof repo.findOne).toBe('function');
      expect(typeof repo.findMany).toBe('function');
      expect(typeof repo.create).toBe('function');
      expect(typeof repo.updateById).toBe('function');
      expect(typeof repo.deleteById).toBe('function');
      expect(typeof repo.softDeleteById).toBe('function');
      expect(typeof repo.restoreById).toBe('function');
      expect(typeof repo.count).toBe('function');
      expect(typeof repo.exists).toBe('function');
      expect(typeof repo.withTransaction).toBe('function');
    });
  });

  describe('Live Health Check Endpoint Reflection', () => {
    it('GET /api/v1/health reports accurate database connection state', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.services.database).toBe('disconnected');
    });
  });
});

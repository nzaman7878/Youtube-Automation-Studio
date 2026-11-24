import mongoose, { type Connection } from 'mongoose';
import { logger } from '../logger/index.js';
import { config } from '../config.js';

export enum DatabaseState {
  DISCONNECTED = 'disconnected',
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTING = 'disconnecting',
}

export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private isConnecting = false;

  private constructor() {
    this.registerConnectionEvents();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private registerConnectionEvents(): void {
    const conn: Connection = mongoose.connection;

    conn.on('connected', () => {
      logger.info('MongoDB connection established successfully');
    });

    conn.on('error', (err: Error) => {
      logger.error({ err }, `MongoDB connection error: ${err.message}`);
    });

    conn.on('disconnected', () => {
      logger.warn('MongoDB connection lost. Reconnect scheduled');
    });

    conn.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });
  }

  public async connect(customUri?: string): Promise<typeof mongoose> {
    if (this.isConnected()) {
      return mongoose;
    }

    if (this.isConnecting) {
      logger.debug('MongoDB connection attempt already in progress...');
      return mongoose;
    }

    const uri = customUri || config.MONGODB_URI;

    try {
      this.isConnecting = true;
      logger.info({ uri: uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') }, 'Connecting to MongoDB...');

      await mongoose.connect(uri, {
        maxPoolSize: 20,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        autoIndex: config.NODE_ENV !== 'production',
      });

      return mongoose;
    } catch (err) {
      logger.error({ err }, 'Failed to connect to MongoDB');
      throw err;
    } finally {
      this.isConnecting = false;
    }
  }

  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      logger.info('Disconnecting MongoDB connection...');
      await mongoose.disconnect();
      logger.info('MongoDB disconnected');
    }
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public getState(): DatabaseState {
    switch (mongoose.connection.readyState) {
      case 1:
        return DatabaseState.CONNECTED;
      case 2:
        return DatabaseState.CONNECTING;
      case 3:
        return DatabaseState.DISCONNECTING;
      case 0:
      default:
        return DatabaseState.DISCONNECTED;
    }
  }

  public async ping(): Promise<boolean> {
    if (!this.isConnected() || !mongoose.connection.db) {
      return false;
    }
    try {
      const adminDb = mongoose.connection.db.admin();
      const result = await adminDb.ping();
      return Boolean(result && result.ok === 1);
    } catch {
      return false;
    }
  }
}

export const database = DatabaseConnection.getInstance();

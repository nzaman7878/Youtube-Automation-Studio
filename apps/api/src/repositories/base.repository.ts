import mongoose, {
  type Model,
  type Document,
  type QueryFilter,
  type UpdateQuery,
  type QueryOptions,
  type ClientSession,
  type ProjectionType,
  type SortOrder,
} from 'mongoose';
import { type SoftDeleteDocument } from '../database/plugins/soft-delete.plugin.js';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, SortOrder>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBaseRepository<T extends Document> {
  findById(id: string, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T | null>;
  findOne(filter: QueryFilter<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T | null>;
  findMany(filter: QueryFilter<T>, options?: PaginationOptions & { projection?: ProjectionType<T> }): Promise<PaginatedResult<T>>;
  create(data: unknown, session?: ClientSession): Promise<T>;
  updateById(id: string, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<T | null>;
  deleteById(id: string): Promise<boolean>;
  softDeleteById(id: string): Promise<boolean>;
  restoreById(id: string): Promise<boolean>;
  count(filter?: QueryFilter<T>): Promise<number>;
  exists(filter: QueryFilter<T>): Promise<boolean>;
  withTransaction<R>(fn: (session: ClientSession) => Promise<R>): Promise<R>;
}

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async findById(
    id: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findById(id, projection, options).exec();
  }

  public async findOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findOne(filter, projection, options).exec();
  }

  public async findMany(
    filter: QueryFilter<T> = {},
    options: PaginationOptions & { projection?: ProjectionType<T> } = {},
  ): Promise<PaginatedResult<T>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(100, options.limit ?? 20));
    const skip = (page - 1) * limit;

    const sortOption = (options.sort ?? { createdAt: -1 }) as unknown as string | { [key: string]: SortOrder };

    const [data, total] = await Promise.all([
      this.model
        .find(filter, options.projection)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async create(data: unknown, session?: ClientSession): Promise<T> {
    const doc = new this.model(data);
    const saved = await doc.save({ session });
    return saved as T;
  }

  public async updateById(
    id: string,
    update: UpdateQuery<T>,
    options: QueryOptions<T> = { new: true },
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true, runValidators: true, ...options }).exec();
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return Boolean(result);
  }

  public async softDeleteById(id: string): Promise<boolean> {
    const doc = await this.model.findById(id).exec();
    if (!doc) return false;

    if ('softDelete' in doc && typeof (doc as unknown as SoftDeleteDocument).softDelete === 'function') {
      await (doc as unknown as SoftDeleteDocument).softDelete();
      return true;
    }

    const updated = await this.model.findByIdAndUpdate(id, {
      $set: { isDeleted: true, deletedAt: new Date() },
    }).exec();
    return Boolean(updated);
  }

  public async restoreById(id: string): Promise<boolean> {
    const updated = await this.model.findByIdAndUpdate(id, {
      $set: { isDeleted: false, deletedAt: null },
    }, { new: true }).exec();
    return Boolean(updated);
  }

  public async count(filter: QueryFilter<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  public async exists(filter: QueryFilter<T>): Promise<boolean> {
    const result = await this.model.exists(filter).exec();
    return Boolean(result);
  }

  /**
   * Safe execution wrapper for multi-document ACID transactions
   */
  public async withTransaction<R>(fn: (session: ClientSession) => Promise<R>): Promise<R> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}

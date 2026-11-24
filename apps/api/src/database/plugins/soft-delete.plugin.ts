import {
  type Schema,
  type Document,
  type Model,
  type Query,
} from 'mongoose';

export interface SoftDeleteDocument extends Document {
  isDeleted: boolean;
  deletedAt: Date | null;
  softDelete(): Promise<this>;
  restore(): Promise<this>;
}

export interface SoftDeleteModel<T extends SoftDeleteDocument> extends Model<T> {
  findDeleted(): Query<T[], T>;
  restoreById(id: string): Promise<T | null>;
}

/**
 * Mongoose Schema Plugin: softDeletePlugin
 * Adds `isDeleted` and `deletedAt` fields with automatic query exclusion.
 */
export function softDeletePlugin(schema: Schema): void {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  // Query Hook: Filter out soft-deleted documents by default
  const excludeDeleted = function (this: Query<unknown, unknown>) {
    const filter = this.getFilter();
    if (filter['includeDeleted'] === true) {
      delete filter['includeDeleted'];
    } else if (filter['isDeleted'] === undefined) {
      this.where({ isDeleted: { $ne: true } });
    }
  };

  schema.pre<Query<unknown, unknown>>('find', excludeDeleted);
  schema.pre<Query<unknown, unknown>>('findOne', excludeDeleted);
  schema.pre<Query<unknown, unknown>>('findOneAndUpdate', excludeDeleted);
  schema.pre<Query<unknown, unknown>>('countDocuments', excludeDeleted);

  // Document instance methods
  schema.methods['softDelete'] = async function (this: SoftDeleteDocument): Promise<SoftDeleteDocument> {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods['restore'] = async function (this: SoftDeleteDocument): Promise<SoftDeleteDocument> {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };

  // Static model methods
  schema.statics['findDeleted'] = function (this: Model<SoftDeleteDocument>) {
    return this.find({ isDeleted: true, includeDeleted: true } as Record<string, unknown>);
  };

  schema.statics['restoreById'] = async function (
    this: Model<SoftDeleteDocument>,
    id: string,
  ): Promise<SoftDeleteDocument | null> {
    const doc = await this.findOne({ _id: id, isDeleted: true, includeDeleted: true } as Record<string, unknown>);
    if (!doc) return null;
    return doc.restore();
  };
}

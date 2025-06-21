// src/common/base.repository.ts
import { Injectable } from '@nestjs/common';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

// Define a clean return type that includes id
export type CleanDocument<T> = Omit<T, keyof Document> & {
  id: string;
};

@Injectable()
export abstract class BaseRepository<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  protected toObject(document: T): CleanDocument<T> {
    if (!document) return document as any;
    const obj = document.toObject({
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    });
    return obj as CleanDocument<T>;
  }

  async create(createDto: Partial<T>): Promise<CleanDocument<T>> {
    const document = await this.model.create(createDto);
    return this.toObject(document);
  }

  async findById(id: string): Promise<CleanDocument<T> | null> {
    const document = await this.model.findById(id);
    return document ? this.toObject(document) : null;
  }

  async findOne(filter: FilterQuery<T>): Promise<CleanDocument<T> | null> {
    const document = await this.model.findOne(filter);
    return document ? this.toObject(document) : null;
  }

  async findOneRaw(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async findAll(
    filter: FilterQuery<T> = {},
    options?: {
      skip?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
    },
  ): Promise<CleanDocument<T>[]> {
    let query = this.model.find(filter);
    if (options?.skip) query = query.skip(options.skip);
    if (options?.limit) query = query.limit(options.limit);
    if (options?.sort) query = query.sort(options.sort);
    const documents = await query.exec();
    return documents.map((doc) => this.toObject(doc));
  }

  async update(
    id: string,
    updateDto: UpdateQuery<T>,
  ): Promise<CleanDocument<T> | null> {
    const document = await this.model.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    return document ? this.toObject(document) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter);
    return count > 0;
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }
}

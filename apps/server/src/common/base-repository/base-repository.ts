// src/common/base.repository.ts
import { Injectable } from '@nestjs/common';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

@Injectable()
export abstract class BaseRepository<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  private toObject(document: T): Omit<T, keyof Document> {
    if (!document) return document;
    return document.toObject({
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    });
  }

  async create(createDto: Partial<T>): Promise<Omit<T, keyof Document>> {
    const document = await this.model.create(createDto);
    return this.toObject(document);
  }

  async findById(id: string): Promise<Omit<T, keyof Document> | null> {
    const document = await this.model.findById(id);
    return document ? this.toObject(document) : null;
  }

  async findOne(
    filter: FilterQuery<T>,
  ): Promise<Omit<T, keyof Document> | null> {
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
  ): Promise<Omit<T, keyof Document>[]> {
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
  ): Promise<Omit<T, keyof Document> | null> {
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

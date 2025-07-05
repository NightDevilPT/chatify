import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository, CleanDocument } from 'src/common/base-repository/base-repository';
import { LanguageEnum, PrimaryColorEnum, Settings, SettingsDocument, ThemeEnum } from '../entities/setting.entity';

@Injectable()
export class SettingsRepository extends BaseRepository<SettingsDocument> {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {
    super(settingsModel);
  }

  /**
   * Create default settings for a user
   * @param userId The ID of the user for whom settings are to be created
   * @returns Settings document with id transformed
   */
  async createDefaultSettings(
    userId: Types.ObjectId,
  ): Promise<CleanDocument<SettingsDocument>> {
    const defaultSettings: Partial<Settings> = {
      userId,
      theme: ThemeEnum.Light, // Default values from entity
      language: LanguageEnum.English,
      color: PrimaryColorEnum.Blue,
      notifications: true,
    };

    const document = await this.create(defaultSettings);
    return document;
  }

  /**
   * Find settings by user ID
   * @param userId The ID of the user whose settings are to be retrieved
   * @returns Settings document with id transformed, or null if not found
   */
  async findByUserId(userId: string): Promise<CleanDocument<SettingsDocument> | null> {
    const document = await this.settingsModel.findOne({ userId: new Types.ObjectId(userId) });
    return document ? this.toObject(document) : null;
  }

  /**
   * Find settings by user ID with populated user details
   * @param userId The ID of the user
   * @returns Settings document with populated user details, id transformed, or null if not found
   */
  async findByUserIdWithUserDetails(userId: string): Promise<CleanDocument<SettingsDocument> | null> {
    const document = await this.settingsModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'userId',
        select: 'email username',
      });
    return document ? this.toObject(document) : null;
  }

  /**
   * Update settings for a user
   * @param userId The ID of the user
   * @param updateData Partial settings data to update
   * @returns Updated settings document with id transformed, or null if not found
   */
  async updateByUserId(
    userId: string,
    updateData: Partial<Settings>,
  ): Promise<CleanDocument<SettingsDocument> | null> {
    const document = await this.settingsModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: updateData },
      { new: true, upsert: true }, // Create if not exists
    );
    return document ? this.toObject(document) : null;
  }

  /**
   * Create or update settings for a user
   * @param userId The ID of the user
   * @param settingsData Settings data to create or update
   * @returns Created or updated settings document with id transformed
   */
  async createOrUpdate(
    userId: string,
    settingsData: Partial<Settings>,
  ): Promise<CleanDocument<SettingsDocument>> {
    const document = await this.settingsModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: { ...settingsData, userId: new Types.ObjectId(userId) } },
      { new: true, upsert: true },
    );
    return this.toObject(document);
  }
}
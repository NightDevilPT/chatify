// src/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from 'src/common/base-repository/base-repository';
import { User, UserDocument } from '../entities/user.entity';
import { SettingsRepository } from 'src/modules/settings/repository/setting.repository';


@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly settingRepository: SettingsRepository,
  ) {
    super(userModel);
  }

  // Add user-specific methods
  async findByEmail(
    email: string,
    showPassword?: boolean,
  ): Promise<UserDocument | null> {
    if (showPassword) {
      return this.userModel.findOne({ email }).select('+password');
    }
    return this.userModel.findOne({ email });
  }

  async findByToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ token });
  }

  async verifyUser(userId: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { isVerified: true, token: null },
      { new: true },
    );
  }

  async createDefaultSettings(
    userId: Types.ObjectId,
  ): Promise<UserDocument | null> {
    const settings = await this.settingRepository.createDefaultSettings(userId);
    return this.userModel.findById(userId).populate('settings');
  }
}

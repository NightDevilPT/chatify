import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../entities/profile.entity';
import { BaseRepository } from 'src/common/base-repository/base-repository';

@Injectable()
export class ProfileRepository extends BaseRepository<ProfileDocument> {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {
    super(profileModel);
  }

  async findByUserId(userId: string): Promise<ProfileDocument | null> {
    return this.profileModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  async findByUserIds(userIds: string[]): Promise<ProfileDocument[]> {
    return this.profileModel
      .find({
        userId: { $in: userIds.map((id) => new Types.ObjectId(id)) },
      })
      .populate('userId', '-password');
  }

  async updateByUserId(
    userId: string,
    updateData: any,
  ): Promise<ProfileDocument | null> {
    return this.profileModel
      .findOneAndUpdate({ userId: new Types.ObjectId(userId) }, updateData, {
        new: true,
      })
      .lean({ virtuals: true });
  }

  async searchProfiles(searchTerm: string): Promise<ProfileDocument[]> {
    return this.profileModel
      .find({
        $text: { $search: searchTerm },
      })
      .populate('userId', '-password');
  }

  async findByUserIdWithUserDetails(userId: string): Promise<any | null> {
    return await this.profileModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'userId',
        select: 'email username', // Only include needed fields
      })
      .lean({ virtuals: true });
  }
}

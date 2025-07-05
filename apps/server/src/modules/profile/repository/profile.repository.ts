import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileResponseDto } from '../dto/profile-response.dto';
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

  async findByUserIdWithUserDetails(userId: string): Promise<ProfileResponseDto | null> {
    const profile = await this.profileModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'userId',
        select: 'email username', // Only include needed fields
        populate: {
          path: 'settings',
          select: 'theme language color soundEnabled font notifications',
        },
      })
      .lean() as any;

    if (!profile) return null;

    // Generate fullName if firstName and lastName exist
    const fullName = profile.firstName && profile.lastName 
      ? `${profile.firstName} ${profile.lastName}` 
      : undefined;

    return {
      id: profile._id.toString(),
      user: profile.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      fullName,
      contact: profile.contact,
      avatar: profile.avatar,
      bio: profile.bio,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      location: profile.location,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}

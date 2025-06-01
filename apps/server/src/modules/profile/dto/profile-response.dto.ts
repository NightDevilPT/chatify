import { ApiProperty } from '@nestjs/swagger';
import { Gender, SocialPlatform } from '../entities/profile.entity';

export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  fullName?: string;

  @ApiProperty({ required: false })
  contact?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ enum: Gender, required: false })
  gender?: Gender;

  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ type: Object, required: false })
  socialLinks?: Record<SocialPlatform, string>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

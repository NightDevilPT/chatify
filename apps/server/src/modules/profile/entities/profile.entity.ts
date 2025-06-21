import {
  IsOptional,
  IsString,
  IsUrl,
  IsPhoneNumber,
  IsDate,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Settings } from 'src/modules/settings/entities/setting.entity';

export type SocialPlatform =
  | 'twitter'
  | 'linkedin'
  | 'github'
  | 'facebook'
  | 'instagram';

export type ProfileDocument = HydratedDocument<Profile>;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

@Schema({
  timestamps: true,
  _id: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Profile {
  @ApiProperty({ type: String, description: 'Reference to User' })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId | User;

  @ApiProperty({ example: 'John', required: false })
  @Prop({ trim: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @Prop({ trim: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @Prop({ trim: true })
  @IsOptional()
  @IsPhoneNumber()
  contact?: string;

  @ApiProperty({ example: 'http://example.com/avatar.jpg', required: false })
  @Prop({ trim: true })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({ example: 'Software Developer', required: false })
  @Prop({ trim: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ enum: Gender, required: false })
  @Prop({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ example: '1990-01-01', required: false })
  @Prop()
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @ApiProperty({ example: 'New York, USA', required: false })
  @Prop({ trim: true })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    type: Object,
    required: false,
    example: { twitter: 'https://twitter.com/johndoe' },
  })
  @Prop({ type: Object })
  @IsOptional()
  socialLinks?: Record<SocialPlatform, string>;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

// Add indexes
ProfileSchema.index({ firstName: 'text', lastName: 'text', bio: 'text' });

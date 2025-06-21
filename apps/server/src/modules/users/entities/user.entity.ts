import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Settings } from 'src/modules/settings/entities/setting.entity';

export type UserDocument = HydratedDocument<User>;

export enum UserStatusEnum {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  TYPING = 'TYPING',
}

@Schema({
  timestamps: true,
  _id: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}) // _id is automatically created by Mongoose
export class User {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: 'securepassword123', description: 'User password' })
  @Prop({ required: true, select: false })
  password: string;

  @ApiProperty({
    example: 'jwt_token_string',
    description: 'Auth token for the user (optional)',
  })
  @Prop({ default: null })
  token?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the user is verified',
  })
  @Prop({ default: false })
  isVerified: boolean;

  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: [
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers and underscores',
    ],
  })
  username: string;

  // Virtual field for settings - not stored in database
  @ApiProperty({ type: () => Settings, description: 'User settings' })
  settings?: Settings;

  // Virtual field for settings - not stored in database
  @ApiProperty({ type: () => Profile, description: 'User Profile' })
  profiles?: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Define virtual for settings relationship
UserSchema.virtual('settings', {
  ref: 'Settings',
  localField: '_id',
  foreignField: 'userId',
  justOne: true, // One-to-one relationship
});

// Define virtual for settings relationship
UserSchema.virtual('profiles', {
  ref: 'Profiles',
  localField: '_id',
  foreignField: 'userId',
  justOne: true, // One-to-one relationship
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

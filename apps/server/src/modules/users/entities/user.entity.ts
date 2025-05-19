import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export enum UserStatusEnum {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  TYPING = 'TYPING',
}

@Schema({ timestamps: true })
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

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @Prop({ default: '', trim: true, maxlength: 50 })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @Prop({ default: '', trim: true, maxlength: 50 })
  lastName: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Profile picture URL',
  })
  @Prop({ default: '' })
  avatar: string;

  @ApiProperty({
    example: 'Hey there! I am using Chatify!',
    description: 'User bio',
    required: false,
  })
  @Prop({
    default: 'Hey there! I am using Chatify!',
    maxlength: 200,
  })
  bio: string;

  @ApiProperty({
    enum: UserStatusEnum,
    enumName: 'UserStatusEnum',
    default: UserStatusEnum.OFFLINE,
    required: false,
  })
  @Prop({
    type: String,
    enum: UserStatusEnum,
    default: UserStatusEnum.OFFLINE,
  })
  status: UserStatusEnum;

  @ApiProperty({ description: 'Reference to user settings' })
  @Prop({ type: Types.ObjectId, ref: 'Settings' })
  settings: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

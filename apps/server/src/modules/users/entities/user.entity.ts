import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export enum UserStatusEnum {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  TYPING = 'TYPING',
}

@Schema({ timestamps: true, _id: true }) // _id is automatically created by Mongoose
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
}

export const UserSchema = SchemaFactory.createForClass(User);

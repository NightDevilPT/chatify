import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';

export type SettingsDocument = HydratedDocument<Settings>;

export enum LanguageEnum {
  German = 'de',
  English = 'en',
  Spanish = 'es',
  French = 'fr',
  Hindi = 'hi',
  Italian = 'it',
  Japanese = 'ja',
  Korean = 'ko',
  Portuguese = 'pt',
  Thai = 'th',
  Turkish = 'tr',
  Vietnamese = 'vi',
  Chinese = 'zh',
}

export enum ThemeEnum {
  Light = 'light',
  Dark = 'dark',
}

export enum PrimaryColorEnum {
  Blue = 'blue',
  Red = 'red',
  Rose = 'rose',
  Green = 'green',
  Yellow = 'yellow',
  Purple = 'purple',
  Orange = 'orange',
}

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Settings {
  @ApiProperty({ type: String, description: 'Reference to User' })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId | User;

  @ApiProperty({ enum: ThemeEnum, default: ThemeEnum.Light })
  @Prop({ default: ThemeEnum.Light, enum: ThemeEnum })
  theme: ThemeEnum;

  @ApiProperty({ enum: LanguageEnum, default: LanguageEnum.English })
  @Prop({ default: LanguageEnum.English, enum: LanguageEnum })
  language: LanguageEnum;

  @ApiProperty({ enum: PrimaryColorEnum, default: PrimaryColorEnum.Blue })
  @Prop({ default: PrimaryColorEnum.Blue, enum: PrimaryColorEnum })
  color: PrimaryColorEnum;

  @ApiProperty({ default: true })
  @Prop({ default: true })
  notifications: boolean;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

// Ensure unique index on userId
SettingsSchema.index({ userId: 1 }, { unique: true });
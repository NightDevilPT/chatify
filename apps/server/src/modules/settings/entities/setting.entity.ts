// settings.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ timestamps: true })
export class Settings {
  @ApiProperty({ enum: ['light', 'dark'], default: 'light' })
  @Prop({ default: 'light' })
  theme: string;

  @ApiProperty({ default: true })
  @Prop({ default: true })
  notifications: boolean;

  @ApiProperty({ default: false })
  @Prop({ default: false })
  soundEnabled: boolean;

  @ApiProperty({ default: 'en' })
  @Prop({ default: 'en' })
  font: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

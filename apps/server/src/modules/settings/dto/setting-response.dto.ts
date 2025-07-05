import { ApiProperty } from '@nestjs/swagger';
import { LanguageEnum, PrimaryColorEnum, ThemeEnum } from '../entities/setting.entity';

export class SettingsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ThemeEnum })
  theme: ThemeEnum;

  @ApiProperty({ enum: LanguageEnum })
  language: LanguageEnum;

  @ApiProperty({ enum: PrimaryColorEnum })
  color: PrimaryColorEnum;

  @ApiProperty()
  notifications: boolean;

  @ApiProperty()
  soundEnabled: boolean;

  @ApiProperty()
  font: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

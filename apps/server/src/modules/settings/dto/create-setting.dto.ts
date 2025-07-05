import { IsEnum, IsBoolean, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LanguageEnum, PrimaryColorEnum, ThemeEnum } from '../entities/setting.entity';

export class CreateSettingDto {
  @ApiProperty({
    enum: ThemeEnum,
    default: ThemeEnum.Light,
    description: 'The theme preference for the application',
  })
  @IsEnum(ThemeEnum)
  @IsOptional()
  theme: ThemeEnum = ThemeEnum.Light;

  @ApiProperty({
    enum: LanguageEnum,
    default: LanguageEnum.English,
    description: 'The preferred language for the application',
  })
  @IsEnum(LanguageEnum)
  @IsOptional()
  language: LanguageEnum = LanguageEnum.English;

  @ApiProperty({
    enum: PrimaryColorEnum,
    default: PrimaryColorEnum.Blue,
    description: 'The primary color theme for the application',
  })
  @IsEnum(PrimaryColorEnum)
  @IsOptional()
  color: PrimaryColorEnum = PrimaryColorEnum.Blue;

  @ApiProperty({
    default: true,
    description: 'Whether notifications are enabled',
  })
  @IsBoolean()
  @IsOptional()
  notifications: boolean = true;

  @ApiProperty({
    default: false,
    description: 'Whether sound effects are enabled',
  })
  @IsBoolean()
  @IsOptional()
  soundEnabled: boolean = false;

  @ApiProperty({
    default: 'en',
    description: 'The preferred font identifier',
  })
  @IsString()
  @IsOptional()
  font: string = 'en';
}

import {
  IsOptional,
  IsString,
  IsUrl,
  IsPhoneNumber,
  IsDate,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, SocialPlatform } from '../entities/profile.entity';

export class CreateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber()
  contact?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  socialLinks?: Record<SocialPlatform, string>;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SettingsResponseDto } from 'src/modules/settings/dto/setting-response.dto';

export class UserProfileDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ 
    type: () => SettingsResponseDto,
    description: 'User settings',
    nullable: true
  })
  @Type(() => SettingsResponseDto)
  settings?: SettingsResponseDto | null;
}
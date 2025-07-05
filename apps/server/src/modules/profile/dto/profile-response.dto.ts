import { ApiProperty } from '@nestjs/swagger';
import { Gender, SocialPlatform } from '../entities/profile.entity';
import { UserProfileDto } from 'src/modules/users/dto/user-profile.dto';
import { Type } from 'class-transformer';

export class ProfileResponseDto {
  
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Profile ID' })
  id: string;

  @ApiProperty({ 
    type: () => UserProfileDto,
    description: 'User details with settings'
  })
  @Type(() => UserProfileDto)
  user: UserProfileDto;

  @ApiProperty({ example: 'John', required: false })
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  lastName?: string;

  @ApiProperty({ 
    example: 'John Doe', 
    required: false,
    description: 'Automatically generated full name if first and last names exist' 
  })
  fullName?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  contact?: string;

  @ApiProperty({ 
    example: 'https://example.com/avatar.jpg', 
    required: false 
  })
  avatar?: string;

  @ApiProperty({ 
    example: 'Software developer with 5 years experience', 
    required: false 
  })
  bio?: string;

  @ApiProperty({ 
    enum: Gender, 
    enumName: 'Gender',
    example: Gender.MALE,
    required: false 
  })
  gender?: Gender;

  @ApiProperty({ 
    example: '1990-01-01', 
    required: false 
  })
  dateOfBirth?: Date;

  @ApiProperty({ 
    example: 'New York, USA', 
    required: false 
  })
  location?: string;


  @ApiProperty({ 
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation timestamp' 
  })
  createdAt: Date;

  @ApiProperty({ 
    example: '2023-01-02T00:00:00.000Z',
    description: 'Last update timestamp' 
  })
  updatedAt: Date;
}
import { Request } from 'express';
// src/modules/profiles/profiles.controller.ts
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { ProfilesService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Controller, Post, Body, UseGuards, Req, Patch, Get } from '@nestjs/common';
import { GuardRequest } from 'src/interfaces/jwt-payload.interface';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('profiles')
@Controller('profiles')
@ApiSecurity('access-token')
@ApiSecurity('refresh-token')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile found successfully',
    type: ProfileResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getMyProfile(@Req() req: GuardRequest) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return await this.profilesService.getProfileByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create user profile' })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Profile already exists',
  })
  async create(
    @Req() req: GuardRequest,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    // Get userId from authenticated user
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return await this.profilesService.create(userId, createProfileDto);
  }


  @Patch()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async update(
    @Req() req: GuardRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return await this.profilesService.update(userId, updateProfileDto);
  }
}

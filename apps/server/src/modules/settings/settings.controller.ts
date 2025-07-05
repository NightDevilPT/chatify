import { Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { GuardRequest } from 'src/interfaces/jwt-payload.interface';
import { SettingsService } from './settings.service';
import { SettingsResponseDto } from './dto/setting-response.dto';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@ApiTags('settings')
@Controller('settings')
@ApiSecurity('access-token')
@ApiSecurity('refresh-token')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user settings' })
  @ApiResponse({
    status: 200,
    description: 'Settings found successfully',
    type: SettingsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Settings not found' })
  async getMySettings(@Req() req: GuardRequest) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return await this.settingsService.getSettingsByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create user settings' })
  @ApiResponse({
    status: 201,
    description: 'Settings created successfully',
    type: SettingsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Settings already exists' })
  async create(
    @Req() req: GuardRequest,
    @Body() createSettingsDto: CreateSettingDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return await this.settingsService.create(userId, createSettingsDto);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user settings' })
  @ApiResponse({
    status: 200,
    description: 'Settings updated successfully',
    type: SettingsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Settings not found' })
  async update(
    @Req() req: GuardRequest,
    @Body() updateSettingsDto: UpdateSettingDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return await this.settingsService.update(userId, updateSettingsDto);
  }
}

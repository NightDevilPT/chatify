import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsResponseDto } from './dto/setting-response.dto';
import { GetSettingsQuery } from './queries/impl/get-settings.query';
import { CreateSettingsCommand } from './commands/impl/create-settings.command';
import { UpdateSettingsCommand } from './commands/impl/update-settings.command';

@Injectable()
export class SettingsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getSettingsByUserId(userId: string): Promise<SettingsResponseDto> {
    return await this.queryBus.execute(new GetSettingsQuery(userId));
  }

  async create(userId: string, createSettingsDto: CreateSettingDto) {
    return this.commandBus.execute(
      new CreateSettingsCommand(userId, createSettingsDto),
    );
  }

  async update(userId: string, updateSettingsDto: UpdateSettingDto) {
    return await this.commandBus.execute(
      new UpdateSettingsCommand(userId, updateSettingsDto),
    );
  }
}

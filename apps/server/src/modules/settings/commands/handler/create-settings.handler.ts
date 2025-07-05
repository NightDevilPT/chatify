import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ErrorTypes } from 'src/interfaces/error.interface';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SettingsRepository } from '../../repository/setting.repository';
import { LoggerService } from 'src/services/logger-service/index.service';
import { CreateSettingsCommand } from '../impl/create-settings.command';
import { HttpErrorService } from 'src/services/http-error-service/index.service';

@Injectable()
@CommandHandler(CreateSettingsCommand)
export class CreateSettingsHandler
  implements ICommandHandler<CreateSettingsCommand>
{
  private readonly logger = new LoggerService(CreateSettingsHandler.name);

  constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  async execute(command: CreateSettingsCommand) {
    const { userId, settingsData } = command;

    this.logger.debug(`Attempting to create settings for user: ${userId}`);

    try {
      const existingSettings =
        await this.settingsRepository.findByUserId(userId);
      if (existingSettings) {
        this.logger.error(`Settings already exists for user: ${userId}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.Conflict,
          'Settings already exists for this user',
        );
      }

      const settings = await this.settingsRepository.create({
        userId: new Types.ObjectId(userId),
        ...settingsData,
      });

      this.logger.debug(`Settings created successfully for user: ${userId}`);
      return settings;
    } catch (error) {
      this.logger.error(`Failed to create settings for user ${userId}`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ErrorTypes } from 'src/interfaces/error.interface';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SettingsRepository } from '../../repository/setting.repository';
import { LoggerService } from 'src/services/logger-service/index.service';
import { UpdateSettingsCommand } from '../impl/update-settings.command';
import { HttpErrorService } from 'src/services/http-error-service/index.service';

@Injectable()
@CommandHandler(UpdateSettingsCommand)
export class UpdateSettingsHandler
  implements ICommandHandler<UpdateSettingsCommand>
{
  private readonly logger = new LoggerService(UpdateSettingsHandler.name);

  constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  async execute(command: UpdateSettingsCommand) {
    const { userId, updateData } = command;

    this.logger.debug(`Attempting to update settings for user: ${userId}`);

    try {
      const updatedSettings = await this.settingsRepository.updateByUserId(
        userId,
        updateData,
      );

      if (!updatedSettings) {
        this.logger.error(`Settings not found for user: ${userId}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.NotFound,
          'Settings not found',
        );
      }

      this.logger.debug(`Settings updated successfully for user: ${userId}`);
      return updatedSettings;
    } catch (error) {
      this.logger.error(`Failed to update settings for user ${userId}`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}

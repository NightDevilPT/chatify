import { Injectable } from '@nestjs/common';
import { ErrorTypes } from 'src/interfaces/error.interface';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSettingsQuery } from '../impl/get-settings.query';
import { SettingsRepository } from '../../repository/setting.repository';
import { LoggerService } from 'src/services/logger-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';

@Injectable()
@QueryHandler(GetSettingsQuery)
export class GetSettingsHandler implements IQueryHandler<GetSettingsQuery> {
  private readonly logger = new LoggerService(GetSettingsHandler.name);

  constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  async execute(command: GetSettingsQuery) {
    const { userId } = command;

    this.logger.debug(`Attempting to fetch settings for user: ${userId}`);

    try {
      const settings = await this.settingsRepository.findByUserIdWithUserDetails(userId);

      if (!settings) {
        this.logger.error(`Settings not found for user: ${userId}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.NotFound,
          'Settings not found',
        );
      }

      this.logger.debug(`Settings fetched successfully for user: ${userId}`);
      return settings;
    } catch (error) {
      this.logger.error(`Failed to fetch settings for user ${userId}`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}
import { Injectable } from '@nestjs/common';
import { ErrorTypes } from 'src/interfaces/error.interface';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProfileRepository } from '../../repository/profile.repository';
import { UpdateProfileCommand } from '../impl/update-profile.command';
import { LoggerService } from 'src/services/logger-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';

@Injectable()
@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  private readonly logger = new LoggerService(UpdateProfileHandler.name);

  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  async execute(command: UpdateProfileCommand) {
    const { userId, updateData } = command;

    this.logger.debug(`Attempting to update profile for user: ${userId}`);

    try {
      const updatedProfile = await this.profileRepository.updateByUserId(
        userId,
        updateData,
      );

      if (!updatedProfile) {
        this.logger.error(`Profile not found for user: ${userId}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.NotFound,
          'Profile not found',
        );
      }

      this.logger.debug(`Profile updated successfully for user: ${userId}`);
      return updatedProfile;
    } catch (error) {
      this.logger.error(`Failed to update profile for user ${userId}`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}

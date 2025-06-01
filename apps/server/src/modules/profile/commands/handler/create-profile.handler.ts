// src/modules/profiles/commands/handlers/create-profile.handler.ts
import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ErrorTypes } from 'src/interfaces/error.interface';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProfileRepository } from '../../repository/profile.repository';
import { CreateProfileCommand } from '../impl/create-profile.command';
import { LoggerService } from 'src/services/logger-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';

@Injectable()
@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler
  implements ICommandHandler<CreateProfileCommand>
{
  private readonly logger = new LoggerService(CreateProfileHandler.name);

  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  async execute(command: CreateProfileCommand) {
    const { userId, profileData } = command;

    this.logger.debug(`Attempting to create profile for user: ${userId}`);

    try {
      // Check if profile already exists
      const existingProfile = await this.profileRepository.findByUserId(userId);
      if (existingProfile) {
        this.logger.error(`Profile already exists for user: ${userId}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.Conflict,
          'Profile already exists for this user',
        );
      }

      // Create new profile
      const profile = await this.profileRepository.create({
        userId: new Types.ObjectId(userId),
        ...profileData,
      });

      this.logger.debug(`Profile created successfully for user: ${userId}`);
      return profile;
    } catch (error) {
      console.log(error);
      this.logger.error(`Failed to create profile for user ${userId}`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}

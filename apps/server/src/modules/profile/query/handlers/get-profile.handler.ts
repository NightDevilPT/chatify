import { Injectable } from '@nestjs/common';
import { GetProfileQuery } from '../impl/get-profile.query';
import { ErrorTypes } from 'src/interfaces/error.interface';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProfileRepository } from '../../repository/profile.repository';
import { LoggerService } from 'src/services/logger-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';

@Injectable()
@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {
  private readonly logger = new LoggerService(GetProfileHandler.name);

  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  async execute(command: GetProfileQuery) {
    const { userId } = command;
	console.log(userId,'FFFFFFF');

    this.logger.debug(`Attempting to fetch profile for user: ${userId}`);

    try {
      const profile =
        await this.profileRepository.findByUserIdWithUserDetails(userId);

      if (!profile) {
        this.logger.error(`Profile not found for user: ${userId}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.NotFound,
          'Profile not found',
        );
      }

      this.logger.debug(`Profile fetched successfully for user: ${userId}`);
      return profile;
    } catch (error) {
      this.logger.error(`Failed to fetch profile for user ${userId}`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}

// src/modules/users/commands/handlers/verify-user.handler.ts
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorTypes } from 'src/interfaces/error.interface';
import { LoggerService } from 'src/services/logger-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';
import { VerifyUserCommand } from '../impl/verify-user.command';
import { UserRepository } from '../../repository/user.repository';

@Injectable()
@CommandHandler(VerifyUserCommand)
export class VerifyUserHandler implements ICommandHandler<VerifyUserCommand> {
  private readonly logger = new LoggerService(VerifyUserHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  async execute(
    command: VerifyUserCommand,
  ): Promise<{ success: boolean; message: string }> {
    const { token } = command;
    this.logger.debug(`Attempting to verify user with token: ${token}`);

    try {
      if (!token) {
        this.logger.error('No verification token provided');
        throw this.httpErrorService.throwError(
          ErrorTypes.InvalidInput,
          'Verification token is required',
        );
      }

      const user = await this.userRepository.findByToken(token);

      if (!user) {
        this.logger.error(`Invalid verification token: ${token}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.NotFound,
          'Invalid verification token',
        );
      }

      if (user.isVerified) {
        this.logger.debug(`User already verified: ${user.email}`);
        return {
          success: true,
          message: 'User already verified',
        };
      }

      const verifiedUser = await this.userRepository.verifyUser(user.id);

      if (!verifiedUser) {
        this.logger.error(`Failed to verify user with token: ${token}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.InternalServerError,
          'Failed to verify user',
        );
      }

      this.logger.debug(`User verified successfully: ${verifiedUser.email}`);
      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      this.logger.error(`Verification failed for token: ${token}`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}

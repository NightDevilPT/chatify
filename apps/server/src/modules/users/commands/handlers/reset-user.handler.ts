// src/modules/users/commands/handlers/reset-password.handler.ts
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorTypes } from 'src/interfaces/error.interface';
import { LoggerService } from 'src/services/logger-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';
import { HashService } from 'src/services/hash-service/index.service';
import { ResetPasswordCommand } from '../impl/reset-user.command';
import { UserRepository } from '../../repository/user.repository';

@Injectable()
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  private readonly logger = new LoggerService(ResetPasswordHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  async execute(
    command: ResetPasswordCommand,
  ): Promise<{ success: boolean; message: string }> {
    const { token, newPassword } = command;
    this.logger.debug(`Processing password reset with token: ${token}`);

    try {
      if (!token || !newPassword) {
        this.logger.error('Token and new password are required');
        throw this.httpErrorService.throwError(
          ErrorTypes.InvalidInput,
          'Token and new password are required',
        );
      }

      const user = await this.userRepository.findOneRaw({
        token,
      });

      if (!user) {
        this.logger.error(`Invalid or expired password reset token: ${token}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.NotFound,
          'Invalid or expired password reset token',
        );
      }

      const hashedPassword = await this.hashService.hashValue(newPassword);

      await this.userRepository.update(user._id.toString(), {
        password: hashedPassword,
		token: null, // Clear the token after successful reset
      });

      this.logger.debug(
        `Password updated successfully for user: ${user.email}`,
      );

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to reset password with token: ${token}`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}

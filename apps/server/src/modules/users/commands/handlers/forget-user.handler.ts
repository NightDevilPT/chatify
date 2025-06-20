// src/modules/users/commands/handlers/forgot-password.handler.ts
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorTypes } from 'src/interfaces/error.interface';
import { LoggerService } from 'src/services/logger-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';
import { HashService } from 'src/services/hash-service/index.service';
import { MailProvider } from 'src/services/mail/interface';
import { TemplateEnum } from 'src/services/mail/helpers/template-generator';
import { MailSenderService } from 'src/services/mail/services/mail-sender.service';
import { ForgotPasswordCommand } from '../impl/forget-user.command';
import { UserRepository } from '../../repository/user.repository';

@Injectable()
@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  private readonly logger = new LoggerService(ForgotPasswordHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly mailSenderService: MailSenderService,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  async execute(
    command: ForgotPasswordCommand,
  ): Promise<{ success: boolean; message: string }> {
    const { email } = command;
    this.logger.debug(`Processing forgot password request for email: ${email}`);

    try {
      if (!email) {
        this.logger.error('No email provided for password reset');
        throw this.httpErrorService.throwError(
          ErrorTypes.InvalidInput,
          'emailRequired',
        );
      }

      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        this.logger.debug(`No user found with email: ${email}`);
        // Return success even if user not found to prevent email enumeration
        throw this.httpErrorService.throwError(
          ErrorTypes.NotFound,
          'userNotFound',
        );
      }

      // Generate reset token (expires in 1 hour)
      const resetToken = await this.hashService.hashValue(
        email + Date.now().toString(),
      );

      await this.userRepository.update(user.id, {
        token: resetToken,
      });

      this.logger.debug(
        `Password reset token generated for user: ${user.email}`,
      );

      // Send password reset email
      await this.mailSenderService.sendMailTemplate({
        templateName: TemplateEnum.FORGET_PASSWORD,
        payload: {
          username: user.username,
          url: `${process.env.ORIGIN}/auth/update-password?token=${resetToken}`,
        },
        to: user.email,
        subject: 'Password Reset Request',
        provider: MailProvider.GMAIL,
      });

      this.logger.debug(`Password reset email sent to: ${user.email}`);

      return {
        success: true,
        message: 'accountExistPasswordResetLinkSent',
      };
    } catch (error) {
      this.logger.error(`errorProcessingForgotPasswordRequest`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}

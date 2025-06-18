import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repository/user.repository';
import { CreateUserCommand } from '../impl/create-user.command';

import { MailProvider } from 'src/services/mail/interface';
import { TemplateEnum } from 'src/services/mail/helpers/template-generator';
import { MailSenderService } from 'src/services/mail/services/mail-sender.service';

import { ErrorTypes } from 'src/interfaces/error.interface';
import { LoggerService } from 'src/services/logger-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';
import { HashService } from 'src/services/hash-service/index.service';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  private readonly logger = new LoggerService(CreateUserHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailSenderService: MailSenderService,
    private readonly httpErrorService: HttpErrorService,
    private readonly hashService: HashService,
  ) {}

  async execute(command: CreateUserCommand): Promise<User | null> {
    const { email, password, username } = command;

    this.logger.debug(`Attempting to create user with email: ${email}`);

    try {
      if (!email || !password || !username) {
        this.logger.error(`Invalid user data provided for email: ${email}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.InvalidInput,
          'Email, password, and username are required.',
        );
      }

      const findUser = await this.userRepository.findByEmail(email);

      if (findUser) {
        this.logger.error(`User with email ${email} already exists.`);
        throw this.httpErrorService.throwError(
          ErrorTypes.Conflict,
          `conflictUser`,
        );
      }

      const hashedPassword = await this.hashService.hashValue(password);
      const hashToken = await this.hashService.hashValue(
        email + Date.now().toString(),
      );

      const newUser = await this.userRepository.create({
        email,
        password: hashedPassword,
        username,
        token: hashToken,
      });

      if (!newUser) {
        this.logger.error(`Failed to create user with email: ${email}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.InternalServerError,
          'Failed to create user.',
        );
      }

      this.logger.debug(`User created successfully with email: ${email}`);

      this.mailSenderService.sendMailTemplate({
        templateName: TemplateEnum.VERIFY_EMAIL,
        payload: {
          username: newUser.username,
          url: `${process.env.ORIGIN}/verify-email?token=${hashToken}`,
        },
        to: newUser.email,
        subject: 'Verify your email address',
        provider: MailProvider.GMAIL,
      });
      this.logger.debug(`Verification email sent to: ${email}`);
      return newUser;
    } catch (error) {
      this.logger.error(`Failed to create user with email: ${email}`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}

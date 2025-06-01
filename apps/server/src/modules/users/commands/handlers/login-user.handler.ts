// src/modules/auth/commands/handlers/login.handler.ts
import { Injectable } from '@nestjs/common';
import { ErrorTypes } from 'src/interfaces/error.interface';
import { LoginCommand } from '../impl/login-user.command';
import { UserRepository } from '../../repository/user.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserPayload } from 'src/interfaces/jwt-payload.interface';
import { HashService } from 'src/services/hash-service/index.service';
import { LoggerService } from 'src/services/logger-service/index.service';
import { JwtTokenService } from 'src/services/jwt-token-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';

@Injectable()
@CommandHandler(LoginCommand)
export class LoginUserHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new LoggerService(LoginUserHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly httpErrorService: HttpErrorService,
  ) {}

  async execute(command: LoginCommand): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      username: string;
      isVerified: boolean;
    };
  }> {
    const { email, password } = command;
    this.logger.debug(`Attempting login for email: ${email}`);

    try {
      if (!email || !password) {
        this.logger.error('Email and password are required');
        throw this.httpErrorService.throwError(
          ErrorTypes.InvalidInput,
          'Email and password are required',
        );
      }

      const user = await this.userRepository.findByEmail(email, true);
      this.logger.debug(`User found: ${user ? user.email : 'None'}`);
      console.log(user);

      if (!user) {
        this.logger.error(`No user found with email: ${email}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.Unauthorized,
          'Invalid credentials',
        );
      }

      const passwordMatch = await this.hashService.compareValue(
        password,
        user.password,
      );
      console.log(passwordMatch, 'passwordMatch');

      if (!passwordMatch) {
        this.logger.error(`Invalid password for email: ${email}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.Unauthorized,
          'Invalid credentials',
        );
      }

      if (!user.isVerified) {
        this.logger.error(`User not verified: ${email}`);
        throw this.httpErrorService.throwError(
          ErrorTypes.Forbidden,
          'Please verify your email before logging in',
        );
      }

      const payload: UserPayload = {
        userId: user.toObject()._id.toString(),
        email: user.email,
      };

      const accessToken = this.jwtTokenService.generateAccessToken(payload);
      const refreshToken = this.jwtTokenService.generateRefreshToken(payload);

      this.logger.debug(`Login successful for user: ${user.email}`);

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed for email: ${email}`, error);
      throw this.httpErrorService.handleUnexpectedError(error);
    }
  }
}

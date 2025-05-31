import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { VerifyUserCommand } from './commands/impl/verify-user.command';
import { ForgotPasswordCommand } from './commands/impl/forget-user.command';
import { ResetPasswordCommand } from './commands/impl/reset-user.command';
import { LoginDto } from './dto/login-user.dto';
import { LoginCommand } from './commands/impl/login-user.command';


@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username } = createUserDto;

    // Execute command through CQRS
    const command = new CreateUserCommand(email, password, username);
    return this.commandBus.execute(command);
  }

  async verifyEmail(
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const command = new VerifyUserCommand(token);
    return this.commandBus.execute(command);
  }

  async forgotPassword(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    const command = new ForgotPasswordCommand(email);
    return this.commandBus.execute(command);
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const command = new ResetPasswordCommand(token, newPassword);
    return this.commandBus.execute(command);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.commandBus.execute(new LoginCommand(email, password));
  }
}

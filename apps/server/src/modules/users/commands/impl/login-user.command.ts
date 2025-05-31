// src/modules/auth/commands/impl/login.command.ts
import { ICommand } from '@nestjs/cqrs';

export class LoginCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

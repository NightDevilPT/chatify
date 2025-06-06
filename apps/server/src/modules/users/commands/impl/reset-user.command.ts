// src/modules/users/commands/impl/reset-password.command.ts
import { ICommand } from '@nestjs/cqrs';

export class ResetPasswordCommand implements ICommand {
  constructor(
    public readonly token: string,
    public readonly newPassword: string,
  ) {}
}

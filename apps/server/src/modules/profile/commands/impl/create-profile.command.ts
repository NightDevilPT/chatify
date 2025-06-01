// src/modules/profiles/commands/impl/create-profile.command.ts
import { ICommand } from '@nestjs/cqrs';
import { CreateProfileDto } from '../../dto/create-profile.dto';

export class CreateProfileCommand implements ICommand {
  constructor(
    public readonly userId: string, // Will come from authenticated user
    public readonly profileData: CreateProfileDto,
  ) {}
}

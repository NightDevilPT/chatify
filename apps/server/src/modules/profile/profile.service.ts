import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { GetProfileQuery } from './query/impl/get-profile.query';
import { CreateProfileCommand } from './commands/impl/create-profile.command';
import { UpdateProfileCommand } from './commands/impl/update-profile.command';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getProfileByUserId(userId: string): Promise<ProfileResponseDto> {
    return await this.queryBus.execute(new GetProfileQuery(userId));
  }

  async create(userId: string, createProfileDto: CreateProfileDto) {
    return this.commandBus.execute(
      new CreateProfileCommand(userId, createProfileDto),
    );
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto) {
    return await this.commandBus.execute(
      new UpdateProfileCommand(userId, updateProfileDto),
    );
  }
}

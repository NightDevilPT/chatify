// src/modules/profiles/profiles.module.ts
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileQueryHandlers } from './query';
import { ProfilesService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileCommandHandlers } from './commands';
import { ProfilesController } from './profile.controller';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { ProfileRepository } from './repository/profile.repository';
import { LoggerService } from 'src/services/logger-service/index.service';
import { JwtTokenService } from 'src/services/jwt-token-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CqrsModule,
    JwtModule,
  ],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    ProfileRepository,
    LoggerService,
    HttpErrorService,
    JwtTokenService,
    ...ProfileCommandHandlers,
    ...ProfileQueryHandlers,
  ],
})
export class ProfilesModule {}

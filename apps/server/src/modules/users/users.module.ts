import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserCommandHandlers } from './commands';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { MailModule } from 'src/services/mail/mail.module';
import { UserRepository } from './repository/user.repository';
import { HashService } from 'src/services/hash-service/index.service';
import { LoggerService } from 'src/services/logger-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';
import { JwtTokenService } from 'src/services/jwt-token-service/index.service';
import { Settings, SettingsSchema } from '../settings/entities/setting.entity';
import { SettingsRepository } from '../settings/repository/setting.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Settings.name, schema: SettingsSchema },
    ]),
    MailModule,
    CqrsModule,
    JwtModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    LoggerService,
    HashService,
    JwtTokenService,
    SettingsRepository,
    HttpErrorService,
    ...UserCommandHandlers,
  ],
})
export class UsersModule {}

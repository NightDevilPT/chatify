import { Module } from '@nestjs/common';
import { SettingsQueryHandlers } from './queries';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsCommandHandlers } from './commands';
import { SettingsController } from './settings.controller';
import { SettingsRepository } from './repository/setting.repository';
import { Settings, SettingsSchema } from './entities/setting.entity';
import { JwtService } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { HashService } from 'src/services/hash-service/index.service';
import { LoggerService } from 'src/services/logger-service/index.service';
import { JwtTokenService } from 'src/services/jwt-token-service/index.service';
import { HttpErrorService } from 'src/services/http-error-service/index.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Settings.name, schema: SettingsSchema },
    ]),
    CqrsModule
  ],
  controllers: [SettingsController],
  providers: [
    SettingsService,
    SettingsRepository,
    HttpErrorService,
    LoggerService,
    HashService,
    JwtService,
    JwtTokenService,
    ...SettingsCommandHandlers,
    ...SettingsQueryHandlers,
  ],
})
export class SettingsModule {}

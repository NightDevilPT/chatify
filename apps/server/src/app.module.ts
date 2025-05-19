import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/mongoose.configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { Modules } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const db = configService.get('database');
        return {
          uri: `${db.uri}/${db.name}`,
          // user: db.user,
          // pass: db.password,
          // authSource: db.authSource,
        };
      },
      inject: [ConfigService],
    }),
    ...Modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

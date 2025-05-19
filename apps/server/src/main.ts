import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // somewhere in your initialization file
  app.use(cookieParser());
  app.enableCors({
    origin: true, // or specify your frontend URL
    credentials: true, // important for cookies
  });

  // Rest of your setup...
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

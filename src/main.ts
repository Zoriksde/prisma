import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.get<number>('APP_PORT') || 3000);
}

bootstrap();

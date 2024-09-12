import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const APP_PORT = process.env.APP_PORT || 3050;
  await app.listen(APP_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

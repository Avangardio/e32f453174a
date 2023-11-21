import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const secret = configService.get('JWT');

  app.use(cookieParser());

  const { port, host } = configService.get('server');

  await app.listen(port, '0.0.0.0');
  console.log('Server started on: ' + host);
}

bootstrap();

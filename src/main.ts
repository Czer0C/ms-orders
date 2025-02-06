import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BASE_PORT } from 'src/enum';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? BASE_PORT);
}

bootstrap();

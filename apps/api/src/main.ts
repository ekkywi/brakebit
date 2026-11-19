import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnv } from './config/env.schema';

async function bootstrap() {
  const env = loadEnv();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: env.CORS_ORIGIN.split(',').map((value) => value.trim()),
  });

  await app.listen(env.API_PORT);
  console.log(`Brakebit API listening on http://localhost:${env.API_PORT}`);
}

void bootstrap();

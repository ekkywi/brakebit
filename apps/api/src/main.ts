import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { loadEnv } from './config/env.schema';

async function bootstrap() {
  const env = loadEnv();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Behind Render's proxy, req.ip is the proxy's address unless this is set.
  // Guest quota and throttling are per IP, so this must be right in production.
  if (env.TRUST_PROXY_HOPS > 0) {
    app.set('trust proxy', env.TRUST_PROXY_HOPS);
  }

  app.use(cookieParser());
  app.enableCors({
    origin: env.CORS_ORIGIN.split(',').map((value) => value.trim()),
    credentials: true,
  });

  await app.listen(env.API_PORT);
  console.log(`Brakebit API listening on http://localhost:${env.API_PORT}`);
}

void bootstrap();

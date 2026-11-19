export type AppEnv = {
  NODE_ENV: 'development' | 'production' | 'test';
  API_PORT: number;
  CORS_ORIGIN: string;
  DATABASE_URL?: string;
  DIRECT_URL?: string;
};

export function loadEnv(): AppEnv {
  const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('API_PORT must be a positive number');
  }

  return {
    NODE_ENV:
      (process.env.NODE_ENV as AppEnv['NODE_ENV'] | undefined) ?? 'development',
    API_PORT: port,
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
  };
}

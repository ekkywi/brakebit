import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type AppEnv = {
  NODE_ENV: 'development' | 'production' | 'test';
  API_PORT: number;
  CORS_ORIGIN: string;
  DATABASE_URL?: string;
  DIRECT_URL?: string;
  SOLANA_RPC_URL?: string;
};

/** Parse a dotenv file into process.env without overriding existing values. */
function applyEnvFile(path: string) {
  if (!existsSync(path)) return;

  const text = readFileSync(path, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eq = line.indexOf('=');
    if (eq <= 0) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

/** Load monorepo root `.env`, then local overrides. */
function loadEnvFiles() {
  const cwd = process.cwd();
  const candidates = [
    resolve(cwd, '../../.env'), // when cwd is apps/api
    resolve(cwd, '.env'), // when cwd is repo root
    resolve(cwd, 'apps/api/.env'),
  ];

  for (const path of candidates) {
    applyEnvFile(path);
  }
}

export function loadEnv(): AppEnv {
  loadEnvFiles();

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
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
  };
}

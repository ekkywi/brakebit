# Brakebit

Crypto safety tools — **brake before you buy**.

Brakebit helps people check token risk before buying. It is not a trading platform, signal bot, or custodial wallet.

## Monorepo

```text
apps/web      Next.js UI
apps/api      NestJS API
packages/db   Prisma schema + client (Neon/Postgres)
packages/shared  Shared types (RiskReport, etc.)
```

Full folder map: [`STRUCTURE.md`](./STRUCTURE.md). Design: [`DESIGN.md`](./DESIGN.md). Product scope and build order: [`ROADMAP.md`](./ROADMAP.md).

## Prerequisites

- Node.js 20+
- pnpm 9+
- Neon Postgres (optional for local stub — persistence soft-fails without `DATABASE_URL`)

## Setup

```bash
pnpm install
cp .env.example .env
# optional: fill DATABASE_URL + DIRECT_URL from Neon

pnpm --filter @brakebit/shared build
pnpm --filter @brakebit/db generate
pnpm --filter @brakebit/db build
```

## Develop

```bash
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001
- Health: `GET /health`
- Token check (stub): `POST /checks` `{ "address": "..." }`

## Notes

- Token Checker currently uses a **stub Solana provider** so the monorepo wiring runs locally.
- Scoring rules live in `apps/api/src/modules/checks/domain` (pure, testable).
- Product data (users/history) goes in Neon via Prisma. Chain data comes from RPC/indexers — not mirrored wholesale into Postgres.

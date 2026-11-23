# Brakebit

Crypto safety tools — **brake before you buy**.

Brakebit helps people check Solana token risk before buying. It is not a trading platform, signal bot, or custodial wallet.

**Focus now:** Solana only (SPL Token + Token-2022). Search by name/symbol or paste a mint; get a scored report with honest unknowns.

## Monorepo

```text
apps/web      Next.js UI
apps/api      NestJS API
packages/db   Prisma schema + client (Neon/Postgres)
packages/shared  Shared types (RiskReport, etc.)
```

Docs live under [`docs/`](./docs/): [`STRUCTURE`](./docs/STRUCTURE.md), [`DESIGN`](./docs/DESIGN.md), [`ROADMAP`](./docs/ROADMAP.md), [`AUTH`](./docs/AUTH.md). Index: [`docs/README.md`](./docs/README.md).

## Prerequisites

- Node.js 20+
- pnpm 9+
- Neon Postgres (optional — persistence soft-fails without `DATABASE_URL`)

## Setup

```bash
pnpm install
cp .env.example .env
# required for live Solana: SOLANA_RPC_URL (Helius free tier recommended)
# optional: DATABASE_URL + DIRECT_URL from Neon (persist + recent + check cache)
# optional: CHECKS_RATE_LIMIT / CHECKS_RATE_TTL_MS
# optional: CHECK_CACHE_TTL_MS (default 300000 = 5m; 0 disables cache)
# optional mega-cap holders: SOLSCAN_API_KEY or BIRDEYE_API_KEY

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
- Token search: `GET /tokens/search?q=bonk`
- Token check: `POST /checks` `{ "chain": "solana", "address": "<mint>" }`
- Recently reviewed: `GET /checks/recent?limit=5` — unique mints, latest check each (needs `DATABASE_URL`; empty otherwise)

## What a live Solana check covers today

| Signal | Source |
|---|---|
| Mint / freeze authority | Solana RPC `getMint` (SPL + Token-2022) |
| Top holder % | RPC `getTokenLargestAccounts`, then optional Rugcheck / Solscan / Birdeye |
| Mint age (hours) | RPC signatures (phase 1: one page; long history → unknown) |
| Token name / symbol / logo | Helius DAS `getAsset` when available |
| LP lock / liquidity USD | Not measured yet (shown as unknown) |

Search uses Jupiter’s public token search (proxied by the API). Rate limiting applies to `POST /checks` only.

**History & cache (needs `DATABASE_URL`):**
- Each **live** successful check appends a row to `CheckHistory`.
- `GET /checks/recent` and the check-page table show globally reviewed mints (one row per address, latest score).
- Within `CHECK_CACHE_TTL_MS` (default **5 minutes**), repeating `POST /checks` for the same mint returns the stored report with `cached: true` — **no Solana RPC** and **no new Neon insert**. Set `CHECK_CACHE_TTL_MS=0` to always run live. Without `DATABASE_URL`, cache is off.

## Notes

- Prefer a dedicated RPC (Helius). Public Labs RPC often rate-limits holder queries.
- Scoring rules live in `apps/api/src/modules/checks/domain` (pure, testable).
- Product data (check history, later users) lives in Neon via Prisma. Chain data comes from RPC/indexers — not mirrored wholesale into Postgres.
- Without `DATABASE_URL`, checks still run; persist, recent list, and cache soft-fail (live RPC every time).

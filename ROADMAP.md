# Brakebit product & roadmap

English-first crypto safety product: **brake before you buy**. Risk review tools only — not a trading desk, signal feed, wallet, or custodian.

Agents on a fresh clone: read this with [`STRUCTURE.md`](./STRUCTURE.md) and [`DESIGN.md`](./DESIGN.md) before inventing features or folders.

---

## Product scope

**In scope**

- Multi-chain token risk review (address → structured report)
- Plain-language findings + score + signal breakdown
- Read-only analysis (no keys, no custody, no trade execution)
- Clear disclaimer: indicators for diligence, not investment advice

**Out of scope (do not build)**

- Trading, swaps, or order routing
- Price signals, “buy/sell” calls, or portfolio advice
- Wallet connect / key custody / signing
- Fake trust markers (fabricated partner logos, fake stats, fake audits)

**Networks (UI + shared types today)**

Ethereum, Solana, Base, Arbitrum, BNB Chain, Polygon.

Provider depth still lags the UI: checks are largely stubbed (see below).

---

## Current status (as of this repo)

### Done

| Area | State |
|---|---|
| Monorepo | `apps/web` (Next.js), `apps/api` (NestJS), `packages/shared`, `packages/db` (Prisma/Neon) |
| Landing + check UI | Multi-chain copy, preview report, light/dark theme, solid header |
| Shared types | `RiskReport`, check request, `CHAIN_META` |
| API | `GET /health`, `POST /checks` with chain-aware DTO + address shape checks |
| Scoring domain | Pure score/reason builders under `apps/api/.../checks/domain` |
| Persistence schema | `User`, `CheckHistory` in Prisma (optional soft-fail without `DATABASE_URL`) |
| Docs | `README`, `STRUCTURE`, `DESIGN`, this roadmap |

### Partial / stub

| Area | Gap |
|---|---|
| Chain providers | Stub Solana-oriented provider; EVM networks selectable in UI but not fully backed by live RPC/indexers |
| Prisma `Chain` enum | Schema still Solana-centric; needs alignment with multi-chain shared types |
| Neon usage | Schema ready; history/auth flows not productized in UI |
| Auth / quota | Models hint at users; no login or rate limits yet |

---

## Build order (next)

Priorities are intentional. Finish each band before inventing adjacent product surfaces.

### P0 — Real checks

1. Live Solana provider (mint / authority / freeze / holder cues as available)
2. Live EVM provider(s) for Ethereum + L2s in `CHAIN_META` (contract ownership, transfer restrictions, liquidity/holder signals where sources allow)
3. Align Prisma `Chain` enum and `CheckHistory` with `packages/shared` chains
4. Persist successful checks when `DATABASE_URL` is set; keep soft-fail when it is not
5. Honest empty/error states when a chain or signal source is unavailable

### P1 — Product hardening

1. Rate limiting / abuse controls on `POST /checks`
2. Optional auth + check history UI (read past reports)
3. Source links in the report (explorer / primary references)
4. Stronger address validation messages per chain family
5. Basic observability (request id, provider latency, failure reasons)

### P2 — Later

1. Quota / plans if usage needs gating
2. Export / share a report snapshot (no fake “verified” badges)
3. Additional chains only after providers for the current set are credible
4. Favicon / OG assets under `apps/web/public` (replace scaffold defaults)

---

## Non-goals for the near term

- Mobile native apps
- Browser extension
- On-chain execution of any kind
- Mirroring full chain state into Postgres
- AI-generated “will this pump?” narratives

---

## Working agreements

- Risk copy stays factual; never invent partners, audits, or TVL.
- UI direction: [`DESIGN.md`](./DESIGN.md). Folder intent: [`STRUCTURE.md`](./STRUCTURE.md).
- New empty folders that must survive clone get a `.gitkeep` and a row in `STRUCTURE.md`.
- Update this file when a P0/P1 item ships or scope changes.

---

## Quick links

| Doc | Role |
|---|---|
| [`README.md`](./README.md) | Setup and run |
| [`STRUCTURE.md`](./STRUCTURE.md) | Folder map |
| [`DESIGN.md`](./DESIGN.md) | Visual direction |
| [`ROADMAP.md`](./ROADMAP.md) | Product scope + build order |

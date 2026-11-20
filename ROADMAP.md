# Brakebit product & roadmap

English-first crypto safety product: **brake before you buy**. Risk review tools only — not a trading desk, signal feed, wallet, or custodian.

Agents on a fresh clone: read this with [`STRUCTURE.md`](./STRUCTURE.md) and [`DESIGN.md`](./DESIGN.md) before inventing features or folders.

---

## Product scope

**In scope**

- Solana token risk review (mint address → structured report)
- Plain-language findings + score + signal breakdown
- Token name/symbol search to help users confirm the mint
- Read-only analysis (no keys, no custody, no trade execution)
- Clear disclaimer: indicators for diligence, not investment advice

**Out of scope (do not build)**

- Trading, swaps, or order routing
- Price signals, “buy/sell” calls, or portfolio advice
- Wallet connect / key custody / signing
- Fake trust markers (fabricated partner logos, fake stats, fake audits)

**Networks**

Solana only in shared types and UI. Other chains stay off the product surface until a live provider is ready. Do not re-add stub chain chips.

---

## Current status (as of this repo)

### Done

| Area | State |
|---|---|
| Monorepo | `apps/web` (Next.js), `apps/api` (NestJS), `packages/shared`, `packages/db` (Prisma/Neon) |
| Landing + check UI | Solana-only copy, report preview, example deep link, URL state (`address`), light/dark, solid header |
| Token search | Name/symbol search via Jupiter proxy (`GET /tokens/search`); pick result → mint fills |
| Report identity | Name, symbol, logo from Helius DAS `getAsset` when available |
| Shared types | `RiskReport` (+ optional `token`), check request, Solana-only `CHAIN_META` |
| API | `GET /health`, `POST /checks`, `GET /tokens/search` |
| Solana provider | SPL Token + Token-2022; mint/freeze authority; top holder (RPC → Rugcheck → optional Solscan/Birdeye); mint age phase 1 (single RPC page) |
| Rate limiting | In-memory Throttler on `POST /checks` (env `CHECKS_RATE_*`); friendly 429 copy; health + search skipped |
| Scoring domain | Pure score/reason builders under `apps/api/.../checks/domain` |
| Persistence schema | `User`, `CheckHistory` in Prisma (soft-fail without `DATABASE_URL`) |
| Docs | `README`, `STRUCTURE`, `DESIGN`, this roadmap |

### Partial / next gaps

| Area | Gap |
|---|---|
| Mint age | Phase 1 only: full 1000-signature page → age stays unknown (no deep pagination yet) |
| LP / liquidity | Still `unknown` until a trustworthy source exists |
| Neon usage | Schema ready; history not wired in API/UI |
| Auth / credits | No login; pay-per-check / free trial not built yet |
| Observability | No request id / provider latency metrics yet |

---

## Build order (next)

Priorities are intentional. Finish each band before inventing adjacent product surfaces.

### P0 — Real checks (Solana-first)

1. Live Solana provider (mint / freeze / top holder / age phase 1 / Token-2022 / metadata) — **done**
2. Deeper mint-age pagination only if needed; keep LP/liquidity unknown until proven
3. Persist successful checks when `DATABASE_URL` is set; keep soft-fail when it is not
4. Honest empty/error states when a signal source is unavailable — **mostly in place**
5. Additional chains — only after Solana depth stays credible; do not re-add stub chips

### P1 — Product hardening

1. Rate limiting on `POST /checks` — **done**
2. Token name/symbol search — **done**
3. Optional auth + check history UI (read past reports)
4. Pay-as-you-go credits (e.g. 1 free check, then pay per scan) — preferred over subscription for now
5. Stronger address validation / dead-mint messaging
6. Basic observability (request id, provider latency, failure reasons)

### P2 — Later

1. Quota / subscription plans if usage needs gating beyond pay-per-check
2. Export / share a report snapshot (no fake “verified” badges)
3. Additional chains only after Solana providers stay credible
4. Favicon / OG assets under `apps/web/public` (replace scaffold defaults)
5. Self-hosted indexer (only if RPC/index APIs are no longer enough)

---

## Non-goals for the near term

- Mobile native apps
- Browser extension
- On-chain execution of any kind
- Mirroring full chain state into Postgres
- AI-generated “will this pump?” narratives
- Multi-chain UI stubs without live providers

---

## Working agreements

- Risk copy stays factual; never invent partners, audits, or TVL.
- Unknown stays unknown — do not fill LP/liquidity/age with guesses.
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

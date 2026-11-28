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
| Landing + check UI | Solana-only copy, report preview, example deep link, URL state (`address`), light/dark, solid header; check page screener-lite (toolbar + table + report panel) |
| Token search | Name/symbol search via Jupiter proxy (`GET /tokens/search`); pick result → mint fills |
| Report identity | Name, symbol, logo from Helius DAS `getAsset` when available |
| Shared types | `RiskReport` (+ optional `token`, `cached`), check request, Solana-only `CHAIN_META` |
| API | `GET /health`, `POST /checks`, `GET /checks/recent`, `GET /tokens/search` |
| Solana provider | SPL Token + Token-2022; mint/freeze authority; top holder (RPC → Rugcheck → optional Solscan/Birdeye); mint age phase 1 (single RPC page) |
| Rate limiting | In-memory Throttler on `POST /checks` (env `CHECKS_RATE_*`); friendly 429 copy; health + search skipped |
| Scoring domain | Pure score/reason builders under `apps/api/.../checks/domain` |
| Persistence | Live successful checks append to `CheckHistory` (soft-fail); `GET /checks/recent` = unique mints (latest per address) |
| Check cache | Same mint within `CHECK_CACHE_TTL_MS` (default 5m) reuses latest history row: skip RPC + skip insert; UI shows `cached` vs `live` |
| Docs | Root `README`; `docs/` (`STRUCTURE`, `DESIGN`, `AUTH`, this roadmap) |

### Partial / next gaps

| Area | Gap |
|---|---|
| Mint age | Phase 1 only: full 1000-signature page → age stays unknown (no deep pagination yet) |
| LP / liquidity | Read since 26 Nov 2026: LP lock from Rugcheck (USD-weighted, 95% threshold, LP-token pools only; any mid-range pool, above 0 and below 100, makes it Unknown until verified against lockers); liquidity from DexScreener (sum of Solana pools). Unknown when the source has no data |
| Auth / per-user history | Recently reviewed is global (anon); per signed-in user history not built |
| Auth / credits | Phase A wallet login **done**; Phase B Langkah 1–6 **done** in code (campaign lots, ledger, welcome on login, guest quota, credit gate, `/credits/me`, `/dashboard` with balance and guest modal; owner tested the main flow, signed-in check with credits still to record); admin campaign dashboard and USDC top-up still open — [`AUTH.md`](./AUTH.md) |
| Observability | No request id / provider latency metrics yet |

---

## Build order (next)

Priorities are intentional. Finish each band before inventing adjacent product surfaces.

### P0 — Real checks (Solana-first)

1. Live Solana provider (mint / freeze / top holder / age phase 1 / Token-2022 / metadata) — **done**
2. Deeper mint-age pagination only if needed; verify the LP-lock mid-range values against lockers (see DESIGN.md, Credibility rules)
3. Persist successful checks when `DATABASE_URL` is set; keep soft-fail when it is not — **done**
4. Short TTL check cache (reuse history, skip RPC/insert) — **done** (default 5m; `CHECK_CACHE_TTL_MS`)
5. Honest empty/error states when a signal source is unavailable — **mostly in place**
6. Additional chains — only after Solana depth stays credible; do not re-add stub chips

### P1 — Product hardening

1. Rate limiting on `POST /checks` — **done**
2. Token name/symbol search — **done**
3. Global recently-reviewed mints UI (unique by address from Neon) — **done**; optional auth for per-user history still open
4. Pay-as-you-go credits (crypto top-up preferred) — see [`AUTH.md`](./AUTH.md); **Phase A done**; Phase B Langkah 1–6 done in code (campaigns, expiring lots, ledger, welcome 10 credits / 7 days, guest 1 free check/day, credit gate, `/dashboard` balance); record the signed-in check test, then admin campaign dashboard (Phase B2), then USDC top-up. **Decided 26 Nov 2026: B2 and C are postponed; UI work comes first.**
5. Stronger address validation / dead-mint messaging — **done** (28 Nov 2026): base58 check in the web field and in `CreateCheckDto` (non-base58 never reaches RPC or the guest quota); the API sends only copy written for users (`UserFacingCheckError`), and any other provider error becomes a fixed 503 `CHECK_UNAVAILABLE`, so raw RPC text (which can hold an API key) is never shown
6. Basic observability (request id, provider latency, failure reasons)
7. Optional force-refresh to bypass check cache (e.g. `?fresh=1` / UI control)

### P2 — Later

1. Quota / subscription plans if usage needs gating beyond pay-per-check
2. Export / share a report snapshot (no fake “verified” badges)
3. Additional chains only after Solana providers stay credible
4. Favicon / OG assets. Favicon done (27 Nov 2026): `apps/web/src/app/icon.svg` is the brand mark, and the template `favicon.ico` was removed. OG image still open under `apps/web/public`
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
- Unknown stays unknown — do not fill LP/liquidity/age with guesses. A missing pool or a missing locked share is Unknown, never 0.
- UI direction: [`DESIGN.md`](./DESIGN.md). Folder intent: [`STRUCTURE.md`](./STRUCTURE.md). Auth/credits plan: [`AUTH.md`](./AUTH.md).
- New empty folders that must survive clone get a `.gitkeep` and a row in `STRUCTURE.md`.
- Update this file (and `AUTH.md` status) when a P0/P1 or auth phase ships or scope changes.

---

## Quick links

| Doc | Role |
|---|---|
| [`../README.md`](../README.md) | Setup and run |
| [`README.md`](./README.md) | Docs index |
| [`STRUCTURE.md`](./STRUCTURE.md) | Folder map |
| [`DESIGN.md`](./DESIGN.md) | Visual direction |
| [`ROADMAP.md`](./ROADMAP.md) | Product scope + build order |
| [`AUTH.md`](./AUTH.md) | Wallet login, credits, crypto top-up plan + status |

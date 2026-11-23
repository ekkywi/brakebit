# Brakebit auth, credits & payments (planning)

English-first. Read with [`ROADMAP.md`](./ROADMAP.md) and [`STRUCTURE.md`](./STRUCTURE.md).

This file is the **handoff** so another machine or agent session knows what was decided, what is already shipped, and what to build next for login / credits / crypto top-up.

Update the status table here whenever a phase ships.

---

## Product decisions (agreed)

- Pay-per-check preferred over subscription for now.
- **1 live check = 1 credit.** Cache hit within `CHECK_CACHE_TTL_MS` (default 5 minutes) is **free** (no spend, no RPC, no insert).
- Token search + recently-reviewed table remain free.
- Prefer **full crypto top-up** for user privacy; **USDC on Solana** first.
- Primary identity for MVP: **wallet sign-in** (Sign-In with Solana style). Email/password is **not** required.
- Email magic-link / OAuth may come later as optional recovery; not blocking Phase A–C.
- Brakebit does **not** custody user keys, does not swap/trade, and is not a wallet app. Credits are an **off-chain ledger** after a verified on-chain payment.

---

## Security posture (honest)

- No auth system is 100% guaranteed safe.
- Goal: make *our* side hard to exploit (one-time nonce, httpOnly sessions, server-side signature verify, idempotent payments).
- Residual risk always remains: phishing, malware on the user device, implementation bugs, XSS leading to session theft, vulnerable dependencies.
- Login must be **message signature only**. Never require token approve, unlimited allowance, or a transfer merely to sign in.
- Do not market “unhackable” or “fully anonymous guaranteed.”

### Phase A security checklist (must follow)

1. Auth message includes product name, fixed `AUTH_DOMAIN`, wallet address, nonce, issued-at, expiry.
2. Nonce stored server-side (hash), single use, short TTL (about 5–10 minutes).
3. Verify ed25519 signature on the server with a mature library; reject mutated messages / wrong domain / reused or expired nonce.
4. Session: opaque id, hashed at rest in DB; cookie `HttpOnly; Secure; SameSite=Lax` or `Strict`.
5. Do not treat “wallet connected in the browser” as logged in without a fresh verified signature.
6. Rate-limit nonce and verify endpoints; check `Origin` / CSRF posture on state-changing auth routes.
7. Never accept private keys or seed phrases.

---

## Current repo status

| Piece | Status |
|---|---|
| Anonymous checks + IP rate limit | Done |
| `CheckHistory` persist + recent unique mints | Done |
| Check cache TTL (default 5m) | Done |
| Screener check UI (toolbar + table + report panel) | Done |
| `User` + `AuthNonce` + `Session` | Done (wallet-first; email optional) |
| Wallet login API (SIWS-style message) | **Done** (Phase A) |
| Web Sign in (Phantom message sign) + session cookie | **Done** (Phase A) |
| `SessionAuthGuard` (for later protected routes) | **Done** (not gating checks yet) |
| `CreditAccount` + `CreditLedger` | **Not started** (Phase B) |
| Gate `POST /checks` by credits | **Not started** (Phase B) |
| Crypto top-up (Solana USDC / Solana Pay) | **Not started** (Phase C) |
| Force-refresh bypass cache | Not started (ROADMAP P1) |
| Email + password as required path | Explicitly **out of scope** for MVP |

---

## Build order (do in sequence)

### Phase A — Wallet login — **done**

1. Prisma: `User.walletAddress`, `AuthNonce`, `Session` — **done**
2. API `auth` module: nonce / verify / logout / me + httpOnly cookie — **done**
3. Env: `AUTH_DOMAIN`, `SESSION_TTL_MS`, `AUTH_NONCE_TTL_MS` — **done**
4. Web header: Phantom connect → sign message → verify → short address + logout — **done**
5. Origin check on mutating auth routes; tighter throttle on `/auth/*`; `SessionAuthGuard` exported — **done**

**Out of scope for Phase A (still):** spending credits, payment UI, email auth, gating checks behind balance.

**How to try:** install Phantom, open the site, click **Sign in**, approve the message. `/auth/me` should succeed with credentials. **Log out** clears the cookie.

### Phase B — Credits ledger

1. `CreditAccount` (`userId`, `balance`) + append-only `CreditLedger` (`delta`, `reason`, `refId`, `createdAt`).
2. On `POST /checks`: if session present, spend **1 credit only on live/cache-miss**; cache hit = no spend.
3. Use a DB transaction + row lock (or equivalent) so double-submit cannot double-spend.
4. Optional welcome grant (e.g. 1 credit) on first successful wallet login.
5. Set `CheckHistory.userId` when a session user is present.

### Phase C — Crypto top-up

1. `Payment` / `CryptoPaymentIntent`: pack size, amount, destination or Solana Pay reference, expiry, status.
2. Asset: **USDC on Solana** first (SOL quotes optional later; short-lived quote if used).
3. Watcher or webhook: required confirmations → idempotent ledger credit keyed by unique `txid`.
4. Never grant credits from a client-only “I paid” claim.
5. Pack SKUs example: 10 / 50 / 100 checks.

### Phase D — Hardening

- Force-refresh to bypass check cache (paid live re-check).
- Optional email link for recovery (still no required password).
- Observability: auth failures, payment anomalies, spend errors.
- External security review before strong security claims in marketing.

---

## API sketch (Phase A)

| Method | Path | Notes |
|---|---|---|
| `POST` | `/auth/solana/nonce` | Creates one-time nonce; rate limited |
| `POST` | `/auth/solana/verify` | Verifies signature; sets httpOnly session cookie |
| `POST` | `/auth/logout` | Revokes session |
| `GET` | `/auth/me` | `{ id, walletAddress }` or 401 |

Reject verify when: wrong domain in message, reused nonce, expired nonce, bad signature, address mismatch.

---

## Explicit non-goals (near term)

- Email + password as the required login path
- “Connected wallet” without signature = authenticated
- Storing seeds / asking for private keys
- Custodial balances or in-app swap
- Subscription billing as the default (see ROADMAP P2)
- Multi-chain payments before Solana USDC top-up works
- KYC flows in MVP (business compliance may still apply to the operator; do not invent end-user KYC UI unless required later)

---

## Handoff checklist for the next agent / machine

1. Read [`AUTH.md`](./AUTH.md) (this file), [`ROADMAP.md`](./ROADMAP.md), [`STRUCTURE.md`](./STRUCTURE.md), [`DESIGN.md`](./DESIGN.md) for any UI.
2. Phase A is done. Implement **Phase B** next unless the user asks otherwise.
3. Do not invent trading, custody, or multi-chain payment stubs.
4. After shipping a phase: update the status table above and the matching ROADMAP rows.
5. Security: follow the Phase A checklist; do not weaken nonce/session rules for convenience.

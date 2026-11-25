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
- **No separate `welcome_grant` type.** Welcome is just one **campaign** with trigger `first_login`. All free credits are `promo_grant` entries identified by `campaignId`.
- Promo credits **must expire**. The expiry duration is **dynamic** and managed by admins through campaigns (see "Credits model" below), not hard-coded.
- Purchased credits do not expire (unless product rules change later).
- A future **admin dashboard** will create and manage campaigns/events. It ships after the Phase B core and needs its own admin guard.

### Product decisions for Phase B (agreed)

| Topic | Decision |
|---|---|
| Guest (no login) | **1 free live check per day.** After that, show a prompt to sign in / register. Cache hits, search, and the recent table stay free and do not count. |
| Welcome campaign (seed) | **10 credits**, valid **7 days** from claim (`trigger = first_login`). Changeable later through the admin dashboard; existing lots keep their original expiry. |
| Balance UI | Two buckets: **Top-up credits** (purchased, no expiry) and **Promo credits** (all promo lots combined, show soonest expiry). Spend order is still soonest-expiring first, so promo is used before top-up. |

#### Guest quota rules

- Identify guests by a **salted hash of the client IP** (never store the raw IP for this purpose). Store counts per `(ipHash, day)` in a small `GuestUsage` table; reset at 00:00 UTC.
- Only a **live (cache-miss) check** consumes the guest quota.
- This is a soft limit: VPNs or shared IPs can bypass or collide. That is acceptable. The real gate is credits for signed-in users.
- When a guest is over quota, return `401` with code `guest_limit_reached` so the web app can show the sign-in prompt. Signed-in users with no credits get `402` with code `insufficient_credits`.
- Keep the existing per-IP throttler in place; it protects the API, while the daily quota is a product limit.
- Signed-in users do **not** also get the guest daily check; they use credits (welcome grant covers the first checks).

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
| Anonymous checks + IP rate limit | Done (plus daily guest quota below) |
| Guest daily quota (1 free live check/day) | **Done** (Phase B Langkah 4; `GuestQuotaService`, atomic upsert, UTC day) |
| Credit gate on `POST /checks` (spend, 402, refund on system failure) | **Done** (Phase B Langkah 4; live check tested with guest flow, signed-in flow pending) |
| `GET /credits/me` (two buckets) | **Done** (Phase B Langkah 5) |
| Web dashboard `/dashboard` (overview, balance, guest modal, insufficient-credit link) | **Built** (Phase B Langkah 6; browser test pending) |
| `CheckHistory` persist + recent unique mints | Done |
| Check cache TTL (default 5m) | Done |
| Screener check UI (toolbar + table + report panel) | Done |
| `User` + `AuthNonce` + `Session` | Done (wallet-first; email optional) |
| Wallet login API (SIWS-style message) | **Done** (Phase A) |
| Web Sign in (Phantom message sign) + session cookie | **Done** (Phase A) |
| `SessionAuthGuard` (for later protected routes) | **Done** (not gating checks yet) |
| `Campaign` + `CreditLot` + `CreditLedger` + `GuestUsage` tables + seed `welcome` | **Done** (Phase B Langkah 1) |
| `CreditsService`: claim campaign, atomic spend, 100% refund, balance | **Done** (Phase B Langkah 2) |
| Welcome claim on first successful wallet login | **Done** (Phase B Langkah 3; manual test pending) |
| Admin guard + campaign dashboard | **Not started** (Phase B2) |
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

**How to try:** install Phantom, open the site, click **Sign in**, approve the message. You land on `/dashboard`, and `/auth/me` succeeds with credentials. **Log out** clears the cookie.

### Phase B — Credits (campaigns, lots, ledger)

#### Credits model

Balance is **not** a single mutable number. Because promo credits expire, balance is the sum of non-expired **lots**, and every change is recorded in an append-only ledger.

| Table | Purpose |
|---|---|
| `Campaign` | Admin-managed promo definition (see fields below) |
| `CreditLot` | One row per grant or purchase: `userId`, `source` (`promo` / `purchase`), `campaignId?`, `amount`, `remaining`, `expiresAt?` (null = never) |
| `CreditLedger` | Append-only audit log: `userId`, `type`, `delta`, `lotId?`, `refId?` (check id / payment id), `reason`, `createdAt` |

Ledger `type` values (small on purpose): `promo_grant`, `purchase`, `spend`, `refund`, `admin_adjust`, `expire` (optional, written by a cleanup job for audit). Feature-specific cost lives in config (`credits.pricing.ts`, e.g. `live_check = 1`) and the feature name goes into `reason`, so variable-cost features later do not need new enum values.

`Campaign` fields:
- `key` (stable lookup key), `name`, `credits`, `isActive`
- claim window: `startsAt`, `endsAt`
- credit lifetime, **exactly one** of: relative (`expiresInDays` after claim) or fixed (`fixedExpiresAt` date) — enforced by a DB `CHECK` constraint
- `maxClaims` (total quota) + `claimCount`, optional promo `code`
- `trigger`: `first_login` (this is the welcome campaign), `code`, or `manual`

#### Rules

1. **Snapshot expiry at grant time.** When a user receives a campaign grant, compute `expiresAt` and store it on the `CreditLot`. Editing the campaign later must not change lots already granted. Reject claims whose computed `expiresAt` is already in the past.
2. **One claim per campaign per user:** unique constraint on `(userId, campaignId)` so repeated requests cannot double-claim.
3. **Welcome is a seeded campaign** (`trigger = first_login`), created by migration/seed. No admin UI is needed for Phase B.
4. **Spend order:** consume lots that expire soonest first; lots with no expiry (purchased) are consumed last. Variable-amount spends may span several lots in one all-or-nothing transaction.
5. **Spend only on live (cache-miss) checks** when a session user is present. Cache hit = no spend.
6. Spend and grant run in **one DB transaction with atomic row locking** (`UPDATE ... RETURNING` on `Campaign`, conditional `remaining >= take` on `CreditLot`) so double-submit or concurrent admin edits cannot double-spend, double-claim, or grant from a just-disabled campaign.
7. Never grant from a client-only claim; claim eligibility is decided on the server.
8. Set `CheckHistory.userId` when a session user is present.
9. **100% refund on system-side failure:** when our system/provider fails an operation after credits were taken, refund 100% of the `spend` rows for that `refId` (idempotent). Abuse/exploits are handled separately via `admin_adjust`.

#### Phase B steps

1. Prisma: `Campaign`, `CreditLot`, `CreditLedger` + migration; seed the welcome campaign. — **done**
2. Service: grant (campaign claim), spend (transaction + lot ordering), refund, balance query (non-expired lots). — **done** (`apps/api/src/modules/credits/`)
3. Hook `first_login` campaign into successful wallet verify (idempotent). — **done** (`claimWelcome` in `auth.controller.ts`)
4. Prisma: `GuestUsage` (`ipHash`, `day`, `count`, unique on `ipHash + day`) — **done**; env `GUEST_IP_SALT` and `GUEST_DAILY_FREE_CHECKS` — **done**; gate on `POST /checks` — **done** (guest path tested; signed-in path pending).
5. Gate `POST /checks` (cache hit is always free):
   - Guest: consume daily quota, else `401 guest_limit_reached`.
   - Signed in: spend 1 credit, else `402 insufficient_credits`.
6. `GET /credits/me` behind `SessionAuthGuard`: `{ topup: { balance }, promo: { balance, soonestExpiresAt } }`. — **done** (Langkah 5)
7. Web (Langkah 6) — **built, browser test pending**:
   - Guests and signed-in users use **separate pages** because their access differs. Guests use `/check` (public, marketing chrome, one free live check per day). Signed-in users use `/dashboard/check` (app shell, 1 credit per live check). Both share `TokenCheckForm`; the access rules live in `GuestCheck` and `MemberCheck`.
   - The marketing header (`(site)` group) shows only a Sign in button for guests. It shows no Dashboard link, wallet, or Log out.
   - **Redirects happen on the server** (`apps/web/src/middleware.ts`), before any HTML is sent. A visitor with the session cookie who opens `/` or `/check` goes to `/dashboard` or `/dashboard/check` (query string kept). A visitor without it who opens `/dashboard` goes to `/`. The middleware checks only that the cookie exists. The API stays the authority.
   - **Stale cookies:** `GET /auth/me` clears the cookie when the session is invalid. If the dashboard still finds no session, it sends the visitor to `/?signedout=1`, which the middleware ignores. That breaks the loop with a stale cookie.
   - `RedirectIfSignedIn` (client) covers only the case where the user signs in while already on a public page. Routes are defined once in `features/auth/routes.ts` and shared by both.
   - Session cookie: `httpOnly`, `sameSite=lax`, `secure` in production, `Domain` from `SESSION_COOKIE_DOMAIN` (empty locally, `.brakebit.com` in production). Set and clear use the same options (`session-cookie.ts`).
   - Other public pages stay visible to everyone.
   - Sign-in from the marketing header lands on `/dashboard`.
   - `/dashboard` has no sign-in page of its own. Without a session (logout, expiry, or a guest opening the URL) `DashboardShell` redirects to `/`.
   - `/dashboard` is the user app, with its own sidebar and header and no marketing chrome. The header has an account icon. Opening it shows the wallet and the two buckets (top-up with no expiry, promo with soonest expiry), fetched from `/credits/me` only while the menu is open. It also has Log out.
   - `/dashboard` (Overview) shows the same buckets in larger cards and explains how credits are used. Future features get their own `/dashboard/<feature>` route and a line in `nav.ts`.
   - On small screens the sidebar opens in a drawer from the header.
   - `guest_limit_reached` opens a modal with **Sign in with Phantom**. After sign-in the mint is saved in `sessionStorage` (10 minute limit, read once), and the user is redirected to `/dashboard/check`, with the mint prefilled. A confirmation dialog asks "Continue your check?" and shows the cost and balance. The check does **not** run until the user confirms, because it spends a credit.
   - `insufficient_credits` shows an error on `/dashboard/check` with a link to `/dashboard`. Real top-up arrives in Phase C.
   - Web API calls send cookies (`credentials: "include"`) through one helper, `shared/api/client.ts`.
   - `/admin` is reserved for Phase B2. It has no page yet.

### Phase B2 — Admin campaign dashboard (after Phase B core)

1. Admin role enforced **server-side** (e.g. wallet allowlist in env or `User.role`), with a guard separate from normal login.
2. Admin API + UI to create, edit, and deactivate campaigns (credits, claim window, expiry rule, quota, code).
3. Every admin action is audit-logged (who, when, what changed).
4. Admins cannot change a user's balance directly without a ledger entry (`admin_adjust`) and a stored reason.
5. Editing a campaign never rewrites lots already granted (see rule 1 above).

### Phase C — Crypto top-up

1. `Payment` / `CryptoPaymentIntent`: pack size, amount, destination or Solana Pay reference, expiry, status.
2. Asset: **USDC on Solana** first (SOL quotes optional later; short-lived quote if used).
3. Watcher or webhook: required confirmations → idempotent ledger credit keyed by unique `txid`.
4. Never grant credits from a client-only “I paid” claim.
5. Pack SKUs example: 10 / 50 / 100 checks.

### Phase D — Hardening

- **Deployment (planned):** web on Vercel at `https://brakebit.com`, API on Render at `https://api.brakebit.com`. Required settings: `CORS_ORIGIN=https://brakebit.com`, `AUTH_DOMAIN=brakebit.com`, `SESSION_COOKIE_DOMAIN=.brakebit.com`, `TRUST_PROXY_HOPS=1` on the API, and `NEXT_PUBLIC_API_URL=https://api.brakebit.com` on the web. Vercel preview URLs are a different site, so they cannot use the cookie against the production API. Test previews separately. Verify that guest quota counts different IPs before launch.
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
- A separate `welcome_grant` ledger type (welcome is a campaign)
- Hard-coded promo expiry durations in code (durations live on campaigns)
- Subscription billing as the default (see ROADMAP P2)
- Multi-chain payments before Solana USDC top-up works
- KYC flows in MVP (business compliance may still apply to the operator; do not invent end-user KYC UI unless required later)

---

## Handoff checklist for the next agent / machine

1. Read [`AUTH.md`](./AUTH.md) (this file), [`ROADMAP.md`](./ROADMAP.md), [`STRUCTURE.md`](./STRUCTURE.md), [`DESIGN.md`](./DESIGN.md) for any UI.
2. Phase A is done. Phase B Langkah 1–6 are done in code (Langkah 6 web is built but not yet tested in the browser). Next is **Phase B2 / admin guard** or manual web tests, as the user decides. Pending manual tests: Phantom sign-in (Phase A), welcome claim (Phase B Langkah 3), signed-in check path, and the Langkah 6 browser flow. Track them in [`continue-prompt.md`](./continue-prompt.md). Product decisions (guest quota, welcome 10 credits / 7 days, two-bucket balance UI, balance lives on `/dashboard` not in the header) are agreed; see "Product decisions for Phase B".
3. Do not invent trading, custody, or multi-chain payment stubs.
4. After shipping a phase: update the status table above and the matching ROADMAP rows.
5. Security: follow the Phase A checklist; do not weaken nonce/session rules for convenience.

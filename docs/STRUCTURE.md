# Brakebit folder structure

Source of truth for layout after clone. Git does not track empty directories — reserved folders below keep a `.gitkeep` so the path survives on every machine.

Agents continuing this repo on another machine: start with [`continue-prompt.md`](./continue-prompt.md) for current status, then read this file for folder intent, then [`ROADMAP.md`](./ROADMAP.md) for what to build next, [`AUTH.md`](./AUTH.md) for wallet/credits/payments plan, then `DESIGN.md` for UI direction.

## Top level

```text
brakebit/
├── apps/
│   ├── web/                 Next.js 15 App Router UI (Geist)
│   └── api/                 NestJS API (auth, checks + recent, tokens search, credits, health)
├── packages/
│   ├── shared/              Shared types + chain metadata
│   └── db/                  Prisma schema + client (Neon/Postgres)
├── docs/                    Product docs (this folder)
│   ├── README.md            Docs index
│   ├── STRUCTURE.md         This file
│   ├── ROADMAP.md           Product scope + build priorities
│   ├── DESIGN.md            Visual / product design direction
│   ├── continue-prompt.md   Copy-paste prompt + current status for a new chat / machine
│   └── AUTH.md              Wallet login / credits / crypto top-up plan
├── .cursor/rules/           Cursor project rules (collaboration.mdc)
├── AGENTS.md / CLAUDE.md    Agent skill pointers (antislop)
├── README.md                Setup and run
├── .env.example             Env template (copy to .env locally)
├── package.json             pnpm workspace root + turbo scripts
├── pnpm-workspace.yaml
└── turbo.json
```

Not committed (see `.gitignore`): `node_modules/`, `.env`, `.next/`, `dist/`, `.turbo/`, `.pnpm-store/`.

## `apps/web`

```text
apps/web/
├── public/                  Static assets (add files here when needed)
└── src/
    ├── middleware.ts        Server redirects by session cookie (before render)
    ├── app/                 Routes + root document
    │   ├── layout.tsx       html, fonts, theme boot script, SessionProvider
    │   ├── not-found.tsx    404
    │   ├── (site)/          Public marketing chrome (route group, no URL segment)
    │   │   ├── layout.tsx   SiteHeader, footer
    │   │   ├── page.tsx     Landing
    │   │   └── check/page.tsx  Guest check workspace (GuestCheck)
    │   ├── dashboard/       User app shell (`/dashboard`): own sidebar + header
    │   │   ├── page.tsx     Overview
    │   │   └── check/page.tsx  Member check workspace (MemberCheck)
    │   ├── admin/           Reserved for Phase B2 (no page yet)
    │   └── globals.css      Tokens, light/dark, components
    ├── features/
    │   ├── auth/            Wallet sign-in (Phantom → /auth/*)
    │   │   ├── components/  SignInButton, RedirectIfSignedIn (client, sign-in on a public page)
    │   │   ├── routes.ts    Cookie name, public → app route map, signed-out URL (shared with middleware)
    │   │   ├── lib/         Phantom helper, short address
    │   │   ├── session.tsx  SessionProvider + useSession (one /auth/me per page load)
    │   │   ├── sign-in.ts   Phantom connect → nonce → sign → verify
    │   │   └── api.ts       Client → Nest `/auth/*` (credentials)
    │   ├── credits/         Client → Nest `/credits/me` (balance buckets)
    │   │   ├── api.ts
    │   │   ├── format.ts    Expiry date format
    │   │   └── use-credit-balance.ts  Hook: load balance while enabled (account menu, overview)
    │   ├── dashboard/       User app shell: sidebar, header, account menu, mobile drawer
    │   │   ├── components/  DashboardShell (chrome first, content skeleton while session loads),
    │   │   │                DashboardSidebar, DashboardHeader, AccountMenu, MobileNavDrawer,
    │   │   │                DashboardSkeleton, OverviewView (balance blocks, action, credit rules),
    │   │   │                icons.tsx (in-house icon set)
    │   │   ├── sidebar-cookie.ts  `brakebit_sidebar` cookie: collapsed or expanded
    │   │   └── nav.ts       Sidebar items (label, href, icon name) and page titles (add a feature here)
│   ├── landing/         Landing client components (see DESIGN.md, Layout and Motion)
│   │   └── components/  LandingHero (mint field + strip of six squares that light when a mint is ready),
│   │                    SignalBoard (six tiles + one filled detail panel).
│   │                    Sheet and tile styles (`.sheet`, `.cell`, `.focal`, `.spec-*`, `.sb-*`) live in globals.css
    │   └── token-check/     Token review feature slice
    │       ├── components/  GuestCheck (public sheet), GuestLimitDialog,
    │       │                MemberCheck (plain work page in the dashboard), CreditLine (three balance blocks), ResumeCheckDialog,
    │       │                CheckResults (list + report split, shared), CheckFields (search, mint, messages, example),
    │       │                ReportPanel, RecentChecks, RiskReportView, ReportSkeleton
    │       ├── hooks/       use-token-check (state and actions shared by both pages)
    │       ├── lib/         Address helpers, explorers, formatters, pending-check (guest → member handoff)
    │       └── api.ts       Client → Nest `/checks`, `/checks/recent`, `/tokens/search`
    └── shared/
        ├── api/             `apiRequest` + `ApiError` (cookies, error code)
        ├── config/          Public env (API base URL)
        ├── content/         Product copy (landing + check)
        ├── lib/             Small utilities (e.g. cn)
        ├── theme/           Theme storage key + FOUC script
        └── ui/              SiteHeader, BrandMark (four squares; header, footer, sidebar), ThemeToggle, FieldReportPreview, Dialog, SignalStrip (six status squares),
                             SpecStrip (six square tiles; landing and public check),
                             SheetTitle (first row of a public sheet: meta line, title with square stop, note)
```

## `apps/api`

```text
apps/api/src/
├── common/
│   ├── dto/                 Shared Nest DTOs if needed
│   └── guards/              ChecksThrottlerGuard (friendly 429)
├── config/                  Env load + API config
├── infrastructure/prisma/   Prisma wiring
└── modules/
    ├── auth/                Wallet SIWS login, sessions, SessionAuthGuard
    ├── credits/             Campaign claims, credit lots, atomic spend/refund, balance
    ├── checks/              Token check module
    │   ├── domain/          Pure scoring / report builders
    │   ├── dto/             CreateCheckDto, etc.
    │   └── providers/       Solana (mint/holders/age/metadata) + helpers
    ├── tokens/              Token name/symbol search (Jupiter proxy)
    └── health/              Health endpoint
```

## `packages`

```text
packages/shared/src/
├── checks/                  RiskReport types, scoring shapes
└── (chain meta, exports)

packages/db/
├── prisma/                  schema.prisma
└── src/                     Generated / exported client helpers
```

## Reserved / currently empty paths

| Path | Intent | Survival |
|---|---|---|
| `apps/web/public/` | Favicon, OG images, static files | keep at least one asset or `.gitkeep` when empty |

When you add a new intentional empty folder, put a `.gitkeep` in it and add a row here.

## Product boundaries (do not invent folders for these yet)

- No trading, signals, or custody modules.
- Chain data comes from RPC/indexers via API providers — do not mirror wholesale into Postgres.
- Neon/Prisma holds product data (`CheckHistory`, users, sessions, credit tables), not full chain state.
- `CheckHistory` is also the short-TTL check cache source: same mint within `CHECK_CACHE_TTL_MS` skips RPC and does not insert again.

## After clone checklist

1. `pnpm install`
2. `cp .env.example .env` and fill secrets locally
3. Build shared + generate db as in root [`README.md`](../README.md)
4. `pnpm dev` → web `:3000`, api `:3001`

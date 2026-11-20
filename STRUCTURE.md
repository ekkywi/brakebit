# Brakebit folder structure

Source of truth for layout after clone. Git does not track empty directories — reserved folders below keep a `.gitkeep` so the path survives on every machine.

Agents continuing this repo on another machine: read this file first for folder intent, then [`ROADMAP.md`](./ROADMAP.md) for what to build next, then `DESIGN.md` for UI direction.

## Top level

```text
brakebit/
├── apps/
│   ├── web/                 Next.js 15 App Router UI (Geist)
│   └── api/                 NestJS API (checks, tokens search, health)
├── packages/
│   ├── shared/              Shared types + chain metadata
│   └── db/                  Prisma schema + client (Neon/Postgres)
├── DESIGN.md                Visual / product design direction
├── ROADMAP.md               Product scope + build priorities
├── STRUCTURE.md             This file
├── AGENTS.md / CLAUDE.md    Agent skill pointers (antislop)
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
    ├── app/                 Routes + global chrome
    │   ├── layout.tsx       Header, footer, theme boot script
    │   ├── page.tsx         Landing
    │   ├── check/page.tsx   Assessment workspace
    │   └── globals.css      Tokens, light/dark, components
    ├── features/
    │   └── token-check/     Token review feature slice
    │       ├── components/  TokenCheckForm, RiskReportView, ReportSkeleton
    │       ├── hooks/       Reserved for feature hooks (.gitkeep)
    │       ├── lib/         Address helpers, explorers, formatters
    │       └── api.ts       Client → Nest `/checks` + `/tokens/search`
    └── shared/
        ├── config/          Public env (API base URL)
        ├── content/         Product copy (landing + check)
        ├── lib/             Small utilities (e.g. cn)
        ├── theme/           Theme storage key + FOUC script
        └── ui/              Shared UI (ThemeToggle, FieldReportPreview)
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
| `apps/web/src/features/token-check/hooks/` | React hooks for the token-check feature (not yet filled) | `.gitkeep` |
| `apps/web/public/` | Favicon, OG images, static files | keep at least one asset or `.gitkeep` when empty |

When you add a new intentional empty folder, put a `.gitkeep` in it and add a row here.

## Product boundaries (do not invent folders for these yet)

- No trading, signals, or custody modules.
- Chain data comes from RPC/indexers via API providers — do not mirror wholesale into Postgres.
- Neon/Prisma holds product data (users/history later), not full chain state.

## After clone checklist

1. `pnpm install`
2. `cp .env.example .env` and fill secrets locally
3. Build shared + generate db as in `README.md`
4. `pnpm dev` → web `:3000`, api `:3001`

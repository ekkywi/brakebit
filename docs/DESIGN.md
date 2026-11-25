# Brakebit Design Direction

Dial: ENERGY 3 / RHYTHM 2 / MOTION 4 (hero only). Every other section stays at MOTION 2.

## Product

Brakebit is a crypto safety tool. Users search or paste a Solana mint and get a risk report with human-readable reasons before they buy. The report shows token name/symbol when metadata exists. It is not a trading desk, signal bot, or wallet.

## Audience

Global retail crypto users who want a calm, trustworthy second look before buying. English-first UI.

## Personality

Developer-grade product site, in the spirit of Vercel and Render. Quiet and precise below the fold. The hero is the one place that moves: a field of squares that blink at random, like a scan reading many values at once. One signature accent (signal cyan) marks the platform.

## Visual language

Light (or dark) page, near-black/near-white type, thin borders. The hero sits on a sparse square grid. A smaller grid on the right holds six numbered cells, one per signal a report covers (the six rows every report carries, in API order). The risk report preview moves to its own section below the hero and stays the proof of the product. One cyan accent for marks, section labels, and lit squares. Risk colors stay reserved for report severity.

Light/dark is user-controlled via a sun/moon switcher. Preference persists in `localStorage` and respects system preference on first visit.

### Typography

| Role | Face |
|---|---|
| UI / display / body | Geist Sans |
| Addresses / figures | Geist Mono |

Display: tight tracking (`-0.04em`), weight 600. Body: 15–16px, muted gray.

## Palette

| Token | Light | Dark | Role |
|---|---|---|---|
| Background | `#FFFFFF` | `#0A0A0A` | Page |
| Subtle | `#F7F8FA` | `#111111` | Alternate band |
| Foreground | `#0A0A0A` | `#EDEDED` | Text, primary button |
| Muted | `#666666` | `#A1A1A1` | Supporting text |
| Border | `#E6E8EC` | `#333333` | Edges |
| Accent (signal cyan) | `#0B7285` | `#3DD6F5` | Marks, section labels, lit squares |
| Ok / Warn / Bad | existing | existing | Report severity only |

Contrast (antislop checker): `#0B7285` on `#FFFFFF` 5.59:1, on `#F7F8FA` 5.26:1; `#3DD6F5` on `#0A0A0A` 11.44:1, on `#111111` 10.91:1.

Why cyan: it sits away from the risk colors (green ok, amber warn, red bad), so a brand mark is never read as a verdict. Teal and green families are avoided for that reason. Orange is avoided to keep the platform distinct from the reference that inspired the hero.

## Layout

1. Landing: grid hero (headline + CTAs on the left, signal grid on the right), report section (report on the left, signal-to-row legend on the right, mirrored from the hero), features (one flagship block, three supporting items as a plain list), how + signals (two columns), CTA band. Section bands alternate flat `--bg` and flat `--subtle`.
2. Check (screener-lite): quiet top wash; compact toolbar (search + mint + generate); recently-reviewed table (unique mint, latest score); report as sticky side panel on desktop / stacked on mobile. No price/volume columns.
3. Radius `12px` cards, `999px` buttons, `3px` grid squares. Content max width `80rem`
4. Sticky header solid `var(--bg)` + bottom border (no glass)

## Motion

Hero (MOTION 4), purpose written down:

- Blinking squares: show that a check reads many values, not one. Random order, no pattern to follow, so it never asks for attention in one place.
- Hover on the signal grid: fast to light, slow to fade, with a short trail across neighbours. It confirms the pointer position and invites the six numbered cells.
- Numbered cells are the only interactive squares. Hover, focus, or tap shows what each signal reads in the caption under the grid.

Limits:

- Background grid runs on one `<canvas>`, about 30fps, device pixel ratio capped at 2. It pauses when the tab is hidden or the hero is off screen.
- Foreground grid uses CSS animation on `opacity` only. Delays are seeded, so server and client render the same.
- `prefers-reduced-motion`: both grids are static. No blinking, no hover transitions.
- Everything below the hero keeps MOTION 2: rise on load, score bar fill, chip hover shift.

Check workspace (`/check`, `/dashboard/check`), one exception, purpose written down:

- Loading: the six numbered squares in the report skeleton light in order while a check runs (`sq-scan`). It marks a real wait and ends when the report arrives. Static under `prefers-reduced-motion`.
- Report: a strip of six squares ("Signals at a glance") under the score face. Each square is filled by the real signal status. Color is never the only cue: outlined = clear, thick border = watch, solid = elevated, dashed = unknown. Rows below carry the same numbers and the status text. Static, no motion.
- No blinking grid, no canvas on the check pages. People read data there.

## Credibility rules (report)

Decided with the owner on 25 Nov 2026. These override any copy that says otherwise.

- Six rows are always shown. A signal with no value is **Unknown**, never clear and never counted as safe.
- Today only four signals can ever be read: mint authority, freeze authority, top holder %, and token age. LP lock/burn and liquidity (USD) have no data source yet, so they always show Unknown. Copy must not say "six live signals".
- Report header shows "N of 6 signals read" next to the score.
- If fewer than `MIN_READ_SIGNALS` (4) signals are read, the level label becomes "Limited data", the score is shown in neutral text (not green, amber, or red), and the report says that Unknown is not counted as safe. The API summary for a low score stays as it is.
- Landing and preview copy describe what a report does, not what a finished score means. Sample figures in the preview must be values the product can produce.

## App shell (`/dashboard` and children)

A work area, so it stays calm: no grid, no canvas, no blinking. Same tokens, same cyan accent, same square motif.

- Every nav item has an icon plus a label. Icons are drawn in-house (`features/dashboard/components/icons.tsx`) on a 24px grid, one 1.75px stroke, square geometry with 3px corners, shown at 20px. No icon library, so they do not look like every other app. Add a name to `NavIconName` and a drawing when a page is added.
- The current page is marked three ways: a framed box, an accent icon, and heavier text. Color is never the only cue, and the marker survives the icon rail.
- Desktop sidebar collapses to a 4.5rem icon rail with a real toggle (`aria-expanded`). Labels stay in the DOM as `sr-only` text and as `title`, so every icon has a name. The choice lives in the `brakebit_sidebar` cookie (`collapsed` or `expanded`, nothing private), read in `dashboard/layout.tsx`, so the first paint has the right width. The mobile drawer never collapses.
- Brand mark: four squares, one cyan, next to the wordmark. It echoes the landing grid.
- Pages that do not exist yet (for example top-up) are not listed. No dead or "soon" items.
- Sidebar and header render at once. While the session loads, only the content area shows a skeleton and the account button shows a same-size placeholder, so nothing shifts.
- Touch targets are 44px, including the theme toggle in the header.
- Mobile drawer is a modal dialog: Escape closes it, Tab stays inside, focus returns to the menu button.
- Overview has one job: show what can be spent, then start a check. The credit block leads (total, then Top-up and Promo with the real expiry, then the action). "What one credit buys" lists the six signals. Rules are a plain list. Every number comes from the API; no invented stats, charts, or history.
- Page headers match the public check page: sentence-case accent label, then the title.

## Atmosphere rules

- The square grid and the signal grid live in the hero only. Sections below stay flat and static.
- The square is the one motif below the hero: a numbered square (`sq-index`, 3px radius, cyan border and tint) with no motion. Accent squares 01 to 06 always mean the six signals (hero grid, report rows, signals list, check empty state). Source of truth: `SIGNALS` in `shared/content/product.ts`; the number is the position in that list and maps to the API key. Workflow steps use the neutral variant (`sq-index--plain`) so the two numbering systems never read as the same thing.
- Section labels are sentence case, accent color, no uppercase and no wide tracking.
- The grid is not live data. The hero says so next to the grid.
- Grid colors come from CSS variables so light and dark both work.
- Accent used sparingly: lit squares, step numbers, section labels, secondary hover
- No glow, no gradient washes, no blurred orbs

## Do not

- Purple / indigo brand washes, neon glow, glassmorphism
- Gradients on the accent (flat cyan only)
- Soft mint Contiant-style cards or cream+serif terracotta looks
- Decorative SVG scenes or mascot illustrations in the hero
- Fake logos, stats, testimonials, or "live telemetry" wording on illustrative grids
- Accent color on every button and border at once
- Endless motion outside the hero
- Accent stripes on card edges, gradient section bands, or identical card grids where the content has a clear hierarchy

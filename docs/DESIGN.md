# Brakebit Design Direction

Dial: ENERGY 4 / RHYTHM 4 / MOTION 2. The only motion on the landing is the hero strip lighting up when a mint is ready, plus hover and selection states.

Design Read (25 Nov 2026, owner choice, round 3, no external reference): the squares stay, and the page is redesigned as a spec sheet. One centered sheet (`.sheet`, max `100rem`) with visible hairline rules as the grid; every section is a row of that grid. Character comes from scale, not decoration: oversized type, giant mono numerals, and exactly one filled cyan tile per section as the focal point. Real squares (the hero strip is 1:1 tiles), no rounded cards, no random blinking field. Antislop audit 001 is in `anti-slop/audit-001-2026-11-25.md`.

## Product

Brakebit is a crypto safety tool. Users search or paste a Solana mint and get a risk report with human-readable reasons before they buy. The report shows token name/symbol when metadata exists. It is not a trading desk, signal bot, or wallet.

## Audience

Global retail crypto users who want a calm, trustworthy second look before buying. English-first UI.

## Personality

A precise instrument, written like a spec sheet: plain statements, numbered parts, hairline rules. No external site is the reference (owner decision, 25 Nov 2026). One signature accent (signal cyan) marks the platform.

## Visual language

Light (or dark) page, near-black/near-white type, 1px hairlines instead of cards. The hero ends in a strip of six numbered square tiles, one per signal a report covers (the six rows every report carries, in API order). The risk report preview sits in its own band below the hero (it follows the theme) and stays the proof of the product. One cyan accent for numerals, lit squares, and the focal tile of each section. Risk colors stay reserved for report severity.

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
| Accent (signal cyan) | `#0B7285` | `#3DD6F5` | Numerals, lit squares, focal tile |
| Ok / Warn / Bad | existing | existing | Report severity only |

Contrast (antislop checker): `#0B7285` on `#FFFFFF` 5.59:1, on `#F7F8FA` 5.26:1; `#3DD6F5` on `#0A0A0A` 11.44:1, on `#111111` 10.91:1.

Why cyan: it sits away from the risk colors (green ok, amber warn, red bad), so a brand mark is never read as a verdict. Teal and green families are avoided for that reason. Orange is avoided so the accent is not read as a warning.

## Layout

1. Landing, in order. Every section sits inside `.sheet` and is split into rows by 1px rules. `.cell` gives the same inline padding as the header. Each section has one focal tile or one oversized element, and a different heading scale.
   - Hero: mono meta line, then the headline at up to `8rem` over two lines. The full stop is a cyan square (`.stop`), the brand motif used as punctuation; the heading has an `aria-label` with a normal period. Below a rule: the intro on the left, the mint field on the right (label, input, "Review this mint", "Try the BONK example"). Below another rule: a strip of six square tiles (1:1 from 1024px, 3 by 2 on tablets, 2 by 3 on phones), one per signal, with the number in large mono. The field only opens `/check` with `chain` and `address` filled in. The check, and any guest quota, runs only when the visitor starts it there.
   - Report: follows the theme on a `--subtle` band (never forced dark; owner asked for this on 25 Nov 2026). The sample report is on the left. On the right: a mono label, the heading, and a reading guide with three buttons (score and level, signals at a glance, findings and sources). Hover or focus previews a part, a click or tap pins it; the matching part of the report gets a cyan inset outline and the rest dims to 35%. Parts are marked with `data-part` in `FieldReportPreview`. The only dark element here is the score face (`.instrument-face`), which is also dark in the real report.
   - Product: no label. An oversized statement, then three cells on one row: a filled cyan tile with `6/6` in giant mono (counted from `readToday` in `SIGNALS`, so it cannot drift from the data; the copy beside it says "have a data source", not "read"), "What a check reads" (filled square marker), and "What Brakebit never does" (outlined square marker). Lists live in `READS` and `NEVER` in `shared/content/product.ts`.
   - Signals: heading and note on one row, then a board of six tiles on shared hairlines beside one filled panel with a giant number for the selected signal. Tiles are buttons with `aria-pressed`; the panel is `aria-live`. Dashed tiles mark signals with `readToday: false` (none since 26 Nov 2026), matching the dashed Unknown square in the report.
   - CTA: one row of the sheet, like the sections above: hairline on top, heading at the same scale as Report and Signals, muted paragraph on the left, the two buttons in a cell with a hairline on the left (stacked on the right on desktop). No full-width accent block: the closing section is not a focal tile.
   - Footer: same sheet, two cells separated by a rule.
   The Workflow section was removed because its three numbered steps were the template pattern.
2. Check. One language, two jobs (27 Nov 2026, owner request). The public page sells and explains, so it is the landing's spec sheet. The member page is a work area, so it drops everything that explains the product: no title block, no explainer tiles, no giant numerals. They share the logic (`useTokenCheck`), the results block (`CheckResults`), the report, and the hairline rows. This reverses the "one design, two frames" decision of 26 Nov 2026 for the dashboard (see `anti-slop/audit-004-2026-11-27.md`). No wash or gradient on either. No price/volume columns.
   - Public `/check` (`GuestCheck`): one `.sheet`, rows split by hairlines. Row 1: mono meta line, "Review a mint" with the square full stop (`aria-label` has a normal period), a short note on the right. Row 2 is the form: visible labels for search and mint, "Review this mint", "Try the BONK example", and an allowance cell with a giant cyan numeral `1` ("free live check per day, no account needed. Cached results are always free."). The numeral is accent text, not a filled tile, so it never touches the lit tiles below. Row 3: the same six-tile strip as the hero (`SpecStrip`); it lights the readable signals once a mint of plausible length is in the field, and it is hidden while a report is open. Then the recently-reviewed table as hairline rows (`RecentChecks`, edge to edge, first and last column padded like `.cell`). With a report open, the list stays on the left and the report is a sticky panel on the right (one rule between them, from the lg breakpoint).
   - Member `/dashboard/check` (`MemberCheck`), on `.sheet--flush`, in this order: the balance blocks (`CreditLine`: three square blocks "Credits 12", "Promo 10 until 3 Dec", "Top-up 2", no accent color), the form (visible labels, "Run check", "Try the BONK example", and "A live check uses 1 credit unless the result is already cached."; the button does not say "1 credit" because a cached result is free), then `CheckResults`. The page has a visually hidden `<h1>` because the header names the page in a `<p>`. At zero credits the row says "Live checks are paused. Cached results stay free." The numbers come from `/credits/me` and are read again after every check settles, so a spent or refunded credit shows at once. Loading and error are their own states and never show 0. In the dashboard the list and report split from the xl breakpoint, because the sidebar already takes 15rem. Failure for lack of credits links to Overview.
   - The table columns reflow by the width of their own column (container query on `.screener-table-scroll`), so the report panel and the sidebar do not squeeze five columns into a narrow list. The six-tile strip (`SpecStrip`) is for the landing and the public check only.
3. Every corner on the site is square, `0px` (27 Nov 2026, owner request: some buttons and the header were still round). That covers buttons, fields, the theme toggle, cards, menus, dialogs, avatars, status dots, skeleton bars, token images, and the `sq-index` square. `--radius` is `0`; do not add `rounded-*` or a `border-radius` value anywhere. A round shape would break the one motif the brand has. Public content max width is `100rem` (1280px at the scaled root). Dashboard content fills the column beside the sidebar.
   - Scale (27 Nov 2026, owner request: "make the UI 20% smaller"): from 768px width up, the root font size is 80%, so every `rem` value is 20% smaller (16px becomes 12.8px). Phones stay at 100%. Because only `rem` follows the root, fixed sizes in CSS and Tailwind must be written in `rem`, not `px` (a `px` value does not scale and would stand out). Media queries do not scale, since they use the initial font size. Container queries are in `px` for the same reason. Owner decision: controls shrink with it, so a "44px" control is `2.75rem`, about 35px at desktop and 44px on phones. This is below the 44px rule of antislop R-03 on desktop by choice. It stays above the 24px WCAG 2.2 minimum. The smallest text (`text-xs`) is about 9.6px at desktop; do not go below `0.75rem`.
   - Balance is shown as data blocks (`CreditLine` on the check page, `Balance` on Overview): three square blocks, each a label and a number, separated by 1px gaps over the `--border` color so the hairlines are shared. No score blocks and no status squares in the dashboard.
4. Sticky header solid `var(--bg)` + bottom border (no glass)

## Motion

Hero (MOTION 2), purpose written down:

- Mint ready: once the hero field holds a mint of plausible length, the tiles for the signals with a data source light up in order (01 to 06), each 0.11s after the last, and stay lit. It shows which signals the check will read for that mint. Lit tiles change their status text from "Has a source" to "Will read". Nothing is fetched, and the line under the strip says how many signals have a source and that any one can still show Unknown. The delay applies only when lighting; clearing the field resets at once.
- The previous random blinking field and the pointer trail were removed (round 3). They showed no information and made every page look alike.

Limits:

- Transitions on `background-color` and `color` only. No canvas, no endless animation anywhere on the landing.
- `prefers-reduced-motion`: the lit tiles appear at once, with no sequence.
- Everything else keeps MOTION 2: rise on load for the hero headline, hover and selection on board tiles, the reading guide dimming (opacity 0.2s), score bar fill.

Public check strip (`/check`): same rule as the hero. The readable tiles light in order when the mint field holds a mint of plausible length, with the same `prefers-reduced-motion` fallback. Nothing is fetched. The strip is removed while a report is open.

Check workspace (`/check`, `/dashboard/check`), one exception, purpose written down:

- Loading: the six numbered squares in the report skeleton light in order while a check runs (`sq-scan`). It marks a real wait and ends when the report arrives. Static under `prefers-reduced-motion`.
- Report: a strip of six squares ("Signals at a glance") under the score face. Each square is filled by the real signal status. Color is never the only cue: outlined = clear, thick border = watch, solid = elevated, dashed = unknown. Rows below carry the same numbers and the status text. Static, no motion.
- No blinking grid, no canvas on the check pages. People read data there.

## Credibility rules (report)

Decided with the owner on 25 Nov 2026. These override any copy that says otherwise.

- Six rows are always shown. A signal with no value is **Unknown**, never clear and never counted as safe. Each Unknown row names its reason in one line of fixed copy (for example "No pool with an LP token was found on Rugcheck."). Raw error text from a provider is never shown as the reason.
- All six signals have a data source (26 Nov 2026): mint authority, freeze authority, top holder %, token age, LP lock/burn (Rugcheck, USD-weighted), liquidity (DexScreener, summed). Any one can still be Unknown for a given mint, when its source has no data. Copy must not say "six live signals" or "six read every time". Say "six signals have a data source".
- LP lock/burn rule (decided 26 Nov 2026): only pools that issue an LP token count. Pools without one (Orca Whirlpool, Meteora DLMM) are left out, because their `lpLockedPct` is 0 by default and does not mean unlocked. The locked share is weighted by pool USD value. At 95% or more the signal is "locked/burned"; below, "unlocked/unknown" (bad). No LP-token pool, or no USD value, is Unknown. Checked on BONK: pools with `lpLockedPct` 100 have a zero LP supply on-chain (burned); pools with 0 are held by ordinary wallets. Mid-range values (above 0 and below 100) are not verified: `lpLockedUSD` can exceed the pool's `quoteUSD` (BONK pool `HoemTY…`: 11,827 locked vs 10,197 pool value), so the share is not on the same basis as the pool value. Any pool with a mid-range value makes the signal Unknown until it is verified against lockers (decided 26 Nov 2026, option "unknown until verified").
- Liquidity rule (decided 26 Nov 2026): sum of DexScreener pair liquidity on Solana. No pool is Unknown, never 0.
- Report header shows "N of 6 signals read" next to the score.
- If fewer than `MIN_READ_SIGNALS` (3) signals are read, the level label becomes "Limited data", the score is shown in neutral text (not green, amber, or red), and the report says that Unknown is not counted as safe. The API summary for a low score stays as it is.
- Landing and preview copy describe what a report does, not what a finished score means. Sample figures in the preview must be values the product can produce.

## App shell (`/dashboard` and children)

A work area, so it stays calm: no grid, no canvas, no blinking. Same tokens, same cyan accent, same square motif.

- Every nav item has an icon plus a label. Icons are drawn in-house (`features/dashboard/components/icons.tsx`) on a 24px grid, one 1.75px stroke, square geometry with square (mitered) corners where the drawing allows, shown at 20px. No icon library, so they do not look like every other app. Add a name to `NavIconName` and a drawing when a page is added.
- The current page is marked three ways: a framed box, an accent icon, and heavier text. Color is never the only cue, and the marker survives the icon rail.
- Desktop sidebar collapses to a 4.5rem icon rail. The toggle is the hamburger at the left of the header (`aria-expanded`), not a button inside the sidebar. On small screens the same hamburger opens the drawer. Do not style it with `.btn`: that class sets `display` outside any Tailwind layer, so `md:hidden` would lose. The sidebar brand row is `h-14` like the header, so the two bottom borders form one line. Labels stay in the DOM as `sr-only` text and as `title`, so every icon has a name. The choice lives in the `brakebit_sidebar` cookie (`collapsed` or `expanded`, nothing private), read in `dashboard/layout.tsx`, so the first paint has the right width. The mobile drawer never collapses.
- Brand mark: four squares, one cyan, next to the wordmark. It echoes the landing grid. One component (`shared/ui/BrandMark.tsx`, square corners) is used in the dashboard sidebar, the public header, and the public footer; the favicon is the same drawing in `app/icon.svg` with fixed colors (`#3dd6f5` and gray), because a favicon cannot read CSS variables. Keep the two in step.
- Pages that do not exist yet (for example top-up) are not listed. No dead or "soon" items.
- Sidebar and header render at once. While the session loads, only the content area shows a skeleton and the account button shows a same-size placeholder, so nothing shifts.
- Touch targets are `2.75rem`: 44px on phones, about 35px from 768px up because of the 80% root (owner decision, see Check rule 3). The theme toggle in the header follows the same rule.
- Mobile drawer is a modal dialog: Escape closes it, Tab stays inside, focus returns to the menu button.
- Dashboard pages are plain work pages (27 Nov 2026, owner request: "it looked like a promo page"). `main` has no max width or padding of its own, and each page is one `.sheet--flush`: hairline rows that fill the column beside the sidebar, with no side rules, because the sidebar border is the left edge and the window is the right edge. Inside it the type is a work scale: body copy and the controls keep their normal `rem` sizes, and the largest number is 1.5rem. There is no title block, no explainer tiles, no giant numerals, no accent-colored figures, and nothing rises or lights on load. A page needs only the information and functions the job uses. The calm rules above still hold.
- Overview has one job: show what can be spent, then start a check. It holds the wallet address (small mono line), the balance (three square data blocks: Available, Top-up, Promo with the real expiry), the "Run a token check" button, and "How credits work" as three short rows. It does not explain what a report covers: that belongs to the public pages and to the report itself. Every number comes from the API; no invented stats, charts, or history.
- The skeleton has the page's shape (a label and one block between hairlines), so nothing shifts when the session arrives.
- Each page has one `<h1>`, visually hidden (`sr-only`), because the header shows the page name in a `<p>`.

## Atmosphere rules

- Squares are the one motif, at two scales: the large tiles (hero strip, board, `6/6` tile, panel) and the small numbered `sq-index` square (square corners, cyan border and tint) used in reports and lists. Tiles never blink. They change only on hover, selection, and the hero's mint-ready state.
- One filled cyan block per section is the focal point (Product tile, Signals panel), never two touching. Report and CTA have none; Report's focal point is the dark score face. Do not use a full-width accent band for a section (owner feedback, 25 Nov 2026). Text on it uses `--bg` with no opacity, so contrast stays at the accent/bg ratio (5.59:1 light, 11.44:1 dark).
- No section is forced dark. Only the report score face (`.instrument-face`) is dark in both themes.
- Accent squares 01 to 06 always mean the six signals (hero strip, public check strip, report rows, signals board; not the dashboard). Source of truth: `SIGNALS` in `shared/content/product.ts`; the number is the position in that list and maps to the API key. Neutral squares (`sq-index--plain`) are for any other numbering, so the two never read as the same thing.
- Section labels are sentence case, accent color, no uppercase and no wide tracking.
- The strip is not live data. The line under it says what is read today and what shows Unknown.
- Sheet, tile, and band colors come from CSS variables so light and dark both work.
- Accent used sparingly: numerals, lit squares, the focal tile, secondary hover
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

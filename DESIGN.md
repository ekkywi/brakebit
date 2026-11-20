# Brakebit Design Direction

Dial: ENERGY 2 / RHYTHM 2 / MOTION 2

## Product

Brakebit is a crypto safety tool. Users search or paste a Solana mint and get a risk report with human-readable reasons before they buy. The report shows token name/symbol when metadata exists. It is not a trading desk, signal bot, or wallet.

## Audience

Global retail crypto users who want a calm, trustworthy second look before buying. English-first UI.

## Personality

Simple developer-grade product site, in the spirit of Vercel and Render. Quiet and precise: hero is typography + real product preview (no decorative SVG scenes). Soft page atmosphere and a single steel accent keep the surface alive.

## Visual language

Light (or dark) page, near-black/near-white type, thin borders. Hero sits on a quiet atmosphere (radial wash + fine field lines). The risk report preview is the main visual object, lightly elevated like a product screenshot. One steel accent for marks and section labels. Risk colors stay reserved for report severity.

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
| Accent (steel) | `#1D4E78` | `#7EB6D9` | Marks, section labels |
| Ok / Warn / Bad | existing | existing | Report severity only |

## Layout

1. Landing: atmosphere hero (headline + CTAs), elevated report preview, features, how+signals, CTA band
2. Check: quiet top wash, search + mint form, guidance / skeleton / report (identity row on live reports)
3. Radius `12px` cards, `999px` buttons. Content max width `80rem`
4. Sticky header solid `var(--bg)` + bottom border (no glass)

## Motion

MOTION 2: hero rise, preview delayed rise, score bar fill, chip hover shift. Respect `prefers-reduced-motion`.

## Atmosphere rules

- One soft radial wash + fine field lines behind the hero only (depth, not decoration everywhere)
- One elevated surface: the report preview (single soft shadow)
- Accent used sparingly: step numbers, section labels, secondary hover
- No decorative hero illustrations; the product preview is the visual

## Do not

- Purple / indigo brand washes, neon glow, glassmorphism
- Soft mint Contiant-style cards or cream+serif terracotta looks
- Decorative SVG scenes or mascot illustrations in the hero
- Fake logos, stats, or testimonials
- Accent color on every button and border at once

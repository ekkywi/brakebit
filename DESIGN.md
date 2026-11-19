# Brakebit Design Direction

Dial: ENERGY 2 / RHYTHM 2 / MOTION 1

## Product

Brakebit is a crypto safety tool. Users pick a network, paste a token address, and get a risk report with human-readable reasons before they buy. It is not a trading desk, signal bot, or wallet.

## Audience

Global retail crypto users who want a calm, trustworthy second look before buying. English-first UI.

## Personality

Simple developer-grade product site, in the spirit of Vercel and Render (user-requested reference). Quiet, precise, fast to scan.

## Visual language

White page (or dark near-black), near-black/near-white type, one light gray border on cards, inverted primary buttons per theme. The score masthead in the report is the instrument face. No decorative gradients, no soft shadows, no ruled ledgers.

Light/dark is user-controlled via a sun/moon switcher (explicit product request). Preference persists in `localStorage` and respects system preference on first visit.

### Typography

| Role | Face |
|---|---|
| UI / display / body | Geist Sans |
| Addresses / figures | Geist Mono |

Display: tight tracking (`-0.04em`), weight 600. Body: 15–16px, muted gray.

## Palette

| Token | Hex | Role |
|---|---|---|
| Background | `#FFFFFF` | Page |
| Subtle | `#FAFAFA` | Alternate band / inputs |
| Foreground | `#0A0A0A` | Text, primary button |
| Muted | `#666666` | Supporting text |
| Border | `#EAEAEA` | Card edges only |
| Ok | `#0B6E4F` | Lower risk |
| Warn | `#8A6419` | Moderate risk |
| Bad | `#B42318` | High / critical risk |

## Layout

1. Landing: centered hero, product preview, networks row, features, signals, 3 steps, use cases, CTA, footer
2. Check: title, form card, tips, report
3. Radius `12px` cards, `999px` buttons. Content max width `80rem` (1280px)
4. Sticky header is solid `var(--bg)` + bottom border — no blur / glass

## Motion

MOTION 1: short fade/rise on first paint. Score bar fill.

## Do not

- Shadows, glows, gradients, glassmorphism / backdrop blur
- Dense hairline grids
- Fake logos, stats, or testimonials

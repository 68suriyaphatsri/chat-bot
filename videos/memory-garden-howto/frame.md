---
version: alpha
name: Capsule — Frame (video / frame layer)
description: >
  Video-first companion to Capsule's design.md. The unit is the frame (1920×1080). Atoms are
  identical and sacred — the pill geometry (9999px small / 2rem cards) with a 2px ink outline on
  everything, the sun-bleached cream canvas, the nine-color candy palette, Prompt (display) + Anuphan (UI/body) + Sarabun (long text), soft hard-offset shadows (4/6/8/12px in 8% ink), floating decorative-pill wallpaper,
  radial accent glows, and the grain overlay. Composition + frame scale rewritten. Motion out of scope.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the script

colors:
  cream: "#f7f9f4"
  ink: "#23350e"
  outline: "#355115"
  white: "#FFFFFF"
  coral: "#4a6b22"
  lime: "#82954b"
  lavender: "#f0f7e6"
  sky: "#e0ebd2"
  violet: "#fff9e6"
  yellow: "#fdf3d0"
  peach: "#e8ede0"
  mint: "#e8f5e9"
  shadow: "rgba(35,53,14,0.10)"

typography:
  # — reading ramp (Prompt) —
  body:      { fontFamily: "Anuphan", cqw: 0.85, weight: 400, lineHeight: 1.6 }
  subtitle:  { fontFamily: "Anuphan", cqw: 0.95, weight: 400 }
  pill-text: { fontFamily: "Anuphan", cqw: 0.75, weight: 600 }
  label:     { fontFamily: "Anuphan", px: 14, weight: 500 }
  # — display / hero ramp (Prompt, ink, sentence case) —
  card-headline:{ fontFamily: "Prompt", cqw: 1.9, weight: 700, lineHeight: 1.1 }
  orbit-numeral:{ fontFamily: "Prompt", cqw: 2.6, weight: 700, lineHeight: 1.0 }
  quote-display:{ fontFamily: "Prompt", cqw: 4.2, weight: 600, lineHeight: 1.3, tracking: "-0.01em" }
  stat-number: { fontFamily: "Prompt", cqw: 3.6, weight: 800, lineHeight: 1.0, tracking: "-0.03em" }
  section-headline:{ fontFamily: "Prompt", cqw: 4.0, weight: 700, lineHeight: 1.05, tracking: "-0.01em" }
  headline:    { fontFamily: "Prompt", cqw: 5.0, weight: 700, lineHeight: 1.05, tracking: "-0.02em" }
  closing-display:{ fontFamily: "Prompt", cqw: 8.5, weight: 800, lineHeight: 0.95, tracking: "-0.03em" }
  display:     { fontFamily: "Prompt", cqw: 12.0, weight: 800, lineHeight: 0.88, tracking: "-0.03em" }

spacing:
  pad: "5cqw"
  gap-md: "2cqw"
  card-pad: "2cqw 1.6cqw"

components:
  pill:
    rounded: "9999px (small) / 2rem (cards)"
    border: "0.2cqw solid {colors.outline}"
    backgroundColor: "any candy or {colors.white}"
    description: "The universal container — every chip/button/label/stat tile/node/bar. No unstroked pill exists."
  pill-card:
    backgroundColor: "{colors.white}"
    border: "0.2cqw solid {colors.outline}"
    rounded: "2rem"
    shadow: "0.4cqw 0.4cqw 0 {colors.shadow}"
    typography: "{typography.card-headline} + {typography.body}"
    description: "Holds a circular card-icon, Prompt headline, Prompt body."
  stat-pill:
    backgroundColor: "{colors.white}"
    border: "0.2cqw solid {colors.outline}"
    rounded: "2rem"
    shadow: "0.3cqw 0.3cqw 0 {colors.shadow}"
    typography: "{typography.stat-number} (COLORED) + {typography.pill-text}"
    description: "The one place color touches a numeral; + a 40px accent bar."
  title-pill:
    backgroundColor: "{colors.yellow}"
    border: "0.2cqw solid {colors.outline}"
    rounded: "9999px"
    shadow: "0.3cqw 0.3cqw 0 {colors.shadow}"
    typography: "{typography.pill-text}"
    description: "Sits above the display headline on cover/closing."
  card-icon:
    backgroundColor: "any candy"
    border: "0.2cqw solid {colors.outline}"
    rounded: "50%"
    size: "60px"
    typography: "Prompt numeral/letter in {colors.ink}"
    description: "Card mark."
  floating-pill:
    backgroundColor: "any candy"
    border: "0.2cqw solid {colors.outline}"
    rounded: "9999px / 50%"
    transform: "rotate(−20°..+25°)"
    shadow: "none"
    typography: "{typography.pill-text}"
    description: "Decorative wallpaper confetti, 5–8 per declarative frame. Flat — no shadow."
  quote-highlight:
    backgroundColor: "{colors.lime} / {colors.sky}"
    border: "0.2cqw solid {colors.outline}"
    rounded: "9999px"
    description: "Inline candy pill wrapping a phrase inside a Prompt quote — the emphasis mechanism, replacing bold/italic."
  bar-track:
    backgroundColor: "{colors.cream}"
    border: "0.2cqw solid {colors.outline}"
    rounded: "9999px"
    fill: "child candy pill, value at right edge"
    description: "36px pill chart track."
  accent-line:
    backgroundColor: "{colors.coral}"
    rounded: "9999px"
    size: "60×4 (80×4 closing)"
    description: "Coral pill rule."
  atmosphere:
    background: "1–3 radial candy glows (6–15% opacity) over {colors.cream} + 4% grain overlay"
    description: "Baseline canvas layers on every frame. Never absent."
---

> **Memory Garden adaptation (hand-edited):** palette repainted to the app's nature-therapy greens from design.md (coral→#4a6b22 primary green, lime→#82954b olive accent, yellow→#fdf3d0 warm sun). Risk colors are NOT candy accents — use only on the result screen: normal #2e7d32/#e8f5e9, MCI #d97706/#fffbeb, see-doctor #c53030/#fdf2f2. Thai text: never uppercase/letter-spaced; min on-screen text 34px for senior legibility. Font files (the ONLY fonts to use): `assets/fonts/Prompt-{Regular,Medium,SemiBold,Bold,ExtraBold}.ttf` (family Prompt, weights 400/500/600/700/800) and `assets/fonts/Anuphan.ttf` (family Anuphan, variable weight 100–700). Emoji render from the system Noto Color Emoji. App UI mockups follow design.md (glass cards r24, pill buttons 56px, 🔊 TTS button).

# Capsule — Frame (video / frame layer)

## Brand adaptation (READ FIRST — the frontmatter is the source of truth)

This is the **capsule** preset remixed onto the captured brand. The YAML frontmatter above (colors · typography · components) is **normative and already correct — use it verbatim.** The prose below is the ORIGINAL preset's intent; read it THROUGH the frontmatter:

- **Fonts** — already set to **Prompt** (display) / **Anuphan** (body); ignore any preset font name lingering in prose.
- **Colors** — use the frontmatter hex; preset color NAMES in prose (e.g. "cobalt", "cream") mean the remapped brand values.


## Overview

Capsule at frame scale is a **playful editorial system where every container is a pill.** The
`border-radius: 9999px` (small) / `2rem` (cards) rule plus a 2px ink outline wraps every chip,
card, icon, bar, and node — inflated, friendly, graphically distinct. The canvas is sun-bleached
cream warmed by soft radial candy glows and a permanent 4% grain overlay.

The voice is a two-face conversation: **Prompt** (didone serif, weight 700–800, always ink,
always sentence case) carries every headline, stat, and quote; **Prompt** carries body and
all uppercase tracked pill/label text. Nine candy accents fill pills interchangeably with no
semantic meaning. Depth is a **soft hard-offset shadow** (4/6/8/12px in 8% ink) — lifted, not
stamped — reserved for content-bearing containers; decorative floating pills are flat.

**Key characteristics at frame scale:**

- **Pill geometry everywhere** — 9999px small, 2rem cards — each wrapped in a 2px `{colors.outline}` stroke.
- **Prompt** display (ink, sentence case) + **Prompt** body/pills (uppercase, tracked).
- **Nine candy accents**, interchangeable; color touches stat numerals + pill fills, never headlines.
- **Soft offset shadows** (4/6/8/12px, 8% ink) on content containers only; floating pills are flat.
- **Floating decorative-pill wallpaper** (5–8, tilted) + radial glows + 4% grain on declarative frames.
- **Cream canvas** warmed by atmosphere — bare corners read as broken.

## The Frame

### Frame Craft Bar

Three eyeball tests gate every frame before any structural check:

- **Squint** — one Prompt headline or stat dominates at **3–6× its nearest neighbor**.
- **Silence** — declarative frames carry **atmosphere, not clutter** (pills as wallpaper, not content); the **pillar-cards and stat grid are the dense exception**.
- **Restraint** — every pill carries the 2px outline; color touches **fills + stat numerals only** (never a headline); soft shadow on content-bearing pills only (floating pills are flat); no tenth accent.
- **Reference** — aim at a **Memphis / ice-cream-parlor editorial spread**; failure looks like a **flat, sticker-less SaaS card grid**.

- **Primary:** 1920×1080 (16:9). Display authored in **`cqw`** (`px ÷ 1920 × 100 = cqw`).
- **Vertical:** 1080×1920 (9:16). **Square:** 1080×1080 (1:1).
- **Safe area:** `pad` (5cqw); floating pills may bleed off edges as wallpaper.

**The container law (load-bearing).** Every frame ground sets `container-type: size` AND carries
the radial-glow + grain atmosphere; ALL frame-relative units are `cqw`/`cqh` against it — never
`vw`. Pill radii stay `9999px`/`2rem` (shape, not scale); shadow offsets scale in `cqw`.

## Colors

Tokens identical to the source. `{colors.cream}` is the ground; `{colors.ink}`/`{colors.outline}`
is type + the universal 2px stroke; the nine candy accents fill pills with **no semantic mapping**
— pair a warm (coral/yellow/peach) with a cool (sky/lavender/violet/mint) with a neutral-bright
(lime); never two same-family adjacent. Color appears on **stat numerals and pill fills only** —
never on a Prompt headline. Shadow is always `{colors.shadow}` (8% ink). No tenth color.

## Typography

Two ramps. The **reading ramp** (Prompt body 0.85cqw, uppercase tracked pill/label text)
carries copy + chips; the **display ramp** (Prompt `card-headline` 1.9cqw → `display` 12cqw, all
700–800) carries every headline, stat, and quote.

- **Legibility floor:** any load-bearing line ≥ **1.4cqw**; px labels are chrome only.
- **Fit-to-measure:** size the headline to its length. Cap the block at **≤ 78cqw**; ≤3 words → `display`/`closing-display`; 4–6 → `headline`; 7+ → `section-headline`.
- **Prompt 700+ in ink, sentence case** (italic via `<em>` only, color allowed on the italic key word as a candy hue); **Anuphan pills/labels in sentence case (Thai — never tracked)**; negative-track Prompt display.

## Depth & Surface

Soft hard-offset shadow is the only depth, in `{colors.shadow}` (8% ink), bottom-right:

- **0.2cqw (4px)** small nodes; **0.3cqw (6px)** stat-pills, orbit pills, diagram nodes; **0.4cqw (8px)** pillar-cards; **0.6cqw (12px)** the visual frame.
- The **2px outline** does most of the lift against cream; the shadow adds the float.
- **Decorative floating pills cast no shadow** — this separates content from atmosphere at a glance.

**Ceiling:** no blurred shadow, no re-colored shadow, no gradient depth.

## Shapes

- **9999px** — all small pills (chips, buttons, bars, nodes, floating pills, quote highlights, accent lines).
- **2rem** — larger cards (pillar-card, stat-pill, chart container, visual frame).
- **50%** — circular pills (card-icon 60px, step-node 56px, orbit-center 160px, nav dots).
- **0** — only the grain overlay and the gradient region inside a visual frame. No sharp-cornered text container exists.

## Components

- **pill** — the universal 2px-outlined container. **pill-card / stat-pill / title-pill** — the white/yellow content pills with soft shadows.
- **card-icon** — circular candy mark; **floating-pill** — flat tilted wallpaper confetti; **quote-highlight** — inline candy emphasis pill.
- **bar-track** — pill-shaped chart bar; **accent-line** — coral pill rule; **atmosphere** — the baseline glow + grain on every frame.

## Frame Treatments

> Recipe: ground · container · composes · focal · chrome · accent · silence · Fixed/Free · density.
> Atmosphere (glow + grain) on every frame; declarative frames carry floating-pill wallpaper.

### 1 · Cover (identity · move: title pill + display · centered)

**Ground** cream + atmosphere, floating-pill wallpaper. **Composes** title-pill, display, accent-line, floating-pills (5–8). **Focal** a 1–2 line Prompt `display` headline in ink (italic key word in a candy hue), centered, under a yellow title-pill; a coral accent-line below. **Chrome** Anuphan sub. **Accent** the italic word + candy floating pills. **Silence** content centered; pills fill the edges. **Fixed** pill outlines, Prompt ink, flat floating pills. **Free** title, which candy hues, pill words/positions. **Density** medium-atmospheric.

### 2 · Pillar Cards (catalog · move: 3-up grid · left — the dense frame)

**Ground** cream + atmosphere. **Composes** title-pill (lavender), section-headline, 3× pill-card. **Focal** three white 2rem pill-cards (circular candy card-icon, Prompt card-headline, Prompt body) with 0.4cqw shadows, under a Prompt section-headline. **Chrome** a lavender header tag-pill. **Accent** the three card-icon fills (coral/sky/lime sequence). **Silence** tight — the density exception (no floating pills here). **Fixed** 2px outlines, soft shadows, ink headlines. **Free** card content, icon hues. **Density** dense-exception.

### 3 · Stat Grid (data · move: stat pills · centered head)

**Ground** cream + atmosphere. **Composes** section-headline, 3–4× stat-pill. **Focal** a row of white stat-pills, each a COLORED Prompt stat-number + Anuphan label + accent bar. **Accent** the colored numerals + bars (the one place color meets type). **Silence** moderate. **Fixed** 2rem pills, colored numerals only, soft shadow. **Free** figures (from script), hues. **Density** standard.

### 4 · Pull Quote (quote · move: highlight pill · left)

**Ground** cream + atmosphere, a few floating pills. **Composes** quote-display, quote-highlight, accent-line. **Focal** a Prompt quote in ink with one phrase wrapped in a lime/sky `quote-highlight` pill (the emphasis mechanism — never bold). **Chrome** uppercase attribution. **Accent** the highlight pill. **Silence** ~50%. **Fixed** Prompt 600, highlight-pill emphasis. **Free** quote, highlight color/phrase. **Density** sparse.

### 5 · Orbit (concept · move: gravitational pills · centered)

**Ground** cream + atmosphere. **Composes** orbit-center (160px lime circle, Prompt ordinal), 4–6 orbit-pill satellites (candy, tilted, soft shadow). **Focal** the lime center anchored by orbiting candy pills. **Accent** the satellite hues. **Silence** moderate. **Fixed** circular center, outlined satellites with shadow. **Free** ordinal, satellite words/positions. **Density** medium.

### 6 · Closing Plate (closer · move: title pill + display · centered)

**Ground** cream + atmosphere, floating-pill wallpaper. **Composes** title-pill (yellow), closing-display, accent-line, floating-pills. **Focal** a Prompt `closing-display` sign-off in ink (italic word in violet/candy), centered. **Accent** the italic word + pills. **Silence** content centered. **Fixed** Prompt ink, flat pills. **Free** sign-off, pill words. **Density** medium-atmospheric.

## Composition Rules

### Do

- Make every text container a **pill** (9999px / 2rem) with the **2px ink outline**.
- Set **Prompt headlines in ink, sentence case**; color lives on stat numerals + pill fills.
- Use **soft offset shadows** (4/6/8/12px, 8% ink) on content containers; keep floating pills flat.
- Float **5–8 candy pills** + radial glows + grain on declarative frames; bare corners read as broken.
- Wrap inline emphasis in a **candy quote-highlight pill**, never bold/italic-alone.
- Pair warm+cool+neutral-bright accents; lean centered on cover/closer, left on cards/quote.

### Don't

- No sharp-cornered text container; no unstroked pill.
- No colored Prompt headline; no uppercase Prompt.
- No blurred or re-colored shadow; no tenth accent color.
- No shadow on decorative floating pills.
- Don't blow a headline edge-to-edge — fit to measure.

## Aspect-Ratio Behavior

| Treatment    | 16:9                           | 9:16                        | 1:1                   |
| ------------ | ------------------------------ | --------------------------- | --------------------- |
| Cover        | display centered, pills around | display top, pills band     | centered, fewer pills |
| Pillar Cards | head + 3-up                    | head + 3 stacked            | head + 2+1            |
| Stat Grid    | 3–4 across                     | 2×2                         | 2×2                   |
| Pull Quote   | quote left                     | quote top, highlight inline | centered              |
| Orbit        | center + 4–6 satellites        | center + 3 satellites       | center + 4            |
| Closing      | centered + pills               | centered, pills band        | centered              |

`pad` holds on the short edge; re-step display above the 1.4cqw floor. Floating-pill count drops
on tighter ratios so they stay wallpaper, not clutter.

## Approved Entities

No real customers, logos, or vendors are defined in the source — render any such mark as a
placeholder. Floating-pill words are neutral atmospheres ("VISION", "FUTURE", "NEXT"), never content-specific.

## Numerals & Claims (hard rule)

Never invent figures, stats, or counts at frame scale. Render slots as `— figure —`, `{metric}`,
`N%`. Stat-pill numbers and bar-track widths carry placeholders until the script supplies values.

## Pre-Render Self-Audit

- **Squint** — one Prompt element dominates at 3–5× its neighbor.
- **Silence** — declarative frames carry atmosphere not clutter; only pillar/stat grids run dense.
- **Pills** — every container is a pill with a 2px outline; no sharp text container.
- **Color** — candy on fills + stat numerals only; headlines ink; no tenth hue.
- **Depth** — soft offset shadow on content only; floating pills flat; no blur.
- **Type** — Prompt ink sentence-case, fit-to-measure; pills uppercase tracked; ≥1.4cqw floor.
- **Anchor** — centered on cover/closer/orbit, left on cards/quote; no 3 consecutive alike.
- **Fabrication** — every numeral traces to the script, else placeholder.

## Known Gaps

- **Motion intentionally out of scope.** frame.md specifies composition only; the 0.6s fade in the source is a deck mechanic.
- **Prompt + Prompt via Google Fonts.** CJK pairing (ZCOOL XiaoWei / Yozai) carries over from the source.
- **9:16 / 1:1 are guidance**; verify the floor and that floating-pill count scales down.
- The grain overlay, radial glows, floating pills, and bar fills are CSS-only; no external imagery is required.

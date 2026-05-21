# Handoff — Talkin' Deutsch · Monochrome Blue Redesign

A handoff package for a Claude Code session. The goal: bring the monochrome-blue redesign of **Talkin' Deutsch** (the integration-challenge app at `https://integrations-challenge.vercel.app/`) into the production codebase.

---

## 1. About this package

The files in `design_reference/` are **design references**, not production code to copy line-for-line. They are React components rendered with inline Babel inside a single static HTML file — useful for previewing intent, copying tokens, and lifting interaction patterns, but they are **not** how the feature should ship.

Your task is to **recreate these designs inside the existing Next.js / React codebase** at `integrations-challenge.vercel.app`, using its established conventions (component structure, styling system, routing, state). The HTML mocks bypass the real codebase entirely — your job is to port them in cleanly.

If the existing codebase already has a UI primitive (Button, Card, Tabs, ProgressBar, ProgressRing, etc.), use it. Only introduce new primitives when nothing existing fits.

## 2. Fidelity

**High-fidelity.** Colors, typography, spacing, radii, easing, and copy are all final. Match the reference pixel-for-pixel where the codebase's tokens allow; fall back to the codebase's nearest equivalent when an exact match would fight the existing system (note any divergence in your PR).

## 3. What this redesign changes vs. the current production app

The current production app uses a multi-hue palette (one distinct color per theme). The redesign collapses that into a **single hue with four steps**: sky → primary blue → deep blue → navy. Each theme number maps to a deeper step.

The narrative arc — first contact (1) to deep connections (4) — is now visually encoded by depth of color, not by color identity. This matches the marketing site's brand palette.

Nothing else about the flow or information architecture changes. Screens, navigation, animations, copy: all preserved.

---

## 4. Design tokens

All values are defined in `design_reference/directions/B-plus-tokens.jsx` as the `Bp` object. Bring these into the codebase's token layer (CSS vars / Tailwind config / theme object).

### Color

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A0E1A` | Primary text |
| `inkSoft` | `#525866` | Secondary text, body copy on light backgrounds |
| `inkMute` | `#9098A4` | Tertiary text, inactive states |
| `bg` | `#FAFAFA` | App background |
| `surface` | `#FFFFFF` | Cards, sheets |
| `hair` | `#ECEEF1` | Hairline borders, empty-progress tracks |
| `brandNavy` | `#03045E` | Primary CTA fill (Loslegen, Zur Gewohnheit machen) |
| `brandBlue` | `#0077B6` | Brand accent — wordmark dot, italic display accents |
| `brandSky` | `#00B4D8` | Soft glows, decorative hairlines |

#### Theme scale (sky → navy)

Each theme has three values: `color` (primary), `deep` (darker shade for gradients & deep-accent text), `soft` (tinted background for chips & tip blocks).

| Theme | Title (DE) | `color` | `deep` | `soft` |
|---|---|---|---|---|
| 1 — Erster Kontakt | Lächeln · grüßen · fragen | `#0096C7` | `#0077B6` | `#CAEAF5` |
| 2 — Wiederkehrende Begegnungen | Bekannte Gesichter werden | `#0077B6` | `#023E8A` | `#BBD4EA` |
| 3 — Aktive Teilhabe | Mitgestalten · einbringen | `#023E8A` | `#03045E` | `#C5D0E5` |
| 4 — Tiefe Verbindungen | Vertrauen · Heimat · Freundschaft | `#03045E` | `#000033` | `#D5DAE8` |

If the codebase already exposes a theme-scale primitive, extend it. Otherwise expose these as `theme.scale[0..3]` with `{color, deep, soft}` shape.

### Typography

Load via Google Fonts:

```
https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap
```

| Role | Family | Notes |
|---|---|---|
| Display | `"Instrument Serif", "Times New Roman", Georgia, serif` | 400 weight, both roman & italic. Used for h1/h2 and big numeric flourishes. Letter-spacing `-0.005em` to `-0.01em`. |
| UI / body | `Inter, system-ui, -apple-system, sans-serif` | 400 / 500 / 600 / 700. Default letter-spacing `-0.01em`. |
| Meta / labels | `"JetBrains Mono", ui-monospace, Menlo, monospace` | 400 / 500. Used for tag-like uppercase labels (`"AKTUELLES THEMA"`, `"THEMA 01 · AUFGABE 3"`). |

A common pattern: **italic Instrument Serif as in-display accent**, often paired with the brand-blue color — e.g. `Talkin'` (roman) + `Deutsch` (italic), or `Ankommen,` (roman) + `Schritt für Schritt.` (italic, brand-blue).

### Spacing, radii, shadows

- **Cards / sheets:** `border-radius: 18px` (theme cards, today summary), `14px` (smaller cards / chips), `16px` (CTA buttons), `12px` (icon buttons, inner controls), `999px` (pills).
- **Section padding:** `20px` horizontal on screen edges, `28px` on hero text blocks, `52–60px` top padding (under the iOS status bar).
- **Shadows:** active theme card uses a colored shadow — `0 6px 24px -10px ${themeColor}55`. CTAs use `0 8px 22px -6px ${themeColor}90`. The done-screen check badge uses `0 18px 50px -12px rgba(0,0,0,0.25), 0 0 0 8px rgba(255,255,255,0.25)`.
- **Hairlines:** `1px solid #ECEEF1` (light), `1px solid rgba(255,255,255,0.15)` on themed dark surfaces.

### Animation tokens

All durations & easings from `B-plus-tokens.jsx`. Port them as keyframes / Framer Motion variants / transition utilities in the codebase's preferred motion layer.

| Name | Duration | Easing | Use |
|---|---|---|---|
| `bp-ring-fill` | 900ms | `cubic-bezier(.2,.7,.3,1)` | Progress ring stroke-dashoffset fill on mount, ~200ms delay |
| `bp-bar-fill` | 600ms | `cubic-bezier(.3,.7,.3,1)` | Linear progress bar `scaleX` from 0→1, staggered ~80ms per row |
| `bp-rise` | 500ms | `cubic-bezier(.2,.7,.3,1)` | Card / hero entry — opacity 0→1 + translateY 12px→0 |
| `bp-burst` | 600ms | `cubic-bezier(.3,1.6,.4,1)` | Done-screen checkmark badge (slight overshoot) |
| `bp-radiate` | 900ms | `cubic-bezier(.2,.7,.3,1)` | Done-screen ripple rings outward, scale 0.4→2.8, fade out |
| `bp-confetti-up` | 1100ms | `cubic-bezier(.2,.6,.4,1)` | Confetti particles outward + rotate + fade |
| `bp-wash` | 1000ms | `cubic-bezier(.7,0,.3,1)` | Full-screen color wipe between themes — translateY 100% → 0 → -100% |
| `bp-tap` | 120ms | `cubic-bezier(.2,.7,.3,1)` | Button press, `scale(0.97)` on `:active` |

---

## 5. Screens

There are five screens in the flow. Each is a top-level route or in-app view. The reference implementations live in `design_reference/directions/B-plus-screens.jsx`.

Mobile viewport: **390 × 760** (iPhone 14/15 portrait, no notch math required — bake the status-bar padding into top-of-screen offsets).

### 5.1 Welcome (`BpWelcome`)

**Purpose:** First screen on app open. Brand intro + entry point.

**Layout (top → bottom):**
- 60px top padding, 28px horizontal.
- Wordmark (Talkin' Deutsch) at top-left, 22px display size.
- Centered hero mark: concentric SVG arcs in theme colors (radii 76 / 60 / 44, strokeWidth 2.5) over a soft radial glow, with a navy filled circle (r=28) and a small white dot (r=10) at center. Decorative — does NOT represent live progress.
- H1 (Instrument Serif 44px, line-height 1.0, centered): `Ankommen,` (roman) + line break + `Schritt für Schritt.` (italic, brand-blue `#0077B6`).
- Subhead (15px Inter, color `inkSoft`, centered): `Vom ersten Hallo bis zur echten Freundschaft. / In kleinen, machbaren Schritten.`
- Spacer (`flex: 1`).
- Primary CTA: full-width, 16px padding, navy `#03045E` fill, white text, radius 16, label `Loslegen` (15px, 600 weight). Tap → overview.
- Tertiary text button beneath: `Schon dabei? Anmelden` (13px, `inkSoft`).

All elements enter with `bp-rise`, staggered 0 / 120 / 220 / 320 ms.

### 5.2 Overview (`BpOverview`)

**Purpose:** Home / themes list. Always the entry point after Welcome.

**Layout:**
1. **Full-bleed themed header** (`54px 22px 32px`, gradient `${active.color} → ${active.deep}` top-to-bottom, white text):
   - Decorative giant theme number (Instrument Serif 200px, white, 16% opacity) bottom-right, half-clipped.
   - Two concentric ring outlines top-right (1px white 15% alpha, sizes 200/140), half-clipped.
   - Top row: wordmark (white, 16px) ← → small 36px square button labeled `L` linking to Habits (translucent white, 16% alpha, backdrop blur).
   - Eyebrow label `AKTUELLES THEMA` (12px, 78% white, 0.5em letter-spacing).
   - H1: active theme title in italic Instrument Serif 38px (e.g. `Erster Kontakt.`).
   - Sub-title: theme `sub` line (13px, 85% white).
   - 28px down: 64px progress ring (white stroke) + numeric `done/total` (display 32px) + label `Aufgaben gemeistert`.

2. **Themen list** (`#9098A4` mono-style label `THEMEN`, then cards):
   - Each card: 16px padding, radius 18, white surface, 1px hair border. Active theme card gets `border: 1px solid ${meta.color}55` and a colored shadow.
   - Left chip: 46×46, radius 14, theme color fill, italic display numeral (26px) — or a lock SVG if `locked: true`.
   - Middle: theme title (15px, 600 weight, `-0.3` letter-spacing), sub (12px, `inkSoft`), and a 5px-tall progress bar (track `hair`, fill `meta.color`) — bar is hidden on locked themes.
   - Right: `done/total` numeric (display 18px, theme color + muted divisor) — hidden on locked themes.
   - Tap → Detail (if not locked).

3. **Als nächstes** ("up next") list:
   - Lighter cards: 14px 16px padding, radius 14. Left dot (8×8, theme color). Title (14px, 600) + sub (12px, `inkSoft`). Right chevron (`inkMute`).

4. **Tab bar** (see 5.5).

Bar fills are staggered: `delay = 300 + i * 80 ms`. The ring fills at 300ms delay.

### 5.3 Detail (`BpDetail`)

**Purpose:** A single task / challenge. The screen quiets down to focus on content — themed color is reduced to a small chip and the primary CTA.

**Layout:**
- Background: `surface` (`#FFFFFF`), not `bg`.
- Top bar (`52px 20px 0`): back button (36×36, radius 12, `bg` fill, 1px hair) ← → status pill (themed: padding `6px 12px`, radius 999, `t.soft` background, `t.deep` text, 11px, 600, uppercase, 0.4em letter-spacing). Pill text reads `THEMA 0{num} · AUFGABE {n}` with a 6×6 dot in `t.color` prefix.
- Body (`40px 28px 0`):
  - H1: task title in Instrument Serif 40px, line-height 1.0.
  - Body copy (16px Inter, line-height 1.6, `ink`).
- Tip block (`32px 28px 0`):
  - 4px-wide vertical accent rule in `t.color`, full-height of the block.
  - Label `TIPP` (11px, 600, `t.deep`, uppercase, 0.5em letter-spacing).
  - Tip body (14px, line-height 1.6, `inkSoft`).
- Timeframe picker (`36px 28px 0`):
  - Label `BIS WANN?` (12px, 600, `inkMute`, uppercase).
  - 3 equal-width buttons with a 2-line label (`Heute` / `Mi`, `In 3 Tagen` / `Sa`, `Diese Woche` / `So`). Middle is selected by default — fills with `t.color`, white text, colored shadow `0 4px 12px -4px ${t.color}80`. Others are `bg` fill, 1px hair border.
- CTA block (`36px 28px 100px` to clear the tab bar):
  - Primary: full-width, 16px padding, radius 16, `t.color` fill, white text, label `Annehmen`, colored shadow `0 8px 22px -6px ${t.color}90`. Tap → Done screen.
  - Tertiary text button: `Bereits erledigt`.
- Tab bar (themed with `t.color` for the active indicator).

### 5.4 Habits (`BpHabits`)

**Purpose:** Daily routines that came from completed tasks.

**Layout:**
- Header (`54px 22px 14px`): eyebrow `ROUTINEN`, H1 `Gewohnheiten` (italic Instrument Serif 38px). Right side: 36×36 close button (chevron, on `surface` with 1px hair).
- **Today summary card** (`8px 20px 22px`, padding 18, radius 18, themed linear-gradient 135° from `t.color` to `t.deep`, white text):
  - Decorative ring (120×120, 1.5px white 20% alpha) clipped top-right.
  - 56px progress ring + `{doneToday} von {total}` (display 28px, italic `von`) + label `Routinen heute erledigt`.
- **Per-habit cards** (`0 20px 12px`, padding 18, radius 18, surface, 1px hair):
  - Top row: theme dot (6×6, `t.color`) + label `THEMA 0{num}` (10px, 600, `t.deep`, uppercase, 0.5em letter-spacing), then title (15px, 600). If streak > 0: a small pill in `t.soft` background with a flame SVG and label `{streak} Tage Serie` (11px, 600, `t.deep`).
  - 7-day week grid: 7 cells of equal flex width, each a 32-high rounded-10 cell. Done days fill with `t.color` + a white checkmark SVG; empty days have `bg` fill and 1px hair border. Day labels below each cell (`M D M D F S S`, 10px, `inkMute`).
  - CTA: full-width, 12px padding, radius 12. If `todayDone`: `bg` fill, `inkSoft` text, 1px hair border, label `Heute erledigt` with a check SVG. Else: `t.color` fill, white text, label `Heute abhaken`, colored shadow.
- Tab bar with `habits` active.

### 5.5 Done (`BpDone`)

**Purpose:** Celebration after completing a task. Offers to convert task → habit.

**Layout:**
- Background: linear-gradient `${t.color}` → `${t.color}` 38% → `${bg}` 70% (so the top half is themed, then fades into the surface).
- Top bar (`52px 20px 0`): back arrow in 36×36 button (translucent white, backdrop blur), pointing back to overview.
- Celebration block (centered, `40px 28px 0`):
  - 16 confetti particles burst outward from center — 8×14 rounded rectangles, mixed colors (`t.color`, `t.deep`, white, `t.soft`), random angle / distance / rotation. Animation `bp-confetti-up`, ~1100ms, slight per-particle delay.
  - 2 radiating white rings expand outward (`bp-radiate`, delays 100/300ms).
  - Center: 110×110 white circle, `bp-burst` animation, with a 48×48 checkmark stroked in `t.color`. Shadow: heavy + 8px white outer ring at 25% alpha.
  - Eyebrow `ERLEDIGT` (white, 11px, 600, uppercase).
  - H1: `Stark, das war's!` — roman `Stark,` + italic `das war's!` (Instrument Serif 42px, white).
- Task card (`38px 20px 0`, padding 20, radius 18, surface, 1px hair, drop shadow `0 12px 32px -16px rgba(0,0,0,0.18)`):
  - Same `THEMA 0{n} · AUFGABE {n}` pill row as Detail.
  - Task title (16px, 600).
  - Prompt copy (13px, `inkSoft`): `Möchtest du diese Aufgabe zur täglichen Gewohnheit machen?`
- CTA block (`24px 20px 32px`):
  - Primary: navy `#03045E` fill, full-width, label `Zur Gewohnheit machen`. Tap → Habits with the task pre-inserted as a new habit (streak 1, todayDone true).
  - Tertiary text button: `Nein, danke` → overview.

### 5.6 Tab bar (`BpTabBar`)

Position absolute bottom, full width, `rgba(255,255,255,0.92)` background with 16px backdrop blur, 1px hair top border.

Two tabs:
- **Aufgaben** (target: `overview`) — icon: 16×16 SVG, outer circle r=6, inner filled dot r=2.
- **Routine** (target: `habits`) — icon: 16×16 SVG, ~5-radius arc with a tiny tick mark and a stem (a stylized clock).

Active tab: icon wrapper has padding `6px 16px`, radius 12, fill = current `themeColor`, icon is white. Label below: 10.5px, 600 weight when active else 500, `ink` when active else `inkMute`.

Press feedback: `bp-tap` scales to 0.97.

---

## 6. State & navigation

Reference state shape in `design_reference/directions/B-plus-app.jsx` (`BP_INITIAL_DATA`). Reproduce it in whatever state layer the codebase uses (Zustand / Redux / Context / server-side per the existing pattern).

```ts
type Data = {
  themes: Array<{
    done: number;
    total: number;
    locked: boolean;
    tasks: Array<{ title: string; body: string; tip: string }>;
  }>; // length 4, indexed to THEMES[0..3]
  upNext: Array<{ title: string; sub: string; themeIdx: number; taskIdx: number }>;
  habits: Array<{
    title: string;
    themeIdx: number;
    streak: number;
    week: [0|1, 0|1, 0|1, 0|1, 0|1, 0|1, 0|1]; // Mon..Sun
    todayDone: boolean;
  }>;
};
```

Navigation map (`screen` state, plus `themeIdx`, `taskIdx`):
- `welcome` → `overview` (on `Loslegen` or `Anmelden`)
- `overview` → `detail` (on a theme card tap, with `themeIdx` payload; on an "up next" card tap, with `themeIdx` + `taskIdx`)
- `overview` → `habits` (on the `L` button top-right)
- `detail` → `done` (on `Annehmen`)
- `done` → `habits` (on `Zur Gewohnheit machen`, prepends a new habit)
- `done` → `overview` (on `Nein, danke` or back arrow)
- `habits` → `overview` (on back chevron, or Aufgaben tab)
- Any → `overview` / `habits` via tab bar.

**Theme switch behavior:** When `themeIdx` changes via navigation, trigger the **theme wash** transition — a full-height colored panel (`absolute inset:0`, zIndex 50, `pointerEvents: none`) of the new theme color, with `bp-wash` keyframes (translateY 100% → 0 → 0 → -100% over 1000ms). The new theme's screen renders behind it as the wash slides up off the top. Reference: `BpThemeWash` in `directions/B-plus-tokens.jsx` and the wash trigger in `directions/B-plus-app.jsx`.

**Mount-replay trick:** Screens re-mount on every nav by re-keying their root with `${screen}-${themeIdx}-${taskIdx}`. This lets all the entry animations (rise, ring-fill, bar-fill) play again. Reproduce this with React `key` or your router's transition layer.

---

## 7. Copy (German, verbatim)

All German copy is final. Do not paraphrase. See `design_reference/directions/B-plus-app.jsx` for the canonical strings.

Quick reference of common labels:

| Label | Use |
|---|---|
| `Loslegen` | Welcome primary CTA |
| `Schon dabei? Anmelden` | Welcome tertiary |
| `Aktuelles Thema` | Overview header eyebrow |
| `Aufgaben gemeistert` | Overview hero label |
| `Themen` | Overview list label |
| `Als nächstes` | Overview up-next list label |
| `Bis wann?` | Detail timeframe label |
| `Heute` / `In 3 Tagen` / `Diese Woche` | Timeframe options |
| `Annehmen` | Detail primary CTA |
| `Bereits erledigt` | Detail tertiary |
| `Tipp` | Tip block label |
| `Routinen` / `Gewohnheiten` | Habits header |
| `Routinen heute erledigt` | Habits hero label |
| `{n} Tage Serie` | Streak pill |
| `Heute abhaken` / `Heute erledigt` | Habit row CTA |
| `Erledigt` | Done eyebrow |
| `Stark, das war's!` | Done H1 (italic on `das war's!`) |
| `Zur Gewohnheit machen` | Done primary CTA |
| `Nein, danke` | Done tertiary |
| `Aufgaben` / `Routine` | Tab bar labels |

---

## 8. Files in this bundle

```
design_handoff_talkin_deutsch/
├── README.md                                    ← this file
└── design_reference/
    ├── index.html                               ← canvas of all artboards + the brief
    ├── design-canvas.jsx                        ← canvas layout helper (presentation only)
    ├── ios-frame.jsx                            ← iOS bezel helper (presentation only)
    └── directions/
        ├── B-plus-tokens.jsx                    ← tokens, BpSheet (CSS), BpRing, BpWordmark, BpThemeWash
        ├── B-plus-screens.jsx                   ← Welcome / Overview / Detail / Habits / Done / TabBar
        └── B-plus-app.jsx                       ← BP_INITIAL_DATA + BpPrototype (state, nav, wash)
```

To preview the reference: open `design_reference/index.html` in a browser. The leftmost artboard is an interactive prototype — tap through to see the live transitions. The other artboards show every screen at rest, including different theme states.

`design-canvas.jsx` and `ios-frame.jsx` are presentation chrome (pan/zoom grid, phone bezel). **Do not port these** — they exist only so the mocks can sit side-by-side on a canvas.

---

## 9. Suggested PR slicing

If the codebase uses small PRs, here's a sensible order:

1. **Tokens & fonts** — palette, theme scale, type, motion tokens. Add Instrument Serif & JetBrains Mono to font loading.
2. **Primitives** — `<Wordmark>`, `<ProgressRing>`, `<ProgressBar>`, theme-aware `<Button>` variants, `<MetaLabel>` (the mono uppercase chip).
3. **Welcome** — easiest screen, no list logic.
4. **Tab bar + Overview** — biggest visual lift.
5. **Detail** — content-first, low risk.
6. **Done + Habits** — animation-heavy; can ship without the celebration burst as a v1 if time-pressed.
7. **Theme wash transition** — last; layer on top once routing is settled.

---

## 10. Open questions to confirm with the team

- Does the existing codebase have a motion library (Framer Motion / Motion One / CSS-only)? Pick one and keep all the transitions there.
- Is the dark-mode story shared with marketing or app-only? The reference is light-mode only — confirm before introducing dark surfaces.
- The `L` button in the overview header is a placeholder glyph for the link to Habits. Replace with the codebase's standard icon set if available; otherwise lift the wordmark dot motif.
- The current production app may already have analytics events on these CTAs. Preserve event names while swapping out the visuals.

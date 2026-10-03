# Sales Board — Theming & Interaction Reference

A compact, standalone reference to this project's visual design system and interaction
patterns, written so it can be pulled into a *different* project without needing
screenshots. Read this file directly (raw GitHub URL or `gh api`) — it does not depend
on any other file in the repo.

Live reference repo: `https://github.com/LaksUX/samsung`
Raw file: `https://raw.githubusercontent.com/LaksUX/samsung/main/THEME.md`

Stack this theme assumes: Next.js (App Router) + Tailwind CSS + Radix UI primitives +
`class-variance-authority` + `clsx`/`tailwind-merge` + `lucide-react` icons. Nothing
here is Samsung/dashboard-specific — it's a generic dark, data-dense, mobile-first UI
system.

---

## 1. Design tokens (`tailwind.config.js`)

```js
theme: {
  extend: {
    colors: {
      bg: "#0b0e1a",        // page background
      card: "#151a2c",      // primary surface
      card2: "#1b2138",     // secondary/inset surface (tab rail, chat bubbles, pills)
      cardline: "#262c42",  // default border / divider
      cardline2: "#33395a", // stronger border (tab rail border, track-bar background)
      ink: "#f5f3ee",       // primary text (off-white, not pure white)
      text2: "#c7c9d9",     // secondary text
      text3: "#9da1b5",     // tertiary text (tab labels, body copy)
      text4: "#8b90a3",     // quaternary text (captions, meta, footer)
      accent: "#ff8a34",    // brand orange — primary actions, active states
      accentText: "#ffa35c",// lighter orange for text-on-dark / hover states
      good: "#2fd3a0",      // positive delta / healthy status
      goodText: "#34d399",
      bad: "#ff6b6b",       // negative delta / risk status
      badText: "#ff6b6b",
    },
    fontFamily: {
      display: ["'Space Grotesk'", "sans-serif"], // headings, logo wordmark, card titles
      body: ["'Inter'", "-apple-system", "sans-serif"], // default body text
      mono: ["'IBM Plex Mono'", "monospace"], // numbers, labels, tab text, badges — anything "data-like"
    },
  },
},
plugins: [require("tailwindcss-animate")],
```

Fonts are loaded via one Google Fonts `@import` in the global stylesheet:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
```

**Design rationale**: three distinct type families signal three distinct kinds of
content at a glance — `font-display` for identity/headings, `font-body` for prose,
`font-mono` for anything numeric or label-like (tab text, badges, timestamps, KPIs).
Tabular numerals are forced globally with a utility class:

```css
.tabular { font-variant-numeric: tabular-nums; }
```
Apply `.tabular` to any element showing numbers that update or sit in a column, so
digits don't jiggle horizontally.

### Global base (`app/globals.css`)
```css
html, body {
  background: #0b0e1a; /* matches `bg` token — set at the HTML level, not just on a wrapper,
                           so there's no flash of white before Tailwind/React hydrates */
  -webkit-font-smoothing: antialiased;
}
```

---

## 2. Layout convention

- Mobile-first, single column, capped width: `max-w-md` wrapper centered with
  `flex justify-center`, inner padding `px-5 py-6`.
- Page chrome: left-aligned logo mark + wordmark (`lucide-react` icon + `font-display
  font-semibold`), right-aligned two-line meta block (bold top line, muted second
  line) — a simple "brand left, context right" header used across every screen.
- Bottom padding on `<main>` (`pb-24`) to clear a floating action button.
- A horizontally scrollable pill/tab rail directly under the header switches between
  top-level views — `overflow-x-auto` with `scrollbarWidth: "none"` inline (hides the
  scrollbar without extra CSS).
- A muted, centered, monospace footer caption (tracking-wide, uppercase via `.toUpperCase()`
  in JS, not CSS) closes out the page — reads like a timestamp/report stamp.

---

## 3. Core components (hand-built shadcn/ui-equivalents)

All components are plain function components wrapping Radix primitives, styled with
Tailwind + a `cn()` helper (`clsx` + `tailwind-merge`):

```js
// lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) { return twMerge(clsx(inputs)); }
```

### Card
`rounded-2xl border border-cardline bg-card shadow-sm`. Sub-parts: `CardHeader`
(`flex flex-col space-y-1 p-4 pb-0`), `CardTitle` (`font-display font-semibold
text-[15px]`), `CardDescription` (`text-[12.5px] text-text4`), `CardContent` (`p-4`).
This is the base surface for every discrete block of content on a page.

### Badge (`class-variance-authority` variants)
Pill-shaped, monospace, uppercase-tracking status chip:
```js
"inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-semibold tracking-wide"
variants: {
  healthy: "bg-good/15 text-goodText border-good/30",
  watch:   "bg-accent/15 text-accentText border-accent/30",
  risk:    "bg-bad/15 text-badText border-bad/30",
  default: "bg-card2 text-text3 border-cardline2",
}
```
Pattern: status color at low opacity (`/15`) for the fill, same hue at `/30` for the
border, full-strength `*Text` token for the label. Reuse this 15%/30%/solid formula
for any new status color.

### Tabs (Radix `react-tabs`)
`TabsList`: `inline-flex ... rounded-[10px] border border-cardline2 bg-card2 p-1`
(an inset pill rail). `TabsTrigger`: `flex-1 rounded-[7px] px-3 py-2 font-mono
text-[11.5px] font-medium tracking-wide text-text3`, with the active state
`data-[state=active]:bg-accent data-[state=active]:text-white` — accent-filled pill,
not an underline. Used for both the top-level view switcher (custom button row,
same visual language) and in-card sub-tabs (e.g. switching between a Price Band and
Category breakdown within one card).

### Separator (Radix `react-separator`)
`bg-cardline`, 1px, horizontal or vertical via `orientation`.

### Sheet (Radix `react-dialog`, repurposed as a bottom/side sheet)
Slide-over panel used for both the AI chat panel and detail drill-downs.
- Overlay: `bg-black/40` with `fade-in` on open.
- Content: `bg-card border-cardline shadow-xl max-h-[85vh]`, positioned `bottom`
  (`rounded-t-2xl border-t`, `slide-in-from-bottom`) or `right` (`w-full max-w-sm
  border-l`, `slide-in-from-right`) via a `side` prop.
- A circular close (`X` icon) button pinned `absolute right-4 top-4`.
- Animations come from `tailwindcss-animate`'s `data-[state=open]:animate-in` utilities
  — no custom keyframes needed.

---

## 4. Interaction conventions

- **Primary action = accent-filled circular FAB**, bottom-right, fixed position:
  `w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/30`, with a hover
  (`hover:bg-accentText hover:scale-105`) and press (`active:scale-95`) micro-state.
  Used here for the AI chat entry point.
- **Active/selected state across tabs, pills and segmented switchers is always a solid
  accent fill + white text** — never an underline or outline. Inactive state is
  `bg-card`/`bg-card2` with a `cardline` border and `text3` label.
- **Comparison bars** (e.g. this-year vs last-year): two overlaid absolutely-positioned
  bars inside one `relative` track — a muted `cardline2` bar at full width ratio behind,
  an `accent` bar (at `opacity-80`) in front, both `style={{ width: `${pct}%` }}`
  computed from `value / max * 100`. No chart library — just divs.
- **Drill-down pattern**: tapping a list row opens a `Sheet` (bottom, on mobile) with
  the same `Card`/`Badge`/mono-number vocabulary, rather than navigating to a new route.
  Keeps everything feeling like one continuous surface.
- **Toggles** (e.g. Value ⇄ Volume, Price Band ⇄ Category) are small two-option
  `TabsList`/`TabsTrigger` pairs inline in a card header, not separate pages.
- **Disclaimers / data caveats** are rendered inline as a small bordered callout using
  a `TriangleAlert` icon (lucide) + `text-badText`/`bad` border at low opacity — same
  15%/30% formula as badges — never a modal or toast.
- **Chat / conversational UI**: user bubbles right-aligned `bg-accent text-white`;
  assistant bubbles left-aligned `bg-card2 text-text2`; both `rounded-2xl px-3.5 py-2.5
  text-sm leading-relaxed`, max width `85%`. Suggested-prompt chips shown only when
  the thread is empty, styled as full-width left-aligned rows (`bg-card2 border
  border-cardline rounded-xl`). Input is a full pill (`rounded-full`) with a circular
  send button matching the FAB treatment. Auto-scrolls to bottom on new message via a
  `ref` + `scrollTo({ behavior: "smooth" })` in a `useEffect`.

---

## 5. How to port this into a new project

1. Copy the color tokens and font stack into the new project's `tailwind.config.js`
   verbatim (or re-theme just the `accent`/`good`/`bad` hues, keep `bg`/`card`/`ink`
   structure).
2. Copy `lib/utils.js` (`cn` helper) and the five files under `components/ui/`
   (`card.jsx`, `badge.jsx`, `tabs.jsx`, `separator.jsx`, `sheet.jsx`) as-is — they have
   no app-specific logic, only Radix + Tailwind.
3. Reuse the layout shell (`max-w-md`, centered, header pattern, scrollable tab rail,
   floating accent FAB) for any mobile-first dashboard-style screen.
4. Reuse the 15%/30%/solid opacity formula for any new semantic color (not just
   healthy/watch/risk).
5. Everything above has zero dependency on the actual sales data — it's pure UI
   system and can be dropped into an unrelated app directly.

---
*Generated as a reference for reuse in other projects — see repo README for the
dashboard's own setup/deploy instructions.*

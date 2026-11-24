# Design System & Token Specification (v1.0) — Studio Obsidian

**Document Version:** 1.0.0  
**Design Philosophy:** "Studio Obsidian" — Cinematic, Industrial, High-Density Command Center  
**Target Codebase:** `@yt-studio/web` (React, Tailwind CSS, Framer Motion)  
**Related Documents:** [PRD.md](file:///c:/Projects/Youtube%20Automation%20Studio/docs/PRD.md) · [ARCHITECTURE.md](file:///c:/Projects/Youtube%20Automation%20Studio/docs/ARCHITECTURE.md) · [IMPLEMENTATION_PLAN.md](file:///c:/Projects/Youtube%20Automation%20Studio/docs/IMPLEMENTATION_PLAN.md)

---

## 1. Aesthetic Direction & Non-Negotiables

YT Automation Studio is built for creators, media power-users, and multi-channel agencies. The UI must feel like an **aircraft cockpit meets cinematic production suite**: high-density, authoritative, and deeply responsive.

### 1.1 Non-Negotiable Bans (Strictly Enforced)
- ❌ **BANNED:** Default shadcn/Radix starter kit look (neutral gray cards with flat white borders).
- ❌ **BANNED:** Generic purple-on-white SaaS template palettes.
- ❌ **BANNED:** Uniform "Inter everywhere with no hierarchy" — flat unstyled text blocks.
- ❌ **BANNED:** Toy-like saturated pastel card grids and generic generic icon-only rows without labels.
- ❌ **BANNED:** Low-contrast dark grays that fail WCAG accessibility standards.

### 1.2 Signature Design Pillars
1. **Deep Ink & Obsidian Depth:** True dark canvas (`#07090E` base) layered with smoky obsidian cards (`#0D111A`) and elevated glass surfaces (`rgba(255,255,255,0.03)`).
2. **Crimson Studio Accent:** YouTube-inspired radiant studio flame (`#FF2A36` primary with `#E50914` deep anchor) for active recording, live publishing, and primary actions.
3. **Telemetry Accents:** Electric Amber (`#FFB800` for quota warnings), Neon Cyan (`#00F2FE` for AI operations), Emerald (`#00E599` for published status).
4. **Precision Glassmorphism:** Micro-borders with sub-pixel metallic alpha (`rgba(255,255,255,0.08)`) and high-diffusion backdrops (`blur(16px)`).
5. **Tabular Numerics:** Strict tabular monospace (`font-variant-numeric: tabular-nums`) for quota counters, latency meters, view counts, and video timecodes.

---

## 2. Core Color Tokens

### 2.1 Backgrounds & Surfaces

| Token Name | CSS Variable | Hex / RGBA Value | Usage |
| :--- | :--- | :--- | :--- |
| `bg-base` | `--bg-base` | `#07090E` | Main application canvas (deepest ink) |
| `bg-surface-1` | `--bg-surface-1` | `#0D111A` | Primary card panels, sidebar, header |
| `bg-surface-2` | `--bg-surface-2` | `#131824` | Elevated dialogs, dropdowns, popovers |
| `bg-surface-glass` | `--bg-surface-glass` | `rgba(13, 17, 26, 0.75)` | Translucent overlays with blur |
| `bg-overlay` | `--bg-overlay` | `rgba(7, 9, 14, 0.85)` | Modal backdrop blur curtain |

### 2.2 Studio Brand & Accent Palette

| Token Name | CSS Variable | Hex Value | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| `accent-primary` | `--accent-primary` | `#FF2A36` | Studio Flame: primary buttons, active state |
| `accent-primary-hover` | `--accent-primary-hover`| `#FF4552` | Hover state for primary actions |
| `accent-primary-glow` | `--accent-primary-glow` | `rgba(255, 42, 54, 0.25)` | Focus ring and soft ambient glows |
| `accent-cyan` | `--accent-cyan` | `#00F2FE` | AI agent processes, LangGraph telemetry |
| `accent-amber` | `--accent-amber` | `#FFB800` | Quota budget alerts, circuit breaker warnings |
| `accent-emerald` | `--accent-emerald` | `#00E599` | Published videos, verified OAuth, healthy nodes |
| `accent-purple` | `--accent-purple` | `#A855F7` | n8n automation triggers and workflow states |

### 2.3 Borders & Separation Lines

| Token Name | CSS Variable | Value | Purpose |
| :--- | :--- | :--- | :--- |
| `border-subtle` | `--border-subtle` | `rgba(255, 255, 255, 0.06)` | Table rows, card dividers |
| `border-medium` | `--border-medium` | `rgba(255, 255, 255, 0.12)` | Default card borders, input borders |
| `border-highlight` | `--border-highlight` | `rgba(255, 255, 255, 0.22)` | Hovered cards, selected items |
| `border-accent` | `--border-accent` | `rgba(255, 42, 54, 0.40)` | Active focus states, error alerts |

### 2.4 Typography & Text Colors

| Token Name | CSS Variable | Hex / RGBA Value | WCAG Contrast |
| :--- | :--- | :--- | :--- |
| `text-primary` | `--text-primary` | `#F8FAFC` (Slate 50) | 16.5:1 on base (AAA) |
| `text-secondary` | `--text-secondary` | `#94A3B8` (Slate 400) | 7.8:1 on base (AAA) |
| `text-muted` | `--text-muted` | `#64748B` (Slate 500) | 4.6:1 on base (AA) |
| `text-accent` | `--text-accent` | `#FF4552` | Highlights and alerts |

---

## 3. Typography Scale & Hierarchy

### 3.1 Type Families
- **Display & Headings:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` with tight tracking (`letter-spacing: -0.025em`) and weights `600` to `800`.
- **Monospace & Telemetry:** `"JetBrains Mono", "Fira Code", monospace` with `font-variant-numeric: tabular-nums` for timestamps, counts, quota counters, and code snippets.

### 3.2 Type Hierarchy

| Level | Size | Line Height | Tracking | Weight | Class Name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `36px` (`2.25rem`) | `1.15` | `-0.035em` | `800` | `.text-display-hero` |
| **Page Title (H1)** | `28px` (`1.75rem`) | `1.2` | `-0.025em` | `700` | `.text-title-h1` |
| **Section Title (H2)**| `20px` (`1.25rem`) | `1.3` | `-0.02em` | `600` | `.text-title-h2` |
| **Card Header (H3)** | `16px` (`1.00rem`) | `1.4` | `-0.015em` | `600` | `.text-title-h3` |
| **Body Standard** | `14px` (`0.875rem`)| `1.5` | `0` | `400` | `.text-body` |
| **Body Small / Meta**| `12px` (`0.75rem`) | `1.5` | `+0.01em` | `500` | `.text-caption` |
| **Code / Tabular** | `13px` (`0.8125rem`)| `1.4` | `0` | `500` | `.text-mono-data` |

---

## 4. Radii, Shadows & Elevation

### 4.1 Border Radii
- **Subtle (Buttons, Badges, Chips):** `6px` (`rounded-md`)
- **Cards, Modals, Panels:** `12px` (`rounded-xl`)
- **Nested Inner Containers:** `8px` (`rounded-lg`)
- **Pills & Avatars:** `9999px` (`rounded-full`)

### 4.2 Elevation Shadows
```css
--shadow-elevation-1: 0 2px 8px -2px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-elevation-2: 0 8px 24px -4px rgba(0, 0, 0, 0.65), 0 2px 6px rgba(0, 0, 0, 0.4);
--shadow-elevation-3: 0 20px 48px -8px rgba(0, 0, 0, 0.8), 0 4px 12px rgba(0, 0, 0, 0.5);
--shadow-glow-red: 0 0 24px -4px rgba(255, 42, 54, 0.35);
--shadow-glow-cyan: 0 0 24px -4px rgba(0, 242, 254, 0.35);
```

---

## 5. Motion & Interaction Curves

All micro-interactions use purposeful physical timing functions:

- **Snappy Response (Buttons, Toggles):** `cubic-bezier(0.16, 1, 0.3, 1)` at `150ms`.
- **Card Expansions / Drawers:** `cubic-bezier(0.2, 0.8, 0.2, 1)` at `250ms`.
- **Page Transitions:** `ease-out` at `200ms`.
- **Active Click State:** `transform: scale(0.98)` on active press.

---

## 6. Accessibility & Contrast Verification (WCAG 2.1 AA)

1. **Text Contrast:**
   - `#F8FAFC` on `#07090E`: Contrast ratio **16.5:1** (Exceeds 7:1 AAA requirement).
   - `#94A3B8` on `#0D111A`: Contrast ratio **7.8:1** (Exceeds 4.5:1 AA requirement).
2. **Interactive States:**
   - Active buttons and focus rings maintain visible outline with `--accent-primary-glow` and minimum 3:1 contrast against adjacent dark surfaces.
3. **Motion Safety:**
   - Standard media query `@media (prefers-reduced-motion: reduce)` disables scale transforms and parallax transitions.

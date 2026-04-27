# Phase 4: Design Tokens - Apply Antares Design System - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning
**Source:** Phase 1 decisions + codebase audit + Roadmap

<domain>
## Phase Boundary

This phase formalizes and centralizes design tokens for the El Profeta brand (Antares Design System), making them consumable as CSS custom properties and applying them consistently across all components.

**What this phase delivers:**
- Formal design token file (`design-system/tokens.css`) documenting all brand tokens
- CSS custom properties in `app/globals.css` for colors, typography, spacing, shadows
- Updated components to use design tokens instead of hardcoded values

**What this phase does NOT deliver:**
- New UI components or pages
- Changes to functionality
- Backend changes
</domain>

<decisions>
## Implementation Decisions

### Design Token Structure (D-01)
- **D-01**: Design tokens defined in `design-system/tokens.css` using CSS custom properties
- **D-02**: File location: `design-system/tokens.css` (sibling to existing `data/` and `app/` directories)
- **D-03**: Import token file into `app/globals.css` via `@import "../design-system/tokens.css"`

### Color Tokens (per D-21, D-23, D-24 from Phase 1)
- **D-04**: Primary text/buttons: `--color-gray-900: #111827`
- **D-05**: Secondary text: `--color-gray-600: #4B5563`
- **D-06**: Muted text: `--color-gray-400: #9CA3AF`
- **D-07**: Borders/dividers: `--color-gray-200: #E5E7EB`
- **D-08**: Background: `--color-white: #FFFFFF`

### Typography Tokens (per D-21, D-22 from Phase 1)
- **D-09**: Body font variable: `--font-sans` (already set via `next/font` to Montserrat)
- **D-10**: Serif font variable: `--font-serif` (already set via `next/font` to Playfair Display)
- **D-11**: Tailwind font-sans uses `var(--font-sans)`
- **D-12**: Tailwind font-serif uses `var(--font-serif)`

### Spacing & Layout
- **D-13**: Container max-width: `--container-max: 1152px` (matches `max-w-6xl`)
- **D-14**: Spacing scale: use Tailwind defaults (no custom spacing tokens needed for MVP)

### the agent's Discretion
- **Components to audit**: All `.tsx` files in `app/components/` and `app/lib/`
- **Files NOT touched**: `app/lib/checkout.ts`, `app/lib/store.ts`, `app/lib/utils.ts`, `data/products.json`
- **Pattern for updates**: Replace hardcoded Tailwind color classes (e.g., `text-gray-900`) with CSS variables (`text-[var(--color-gray-900)]`) where possible, but since Tailwind v4 uses `--font-*` pattern natively, prefer using Tailwind's built-in color names when they map directly to design tokens
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source Code (what currently exists)
- `app/globals.css` — Current theme block, CSS variables
- `app/layout.tsx` — Font configuration (Playfair Display + Montserrat via next/font)
- `app/components/layout/Navbar.tsx` — Navbar component with hardcoded `gray-900`
- `app/components/catalog/ProductCard.tsx` — Product card with hardcoded `gray-900`
- `app/components/home/Hero.tsx` — Hero with hardcoded `gray-900`
- `app/components/cart/CartSidebar.tsx` — Cart sidebar with hardcoded `gray-900`

### Prior Decisions
- Phase 1 CONTEXT.md D-21 to D-26 — Design system decisions
- `AGENTS.md` — Colors: gray-900 (#111827), Playfair Display + Montserrat

### Research (not needed for this phase)
- Design tokens are well-understood patterns, no external research needed

</canonical_refs>

<specifics>
## Specific Ideas

From Phase 1, the following hardcoded values exist across components:

**Navbar.tsx:**
- `text-gray-900` → maps to `--color-gray-900`
- `hover:text-gray-600` → maps to `--color-gray-600`
- `border-gray-200` → maps to `--color-gray-200`
- `bg-gray-900` → maps to `--color-gray-900`

**ProductCard.tsx:**
- `border-gray-200`, `bg-gray-100`, `text-gray-500`, `text-gray-900`, `border-gray-300`, `hover:bg-gray-100`, `text-gray-600`

**Hero.tsx:**
- `text-gray-900`, `text-gray-600`, `hover:bg-gray-800`

**CartSidebar.tsx:**
- `text-gray-900`, `text-gray-600`, `border-gray-200`, `text-gray-500`, `text-gray-400`, `border-gray-300`, `hover:bg-gray-100`, `bg-gray-900`, `border-gray-300`, `hover:bg-gray-800`, `bg-gray-50`, `text-gray-700`

</specifics>

<deferred>
## Deferred Ideas

- **Dark mode** — Not needed for MVP
- **Animation tokens** — No motion design yet
- **Responsive breakpoints as tokens** — Tailwind breakpoints sufficient for MVP
- **Spacing scale tokens** — Tailwind defaults sufficient for MVP
- **Design token CDN or npm package** — Not needed; single CSS file is sufficient

</deferred>

---

*Phase: 04-design-tokens-apply-antares-design-system*
*Context gathered: 2026-04-27*
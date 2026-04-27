# Phase 1: Foundation & Catalog - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning
**Source:** Roadmap + Requirements analysis

<domain>
## Phase Boundary

This phase delivers the foundational store — homepage, navigation, product catalog, and age verification gate to comply with alcohol sales regulations.

**What this phase delivers:**
- Homepage with hero section, headline, CTA leading to catalog
- Navbar with logo, navigation links (Home, Catálogo), cart icon with badge
- Footer with store name and copyright
- Product catalog page with responsive grid of all 8 beers
- Product cards showing image, name, price, category, ABV
- Quantity selector (1-99) and "Agregar al carrito" button per product
- Age gate (18+) that persists after confirmation

**What this phase does NOT deliver:**
- Cart slide-out/modal (Phase 2)
- Checkout form (Phase 3)
- WhatsApp integration (Phase 3)

</domain>

<decisions>
## Implementation Decisions

### Phase Structure
- **01-01**: Homepage + Navbar + Footer + Age Gate
- **01-02**: Product Catalog + Product Cards

### Page Routing
- **D-01**: Homepage at `/` - Server Component
- **D-02**: Catalog at `/catalogo` - Server Component

### Navigation
- **D-03**: Navbar fixed at top - Server Component with cart client island
- **D-04**: Logo links to homepage `/`
- **D-05**: Links: "Inicio" → `/`, "Catálogo" → `/catalogo`
- **D-06**: Cart icon with badge shows item count (0 when empty)

### Product Data
- **D-07**: Products loaded from static JSON (`data/products.json`)
- **D-08**: 8 beers displayed in responsive grid
- **D-09**: Product card shows: image, name, price, category label

### Quantity Selector
- **D-10**: +/- buttons with quantity display
- **D-11**: Range: 1 to 99 units
- **D-12**: "Agregar al carrito" button adds item to cart (Phase 2 cart)
- **D-13**: Phase 1 button shows feedback but cart lives in Phase 2

### Age Gate
- **D-14**: Persistent banner at top until user confirms 18+
- **D-15**: Confirmation persisted in localStorage
- **D-16**: Gate clears after confirmation, shows on return visit until confirmed

### Responsive Design (per requirements)
- **D-17**: 320px mobile: 1 column grid
- **D-18**: 768px tablet: 2 column grid
- **D-19**: 1024px+ desktop: 3-4 column grid
- **D-20**: All tap targets minimum 44px

### Design System
- **D-21**: Headings: Playfair Display (serif)
- **D-22**: Body: Montserrat (sans-serif)
- **D-23**: Primary color: gray-900 (#111827)
- **D-24**: Background: white (#FFFFFF)
- **D-25**: Interactive elements visible :hover states
- **D-26**: Interactive elements visible :focus states

### the agent's Discretion

**Architecture decisions (open to implementer):**
- Cart state management approach — project originally specified Zustand, but for Phase 1-only (no cart feature yet) can use React useState within components
- Component file structure — standard Next.js App Router (`components/layout/`, `components/catalog/`, `components/product/`)
- Image handling — use placeholder images initially vs. deferring to real assets
- Age gate implementation — banner component vs. modal overlay

**Patterns to follow:**
- Server Components for static pages (homepage, catalog)
- Client Components with 'use client' for interactive elements (quantity selector, age gate)
- Tailwind CSS via @tailwindcss/postcss (v4 pattern)
- Mobile-first responsive breakpoints

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Data
- `data/products.json` — Static product data (8 beers, categories, store config)

### Research (from initial project setup)
- `.planning/PROJECT.md` — Core value: "El cliente puede pedir una cerveza en menos de 2 minutos"
- `.planning/STATE.md` — Architecture decisions already made: Zustand for state, static JSON for products

### Design Tokens
- `AGENTS.md` — Design system colors: gray-900 (#111827), white, Playfair Display + Montserrat fonts
- No external design token file — colors defined in AGENTS.md

</canonical_refs>

<specifics>
## Specific Ideas

From requirements success criteria (these MUST work):

1. **User can see homepage with hero section, headline, and CTA button leading to catalog**
   - Hero: Full-width section with headline "Cerveza artesanal de calidad"
   - Subheadline: "Descubre nuestras cervezas artesanales"
   - CTA: "Ver Catálogo" button → /catalogo

2. **User can navigate between Home and Catálogo pages via navbar links**
   - Navbar always visible at top
   - Sticky or fixed positioning

3. **User can view all 8 beers in responsive grid**
   - Grid adapts: 1 col (320px) → 2 col (768px) → 3-4 col (1024px+)
   - Each product shows: image, name, price, category

4. **User can see product details: image, name, price, category, ABV%**
   - Note: products.json has description but ABV not in data model — can derive or add field

5. **User can select quantity (1-99) on product card and add to cart**
   - Quantity selector: - [number] + buttons
   - "Agregar al carrito" button (cart functionality in Phase 2)

6. **User can confirm age (18+) via persistent banner that hides after confirmation**
   - Banner: "Debes tener 18+ años para ingresar"
   - "Confirmo que soy mayor de 18 años" button
   - Persisted in localStorage key: `el-profeta-age-confirmed`

7. **Layout works on 320px mobile, 768px tablet, 1024px+ desktop without horizontal scroll**
   - Mobile-first: design for 320px first, then scale up

8. **All interactive elements have visible hover and focus states**
   - Buttons: hover darken, focus outline (accessibility)

</specifics>

<deferred>
## Deferred Ideas

**NOT in this phase (deferred to future phases):**

- **Product detail pages** — All info shown on card per MVP
- **Category filtering** — Not needed for 8 beers
- **Product search** — Not needed for small catalog
- **Featured products section** — v2
- **Cart slide-out** — Phase 2
- **Checkout form** — Phase 3
- **WhatsApp integration** — Phase 3
- **Supabase database** — Post-MVP

</deferred>

---

*Phase: 01-foundation-catalog*
*Context gathered: 2026-04-27*
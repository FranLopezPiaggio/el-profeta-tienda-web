# El Profeta — Roadmap

## Project

El Profeta Craft Beer Store — WhatsApp-dispatch e-commerce MVP

## Phases

- [ ] **Phase 1: Foundation & Catalog** - Homepage, navigation, product grid, product cards, design system, age gate
- [ ] **Phase 2: Cart System** - Cart slide-out, quantity controls, persistence, running total
- [x] **Phase 3: Checkout & WhatsApp** - Checkout form, validation, wa.me link generation (completed 2026-04-27)

---

## Phase Details

### Phase 1: Foundation & Catalog

**Goal:** Users can browse and view products in a responsive catalog

**Depends on:** Nothing (first phase)

**Requirements:** NAV-01, NAV-02, NAV-03, NAV-04, CATL-01, CATL-02, CATL-03, CATL-04, CATL-05, RESP-01, RESP-02, RESP-03, RESP-04, DESN-01, DESN-02, DESN-03, DESN-04, AGE-01, AGE-02

**Success Criteria** (what must be TRUE):

1. User can see homepage with hero section, headline, and CTA button leading to catalog
2. User can navigate between Home and Catálogo pages via navbar links
3. User can view all 8 beers in responsive grid (1 col mobile, 2 col tablet, 3-4 col desktop)
4. User can see product details: image, name, price, category, ABV%
5. User can select quantity (1-99) on product card and add to cart
6. User can confirm age (18+) via persistent banner that hides after confirmation
7. Layout works on 320px mobile, 768px tablet, 1024px+ desktop without horizontal scroll
8. All interactive elements have visible hover and focus states

**Plans:** 2 plans

- [x] 01-01-PLAN.md — Homepage + Navbar + Footer + Hero + Age Gate
- [x] 01-02-PLAN.md — Product Catalog + Product Grid + Product Cards

**UI hint:** yes

---

### Phase 2: Cart System

**Goal:** Users can manage items in cart with persistent state

**Depends on:** Phase 1

**Requirements:** CART-01, CART-02, CART-03, CART-04, CART-05, CART-06, CART-07

**Success Criteria** (what must be TRUE):

1. User can open cart slide-out/modal from any page via navbar icon
2. User can see all added items with product name, quantity, unit price, subtotal
3. User can increase/decrease quantity per item using +/- controls
4. User can remove individual items from cart
5. User can see running total (sum of all item subtotals)
6. Cart persists across page refreshes via localStorage
7. Cart badge in navbar shows item count and updates in real-time
8. Cart shows friendly empty state message when no items added

**Plans:** 1 plan

- [x] 02-01-PLAN.md — Cart slide-out, quantity controls, persistence, running total

---

### Phase 3: Checkout & WhatsApp

**Goal:** Users can complete purchase via WhatsApp with pre-filled order message

**Depends on:** Phase 2

**Requirements:** CHKT-01, CHKT-02, CHKT-03, CHKT-04, CHKT-05, CHKT-06, WATS-01, WATS-02, WATS-03, WATS-04, WATS-05

**Success Criteria** (what must be TRUE):

1. User can fill checkout form with name (required), phone (required), address (required)
2. Form shows inline validation errors for empty required fields
3. "Finalizar compra" button is disabled until all required fields are filled
4. Button is sticky/always visible above fold on mobile
5. Submitting form opens WhatsApp wa.me link with pre-filled message
6. Pre-filled message includes: customer name, phone, address
7. Pre-filled message includes itemized order (product × quantity = subtotal per item)
8. Pre-filled message includes order total
9. Cart clears after WhatsApp link opens

**Plans:** 1/1 plans complete

- [x] 03-01-PLAN.md — Checkout form, validation, WhatsApp link generation

---

## Progress

| Phase                        | Plans Complete | Status      | Completed |
| ---------------------------- | -------------- | ----------- | --------- |
| 1. Foundation & Catalog      | 2/2            | Complete    | 2026-04-26 |
| 2. Cart System               | 1/1            | Complete    | 2026-04-27 |
| 3. Checkout & WhatsApp       | 1/1            | Complete    | 2026-04-27 |
| 4. Design Tokens             | 2/2            | Complete    | 2026-04-27 |
| 5. Simple CMS                | 2/2            | Complete    | 2026-04-27 |

### Phase 4: Design Tokens - Apply Antares Design System

**Goal:** Design tokens formalized as CSS custom properties and applied consistently across all components

**Depends on:** Phase 3

**Requirements:** TBD (design tokens are a cross-cutting concern, not mapped to specific requirements)

**Success Criteria** (what must be TRUE):

1. `design-system/tokens.css` exists with all brand tokens documented as CSS custom properties
2. `app/globals.css` imports and exposes design tokens via `:root` block
3. All existing components use Tailwind color classes that map to design tokens
4. `design-system/TOKEN-AUDIT.md` documents color usage across all 7 components
5. `npm run build` passes with no errors (no breaking changes)

**Plans:** 2 plans

Plans:
- [ ] 04-01-PLAN.md — Design token file + globals.css integration
- [ ] 04-02-PLAN.md — Component audit + token reference guide

### Phase 5: Simple CMS - Orders, Customers & Reports

**Goal:** Build admin CMS with Supabase for order management, customer database, and sales reports. Protected via Supabase Auth (Google OAuth). Order data captured BEFORE sending to WhatsApp.

**Requirements**: MGMT-01, MGMT-02, MGMT-03, MGMT-04
**Depends on:** Phase 4
**Plans:** 2/2 plans complete

Plans:
- [x] 05-01-PLAN.md — Supabase database schema + Auth (Google OAuth) + CMS login + protected routes
- [x] 05-02-PLAN.md — Checkout integration (save to DB before WhatsApp) + CMS dashboard + Orders + Reports

### Phase 6: Navbar Redesign + New Sections (Mayorista, Negocios, Eventos)

**Goal:** Redesign navbar with logo image, 5 navigation links (Inicio, Catálogo, Mayorista, Negocios, Eventos), and "Contactar" CTA button. Create landing pages for each new section and a contact page with WhatsApp integration.

**Depends on:** Phase 5

**Requirements**: TBD (UI/UX requirements, no specific IDs mapped)

**Success Criteria** (what must be TRUE):

1. Navbar displays the El Profeta logo image instead of text
2. Navbar shows 5 navigation links: Inicio, Catálogo, Mayorista, Negocios, Eventos
3. Navbar has a "Contactar" CTA button that links to /contacto
4. User can navigate to each section via navbar links
5. User can visit /mayorista and see wholesale content with contact CTA
6. User can visit /negocios and see business/partnership content with contact CTA
7. User can visit /eventos and see events content with contact CTA
8. User can visit /contacto and submit an inquiry via WhatsApp
9. Navbar is fully responsive on mobile (hamburger menu) and desktop

**Plans:** 3 plans

Plans:
- [ ] 06-01-PLAN.md — Navbar redesign with logo image, 5 nav links, CTA button
- [ ] 06-02-PLAN.md — Mayorista, Negocios, Eventos page creation
- [ ] 06-03-PLAN.md — Contact page with WhatsApp form

### Phase 7: Hero to Catalog Transition Animation

**Goal:** Implement smooth page transition animation from Hero section to Catalog page

**Depends on:** Phase 6

**Requirements:** TBD (animation/UX requirements, no specific IDs mapped)

**Success Criteria** (what must be TRUE):

1. Clicking "Ver Catálogo" CTA in Hero triggers smooth transition animation
2. Transition animates from Hero section to Catalog grid seamlessly
3. Animation is performant (60fps) on mobile and desktop
4. Animation feels cohesive with brand aesthetics (Antares design system)
5. Fallback for users who prefer reduced motion (prefers-reduced-motion)
6. Works across different browsers (Chrome, Firefox, Safari, Edge)

**Plans:** (to be planned)

---

_Last updated: 2026-05-01_

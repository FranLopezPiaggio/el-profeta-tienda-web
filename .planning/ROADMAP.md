# El Profeta — Roadmap

## Project

El Profeta Craft Beer Store — WhatsApp-dispatch e-commerce MVP

## Phases

- [ ] **Phase 1: Foundation & Catalog** - Homepage, navigation, product grid, product cards, design system, age gate
- [ ] **Phase 2: Cart System** - Cart slide-out, quantity controls, persistence, running total
- [ ] **Phase 3: Checkout & WhatsApp** - Checkout form, validation, wa.me link generation

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

**Plans:** 1 plan

- [x] 03-01-PLAN.md — Checkout form, validation, WhatsApp link generation

---

## Progress

| Phase                   | Plans Complete | Status      | Completed |
| ----------------------- | -------------- | ----------- | --------- |
| 1. Foundation & Catalog | 2/2            | Complete    | 2026-04-26 |
| 2. Cart System          | 1/1            | Complete    | 2026-04-27 |
| 3. Checkout & WhatsApp  | 1/1            | Planned     | -         |

---

_Last updated: 2026-04-26_

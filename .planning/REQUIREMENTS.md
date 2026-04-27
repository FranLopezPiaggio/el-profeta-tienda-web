# Requirements: El Profeta Craft Beer Store

**Defined:** 2026-04-26
**Core Value:** El cliente puede pedir una cerveza en menos de 2 minutos desde que entra a la tienda.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Navigation

- [ ] **NAV-01**: Homepage displays hero section with headline, subheadline, and CTA button leading to catalog
- [ ] **NAV-02**: Navbar displays logo, navigation links (Home, Catálogo), and cart icon with item count badge
- [ ] **NAV-03**: Footer displays store name and copyright
- [ ] **NAV-04**: Navigation links route to correct pages

### Product Catalog

- [ ] **CATL-01**: Product grid displays all beers in responsive grid (1 col mobile, 2 col tablet, 3-4 col desktop)
- [ ] **CATL-02**: Product card displays product image, name, price, category label
- [ ] **CATL-03**: Product card displays beer metadata: category (Lager, IPA, Stout, etc.) and alcohol percentage (ABV) where available
- [ ] **CATL-04**: Product card quantity selector (+/- buttons) allows selecting 1-99 units
- [ ] **CATL-05**: "Agregar al carrito" button adds selected quantity to cart and shows confirmation feedback

### Cart System

- [ ] **CART-01**: Cart slide-out/modal displays all items with product name, quantity, unit price, subtotal
- [ ] **CART-02**: Cart allows modifying quantity (+/-) per item
- [ ] **CART-03**: Cart allows removing individual items
- [ ] **CART-04**: Cart displays running total (sum of all items)
- [ ] **CART-05**: Cart persists across page refreshes via localStorage
- [ ] **CART-06**: Cart badge in navbar shows item count and updates in real-time
- [ ] **CART-07**: Cart empty state displays friendly message when no items added

### Checkout

- [ ] **CHKT-01**: Checkout form collects customer name (required)
- [ ] **CHKT-02**: Checkout form collects phone number (required)
- [ ] **CHKT-03**: Checkout form collects delivery address (required)
- [ ] **CHKT-04**: Checkout form validates required fields and shows inline error messages
- [ ] **CHKT-05**: Checkout form "Finalizar compra" button is sticky/always visible above fold on mobile
- [ ] **CHKT-06**: "Finalizar compra" button is disabled until all required fields are filled

### WhatsApp Integration

- [ ] **WATS-01**: Submitting checkout form opens WhatsApp wa.me link with pre-filled message
- [ ] **WATS-02**: Pre-filled message includes: customer name, phone, delivery address
- [ ] **WATS-03**: Pre-filled message includes itemized order (product name × quantity = subtotal per item)
- [ ] **WATS-04**: Pre-filled message includes order total
- [ ] **WATS-05**: After WhatsApp link opens, cart is cleared

### Responsive Design

- [ ] **RESP-01**: Layout works on 320px (mobile) without horizontal scroll
- [ ] **RESP-02**: Layout works on 768px (tablet) with 2-column product grid
- [ ] **RESP-03**: Layout works on 1024px+ (desktop) with 3-4 column product grid
- [ ] **RESP-04**: All tap targets (buttons, links, quantity controls) are minimum 44px

### Design System

- [ ] **DESN-01**: Typography uses Playfair Display for headings and Montserrat for body text
- [ ] **DESN-02**: Color palette follows design tokens (white/gray/black from MASTER.md)
- [ ] **DESN-03**: All interactive elements have visible :hover states
- [ ] **DESN-04**: All interactive elements have visible :focus states for keyboard navigation

### Age Verification

- [ ] **AGE-01**: Homepage shows age gate requiring user to confirm they are 18+ before accessing store
- [ ] **AGE-02**: Age gate only shows once per session (persisted in localStorage)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Product Experience

- **PROD-01**: Product detail page (`/product/[id]`) with full beer description, tasting notes, food pairings
- **PROD-02**: Category filtering on catalog page (Lager, IPA, Stout, etc.)
- **PROD-03**: Product search functionality
- **PROD-04**: "Productos destacados" (featured) section on homepage with curated selection

### Cart & Persistence

- **CART-08**: Returning customer cart is pre-filled from localStorage on revisit
- **PROD-05**: Reorder functionality — one-tap reorder from previous WhatsApp message (would need WhatsApp Business API)

### Checkout & Delivery

- **CHKT-07**: Delivery area/scope clearly displayed before checkout (e.g., "Entregas en [zona] — coordinación por WhatsApp")
- **CHKT-08**: Order confirmation message after WhatsApp opens (e.g., "Tu pedido fue enviado — te contactamos pronto")
- **CHKT-09**: Order confirmation page after WhatsApp dispatch
- **CHKT-10**: Optional notes field in checkout form

### Store Management

- **MGMT-01**: Supabase backend for products, orders, and customer data
- **MGMT-02**: Admin CMS for managing products (add, edit, remove beers)
- **MGMT-03**: Authentication for admin panel
- **MGMT-04**: Inventory tracking — out of stock badges

### Analytics

- **ANLY-01**: Page view analytics (Plausible/PostHog)
- **MGMT-05**: Conversion tracking — add-to-cart rate, checkout completion rate
- **MGMT-06**: Returning visitor identification

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature                                    | Reason                                             |
| ------------------------------------------ | -------------------------------------------------- |
| Online payment (MercadoPago, Stripe, etc.) | WhatsApp-dispatch model: no payment gateway needed |
| User accounts / authentication             | Reduces friction, any visitor can purchase         |
| Separate product detail pages              | All info shown on product card per MVP scope       |
| Admin / CMS                                | Post-MVP — use JSON directly until proven          |
| Product search                             | Small catalog (8 beers) — filter is enough         |
| Reviews / ratings                          | Not needed for MVP validation                      |
| Order history                              | No backend for persistence                         |
| Backend database                           | JSON static data until Supabase post-MVP           |
| WhatsApp Business API                      | Personal WhatsApp sufficient for MVP volume        |
| Multiple languages                         | Spanish only for MVP                               |
| Carrier delivery integration               | Manual WhatsApp coordination for MVP               |
| Email notifications                        | WhatsApp handles all communication                 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase    | Status   |
| ----------- | -------- | -------- |
| NAV-01      | Phase 1  | Pending  |
| NAV-02      | Phase 1  | Pending  |
| NAV-03      | Phase 1  | Pending  |
| NAV-04      | Phase 1  | Pending  |
| CATL-01     | Phase 1  | Pending  |
| CATL-02     | Phase 1  | Pending  |
| CATL-03     | Phase 1  | Pending  |
| CATL-04     | Phase 1  | Pending  |
| CATL-05     | Phase 1  | Pending  |
| RESP-01     | Phase 1  | Pending  |
| RESP-02     | Phase 1  | Pending  |
| RESP-03     | Phase 1  | Pending  |
| RESP-04     | Phase 1  | Pending  |
| DESN-01     | Phase 1  | Pending  |
| DESN-02     | Phase 1  | Pending  |
| DESN-03     | Phase 1  | Pending  |
| DESN-04     | Phase 1  | Pending  |
| AGE-01      | Phase 1  | Pending  |
| AGE-02      | Phase 1  | Pending  |
| CART-01     | Phase 2  | Pending  |
| CART-02     | Phase 2  | Pending  |
| CART-03     | Phase 2  | Pending  |
| CART-04     | Phase 2  | Pending  |
| CART-05     | Phase 2  | Pending  |
| CART-06     | Phase 2  | Pending  |
| CART-07     | Phase 2  | Pending  |
| CHKT-01     | Phase 3  | Pending  |
| CHKT-02     | Phase 3  | Pending  |
| CHKT-03     | Phase 3  | Pending  |
| CHKT-04     | Phase 3  | Pending  |
| CHKT-05     | Phase 3  | Pending  |
| CHKT-06     | Phase 3  | Pending  |
| WATS-01     | Phase 3  | Pending  |
| WATS-02     | Phase 3  | Pending  |
| WATS-03     | Phase 3  | Pending  |
| WATS-04     | Phase 3  | Pending  |
| WATS-05     | Phase 3  | Pending  |
| (all v2)    | Post-MVP | Deferred |

**Coverage:**

- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0 ✓

---

_Requirements defined: 2026-04-26_
_Last updated: 2026-04-26 after initial definition_

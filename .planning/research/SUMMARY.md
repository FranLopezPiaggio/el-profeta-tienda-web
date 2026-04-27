# Project Research Summary

**Project:** El Profeta Tienda Web — Craft Beer E-commerce MVP
**Domain:** Craft Beer E-commerce (WhatsApp-Dispatch MVP)
**Researched:** 2026-04-26
**Confidence:** MEDIUM-HIGH

## Executive Summary

El Profeta is a craft beer e-commerce MVP using a WhatsApp-dispatch model—no online payment, no user accounts, no backend. Orders flow from a mobile-first web storefront directly to the seller's WhatsApp as a pre-filled message. This is a deliberate anti-pattern to traditional e-commerce, trading backend complexity for customer intimacy and $0 infrastructure cost. The core value proposition is **"under 2 minutes from entry to WhatsApp order."**

Experts build this class of product with Next.js 15 App Router for SEO-friendly SSR, Tailwind CSS v4 for rapid mobile-first styling, and Zustand for cart state management (not React Context—Context API causes unnecessary re-renders for cart use cases). The MVP uses static JSON for products and localStorage for cart persistence—no database needed. The entire stack can be deployed on Vercel free tier.

**Key risks** for this specific model are not payment failures or backend scaling, but pre-checkout friction (mobile UX), age verification, and delivery expectation mismatch. These are Phase 1 implementation concerns, not post-MVP problems. The feature dependency chain is linear: Product Data → Catalog Grid → Product Card → Cart → Checkout Form → WhatsApp Link. Skipping order here leads to broken flows.

---

## Key Findings

### Recommended Stack

The recommended stack is a **static catalog + client-side cart** architecture with Next.js 15 App Router, Tailwind CSS v4, TypeScript 5.x, and Zustand 5.x. Static product data lives in JSON (no database), cart state uses Zustand with `persist` middleware for localStorage sync, and WhatsApp checkout is a pure utility function generating a `wa.me` link.

**Stack divergence from PROJECT.md:** PROJECT.md defines React Context + localStorage for cart. Research recommends Zustand 5.x instead. The gap: React Context re-renders all consumers on any cart change; Zustand provides selective subscriptions and built-in persistence. For a cart-heavy MVP, this is the single most impactful architectural improvement. All other decisions (Next.js 15, Tailwind v4, TypeScript) align with PROJECT.md.

**Core technologies:**

- **Next.js 15 (App Router)**: SSR/SSG, App Router has better caching and RSC than Pages Router, industry standard for e-commerce in 2025/2026
- **Tailwind CSS v4**: Mobile-first utility styling, rapid iteration, design system consistency, ecosystem standard
- **TypeScript 5.x**: Compile-time type safety for price calculations and cart logic, catches errors before runtime
- **Zustand 5.x**: Selective subscriptions avoid Context re-render cascade, built-in `persist` middleware for localStorage, ~20 lines vs ~200+ for Redux
- **Zod**: Form validation schema (checkout form), catches invalid phone/address before WhatsApp generation
- **lucide-react**: Lightweight icons for navbar, cart badge, UI elements

### Expected Features

**Must have (table stakes) — ship in MVP:**

- Product grid with 8 beers from static JSON (responsive, mobile-first)
- Product cards with image, name, price, style, ABV, quantity selector (no detail pages per PROJECT.md)
- Shopping cart with Zustand persistence across sessions
- Checkout form: Name, Phone, Address (4 fields max to avoid Pitfall 1)
- WhatsApp link with pre-filled message: itemized order, total, customer details
- Navbar with logo, cart icon + badge showing item count
- Footer with contact WhatsApp, delivery policy, privacy note (trust signals — Pitfall 6)
- Homepage age gate: persistent banner "Debes ser mayor de 18 años" (Pitfall 2)
- Delivery scope display: zone, timeframe, cost in cart slideout (Pitfall 3)

**Should have (differentiators) — ship if time permits:**

- Beer-specific metadata on cards: ABV%, style family, 1-sentence tasting notes, food pairing (Pitfall 4)
- Featured/rotation products on homepage hero section
- No registration required (by design, zero friction)
- Delivery zone indicator in cart before WhatsApp generation

**Defer entirely (anti-features, explicitly out of scope per PROJECT.md):**

- Online payment processing (anti-feature per PROJECT.md "Sin sistema de pago online")
- User accounts/authentication (anti-feature per PROJECT.md)
- Separate product detail pages (all info on card per PROJECT.md)
- Admin/CMS (post-MVP: Supabase)
- Product search (8 beers, scrollable)
- Reviews/ratings (post-MVP)
- Multi-variant products (single SKU per entry)

### Architecture Approach

The architecture follows **Static Catalog + Client Cart** pattern. Products are server-rendered from static JSON imports in Next.js Server Components for instant page loads and SEO. Cart state lives client-side in Zustand with localStorage persistence. Checkout is a pure function: form data → Zod validation → WhatsApp message template → `wa.me` URL. No backend, no API routes, no database.

**Major components:**

1. **Homepage (Server Component):** Hero with featured beers, full catalog grid, product cards rendered server-side
2. **Cart State (Zustand + persist):** Client-side cart items + totals + localStorage sync, exposed via `useCart()` hook
3. **Cart Slide-out (Client Component):** Persistent drawer with item list, totals, quantity editing, delivery scope, checkout CTA
4. **Checkout Form (Client Component):** 4-field form with Zod validation, generates WhatsApp link on submit
5. **WhatsApp Dispatch (Utility):** Pure function generating `wa.me` link with encoded order message
6. **Product Data (Static JSON):** Server Component data source, enhanced with beer metadata (ABV, style, tasting notes)

### Critical Pitfalls

1. **Mobile checkout friction destroys the core value proposition** — The MVP's "under 2 minute purchase" claim fails if checkout has >4 fields, CTAs below fold, or slow load times. Mitigation: 4 fields max, sticky CTA at mobile viewport bottom, 48px touch targets, show delivery cost estimate before WhatsApp redirect.
2. **Age verification UX killing conversions** — Heavy verification (document upload) causes 15-25% abandonment; checkbox-only provides no legal protection. Mitigation for WhatsApp dispatch: Homepage persistent banner + optional birth year at checkout stored in localStorage. The WhatsApp conversation itself serves as human verification.
3. **Unclear delivery scope creates failed WhatsApp orders** — Customers expect Amazon-like delivery; seller has local WhatsApp dispatch. Mitigation: Show delivery zone, timeframe (24-48h), and cost estimate explicitly in cart slideout before WhatsApp generation.
4. **Poor product presentation fails to sell** — Bare product cards (name + price + button) don't differentiate craft beer. Mitigation: Add ABV%, style, 1-sentence tasting notes, food pairing to product JSON; display prominently on card.
5. **Cart persistence failure loses in-progress orders** — Users who leave return to empty cart. Mitigation: Zustand `persist` middleware with localStorage sync on every cart change; also persist checkout form data for returning users.

---

## Implications for Roadmap

Research suggests a **4-phase incremental delivery model** with a linear dependency chain. Each phase delivers a working slice of the purchase flow—no phase is shippable without the previous.

### Phase 1: Foundation & Catalog

**Rationale:** No other phase can exist without products to display. This phase establishes the entire visual system, mobile responsiveness baseline, and product data structure.
**Delivers:** Next.js 15 project with Tailwind v4, design tokens, static product JSON (8 beers with beer metadata), responsive product grid, product cards, homepage hero section.
**Implements:** Static catalog pattern — server-rendered products from JSON imports.
**Avoids:** Pitfall 4 (poor product presentation) by enriching JSON with ABV, style, tasting notes; Pitfall 5 (speed) by using Next.js Image component for hero optimization; Pitfall 2 (age gate) as homepage banner.
**Research flag:** Mobile performance testing needed—use Lighthouse with 4G throttling, target FCP <1.5s on mobile.

### Phase 2: Cart System

**Rationale:** Must complete Phase 1 before cart. Cart is the core stateful interaction—needs to work flawlessly with persistence across sessions.
**Delivers:** Zustand cart store with `persist` middleware, cart slide-out UI, cart badge in navbar, add-to-cart from product cards, quantity editing, running total.
**Implements:** Zustand instead of React Context (STACK.md recommendation: Zustand avoids Context re-render cascade); localStorage persistence.
**Avoids:** Pitfall 8 (cart persistence failure); Pitfall 1 (cart re-renders degrading mobile performance).
**Research flag:** Standard pattern — well-documented. Skip `/gsd-research-phase`.

### Phase 3: Checkout & WhatsApp Integration

**Rationale:** Depends on Phase 2 (cart state) and Phase 1 (product data). This is the conversion-critical phase—the entire value proposition lives here.
**Delivers:** Checkout form (4 fields: name, phone, address, reference), Zod validation, WhatsApp message generation (`wa.me` link with full order summary), delivery scope display in cart, confirmation UI after WhatsApp click.
**Implements:** WhatsApp click-to-chat checkout pattern — pure utility function; single-page checkout, sticky CTA.
**Avoids:** Pitfall 1 (checkout friction) via 4-field limit and sticky CTA; Pitfall 3 (delivery mismatch) via cart-level zone display; Pitfall 7 (unclear post-WhatsApp next steps) via confirmation screen.
**Research flag:** Needs mobile device testing on iOS and Android to verify `wa.me` link behavior across browsers.

### Phase 4: Polish, Trust & Analytics

**Rationale:** Final phase adds the "real store" credibility and measurement infrastructure. Cannot be properly verified without Phases 1-3 working.
**Delivers:** Footer with contact info, delivery policy, privacy note; "Cómo comprar" explanation section; PostHog/Plausible analytics with event tracking (page views, add-to-cart, checkout started, WhatsApp link generated, cart abandoned); empty cart state; WhatsApp link fallback (direct number if `wa.me` fails); returning user form pre-fill from localStorage.
**Avoids:** Pitfall 6 (missing trust signals); Pitfall 9 (no analytics until problems are unsolvable); Pitfall 10 (no error states).

### Phase Ordering Rationale

The ordering follows a strict dependency chain from FEATURES.md:

```
Product Data → Grid → Cards → Cart → Checkout → WhatsApp
```

This maps exactly to Phase 1 → Phase 2 → Phase 3. Phase 4 is polish layered on top once the core flow works.

**Pitfall avoidance by phase:**

- Mobile speed (Pitfall 5) is tested in Phase 1 verification, not Phase 4
- Trust signals (Pitfall 6) deferred to Phase 4 deliberately—don't add before the flow works
- Age gate (Pitfall 2) starts in Phase 1, elevates to checkout in Phase 3

### Research Flags

**Phases needing deeper research during planning:**

- **Phase 1 verification:** Mobile usability testing with real device on 4G network (not WiFi) — Lighthouse throttling is a proxy, real device testing is the benchmark.
- **Phase 3:** Argentina-specific alcohol e-commerce regulations — Does Argentina restrict direct-to-consumer alcohol delivery? Research identified US state-based restrictions. Need Argentine regulatory map before delivery scope is finalized.
- **Post-launch (Phase 5+):** WhatsApp Business API vs. `wa.me` link — when does `wa.me` become a bottleneck at order volume scale? Research trigger: 50+ orders per day.

**Phases with standard patterns (skip `/gsd-research-phase`):**

- **Phase 2 (Cart System):** Zustand + localStorage persistence is well-documented, multiple real-world examples, standard Next.js patterns apply.

---

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                                                     |
| ------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | Context7 documentation for Next.js, Tailwind; multiple 2025/2026 e-commerce stack sources; Zustand replaces Context is industry consensus |
| Features     | HIGH       | Derived from PROJECT.md (primary source) + verified against craft beer e-commerce patterns; anti-features explicitly scoped               |
| Architecture | MEDIUM     | Based on Next.js commerce patterns (high-confidence sources) but scaled to MVP constraints; no Argentina-specific backend examples found  |
| Pitfalls     | MEDIUM     | Core pitfalls (mobile friction, age verification, delivery scope) well-documented; Argentina-specific regulations unresolved              |

**Overall confidence:** MEDIUM-HIGH

The stack and features are well-researched and directly derived from PROJECT.md constraints. The architecture follows established Next.js patterns. Pitfalls are well-documented but Argentina-specific regulatory gaps remain. The 4-phase roadmap is actionable as-is, with research flags for the gaps.

### Gaps to Address

- **Argentina alcohol delivery regulations:** Research identified US state-based alcohol shipping restrictions. Argentina-specific rules are unknown. Impact: Phase 3 delivery scope display and zone-blocking feature may need legal review. Resolution: Flag for Phase 3 planning; consult local alcohol commerce regulations before launch.
- **WhatsApp Business API vs. wa.me:** `wa.me` deep links sufficient for MVP but limited at scale (no delivery confirmation, no automation). Resolution: Research trigger at 50+ orders/day—flag as Phase 5 consideration.
- **Age verification legal standard in Argentina:** "Mayorde 18 años" checkbox may or may not satisfy Argentine alcohol sale regulations. Resolution: Consult local legal requirements before Phase 1 launch.

---

## Sources

### Primary (HIGH confidence)

- `/vercel/next.js` (Context7) — App Router patterns, SSR/SSG, Partial Prerendering
- `/tailwindlabs/tailwindcss.com` (Context7) — Tailwind CSS patterns
- PROJECT.md — El Profeta store requirements (2026-04-26)
- Baymard Institute checkout UX research — cart abandonment statistics

### Secondary (MEDIUM confidence)

- Beerwulf: "How to Build a Successful Online Beer Store" (2024-01-10)
- Flowcart: "WhatsApp Checkout & Cart Flows: A Guide for Modern Ecommerce 2026"
- ActiveCampaign: "WhatsApp for E-commerce: Complete Guide" (2025-11-20)
- Bottlecapps MobileUX Report 2025 — mobile alcohol purchase patterns
- Medium (Feb 2026): "State Management in 2026: Redux vs Zustand vs Context API"
- Webscension: "Best Tech Stack for E-commerce in 2026" (Jan 2026)

### Tertiary (LOW confidence — needs validation)

- Argentina-specific alcohol e-commerce regulations (no specific source found)
- WhatsApp Business API scaling threshold for order volume

---

## Related Research Files

- `.planning/research/STACK.md` — Full technology recommendations and alternatives
- `.planning/research/FEATURES.md` — Complete feature landscape with table stakes, differentiators, anti-features
- `.planning/research/ARCHITECTURE.md` — Component map, data flow, project structure, build order
- `.planning/research/PITFALLS.md` — Critical, moderate, and minor pitfalls with prevention strategies

---

_Research completed: 2026-04-26_
_Ready for roadmap: yes_

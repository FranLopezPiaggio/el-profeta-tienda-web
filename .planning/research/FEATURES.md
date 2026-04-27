# Feature Landscape: Craft Beer E-Commerce

**Project:** El Profeta — WhatsApp-Dispatch Craft Beer Store  
**Researched:** 2026-04-26  
**Context:** Greenfield MVP with WhatsApp-only fulfillment

---

## Executive Summary

This document maps the feature landscape for a craft beer e-commerce store operating on a WhatsApp-dispatch model. Unlike traditional e-commerce with online payment and full backend, El Profeta MVP uses a minimalist web storefront that funnels orders to WhatsApp, replacing checkout pages with a pre-filled message to the store's WhatsApp number.

Research across craft beer e-commerce platforms and WhatsApp commerce flows reveals that **table stakes** for craft beer e-commerce center on product presentation and cart functionality, while **differentiators** emerge around beer-specific metadata (tasting notes, ABV, food pairings) and the WhatsApp integration itself. The WhatsApp-dispatch model represents a deliberate anti-pattern to traditional e-commerce, trading backend complexity for customer intimacy.

---

## Table Stakes

Features users expect. Missing or broken table stakes cause users to leave immediately. These are non-negotiable for any functional e-commerce store.

### 1. Product Catalog Grid

| Attribute        | Detail                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **What**         | Grid display of all available beers with image, name, price                                                                      |
| **Why Expected** | Users need to see what products exist and browse selection                                                                       |
| **Complexity**   | Low                                                                                                                              |
| **Dependencies** | Product data source (JSON in MVP)                                                                                                |
| **Notes**        | Must be responsive (mobile-first). Craft beer stores benefit from visual-heavy presentation since beer packaging is distinctive. |

### 2. Product Card

| Attribute        | Detail                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **What**         | Individual product display with image, name, price, quantity selector                                                                            |
| **Why Expected** | Core unit of commerce — the "buy button" lives here                                                                                              |
| **Complexity**   | Low                                                                                                                                              |
| **Dependencies** | Product catalog, cart state                                                                                                                      |
| **Notes**        | PROJECT.md explicitly defines this as showing "todo en la card" — no separate detail page. Quantity selector should be visible without clicking. |

### 3. Shopping Cart

| Attribute        | Detail                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| **What**         | Persistent cart storing selected items with quantities and running total                                        |
| **Why Expected** | Users rarely buy single items; cart enables multi-product orders                                                |
| **Complexity**   | Low-Medium                                                                                                      |
| **Dependencies** | Product catalog, localStorage persistence                                                                       |
| **Notes**        | PROJECT.md specifies localStorage persistence and slide-out/modal presentation. Cart must survive page refresh. |

### 4. Checkout Form (Customer Data)

| Attribute        | Detail                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------ |
| **What**         | Form collecting customer name, phone number, delivery address                              |
| **Why Expected** | WhatsApp-dispatch requires delivery information to be collected before sending to WhatsApp |
| **Complexity**   | Low                                                                                        |
| **Dependencies** | Cart state, WhatsApp integration                                                           |
| **Notes**        | Minimal fields only — name, phone, address. Don't ask for optional data at MVP.            |

### 5. WhatsApp Link Generation

| Attribute        | Detail                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **What**         | Generate `wa.me` link with pre-filled message containing order details                                                                                 |
| **Why Expected** | This IS thecheckout — the final conversion action that sends order to store                                                                            |
| **Complexity**   | Low                                                                                                                                                    |
| **Dependencies** | Cart state, checkout form data                                                                                                                         |
| **Notes**        | Message format should include: customer name, phone, address, itemized order list, total. See PROJECT.md requirement: "mensaje prellenado del pedido". |

### 6. Responsive Layout (Mobile-First)

| Attribute        | Detail                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------- |
| **What**         | Design that works on 320px up to 1024px+ without horizontal scroll or broken layouts         |
| **Why Expected** | Target audience (craft beer consumers) browse primarily on mobile; WhatsApp is mobile-native |
| **Complexity**   | Low                                                                                          |
| **Dependencies** | None                                                                                         |
| **Notes**        | PROJECT.md specifies "mobile-first (320px → 1024px+)". This is baseline, not optional.       |

### 7. Basic Navigation (Header/Footer)

| Attribute        | Detail                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| **What**         | Navbar with logo, navigation links, cart icon with item count badge; footer with basic info        |
| **Why Expected** | Users need to know they're on a store and access cart from any page                                |
| **Complexity**   | Low                                                                                                |
| **Dependencies** | Cart state (for badge)                                                                             |
| **Notes**        | Cart badge showing item count is critical — users need to know cart is not empty without clicking. |

---

## Differentiators

Features that set this product apart from generic e-commerce. Not expected, but valued when present. These create competitive advantage.

### 1. Beer-Specific Metadata Display

| Attribute        | Detail                                                                                                                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**         | Show ABV (alcohol by volume), beer style (IPA, Stout, Lager, etc.), brewery origin, tasting notes                                                                                                                 |
| **Why Expected** | Craft beer consumers are educated about beer — they care about hop profiles, IBU, food pairings                                                                                                                   |
| **Complexity**   | Low                                                                                                                                                                                                               |
| **Dependencies** | Enhanced product data                                                                                                                                                                                             |
| **Notes**        | This differentiates craft beer from generic e-commerce. Beer people read labels. Display style and ABV prominently on product cards. Tasting notes and food pairings can live in expandable "more info" on cards. |
| **Confidence**   | MEDIUM — craft beer e-commerce sites consistently display this info; research from Beerwulf, Beer Store examples confirms                                                                                         |

### 2. WhatsApp-Native Checkout

| Attribute        | Detail                                                                                                                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**         | Entire purchase flow fits in one tap from product to WhatsApp message                                                                                                                                                            |
| **Why Expected** | WhatsApp commerce research shows 70% reduction in checkout time vs traditional e-commerce                                                                                                                                        |
| **Complexity**   | Low                                                                                                                                                                                                                              |
| **Dependencies** | All table stakes items                                                                                                                                                                                                           |
| **Notes**        | This is the core differentiator. Competitors require multiple steps: add to cart → go to cart → go to checkout → fill form → enter payment → confirm. El Profeta: add to cart → tap "pedir" → WhatsApp opens with message ready. |
| **Confidence**   | HIGH — documented across WhatsApp commerce platforms (Flowcart, MoltFlow research)                                                                                                                                               |

### 3. No Registration Required

| Attribute        | Detail                                                                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**         | Any visitor can browse and purchase without creating account                                                                                        |
| **Why Expected** | PROJECT.md explicitly removes friction — "cualquier persona puede comprar"                                                                          |
| **Complexity**   | Low                                                                                                                                                 |
| **Dependencies** | None (by design)                                                                                                                                    |
| **Notes**        | Traditional e-commerce forces registration. WhatsApp already has the customer's phone number when they message. This is a massive friction reducer. |

### 4. Featured/Rotation Products

| attribute        | detail                                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **What**         | Homepage hero section showing rotating featured beers or "new arrivals"                                                    |
| **Why Expected** | Craft beer culture values freshness and limited releases                                                                   |
| **Complexity**   | Low                                                                                                                        |
| **Dependencies** | Product data with "featured" flag                                                                                          |
| **Notes**        | PROJECT.md lists "productos destacados" in requirements. Serve as discovery mechanism before users scroll to full catalog. |

### 5. Quick Reorder from Cart Badge

| Attribute        | Detail                                                                                                                                                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**         | Repeat previous order with one tap if user returns within same session or has localStorage history                                                                                                                                                             |
| **Why Expected** | Repeat customers want "same as last time" — especially regular beer buyers                                                                                                                                                                                     |
| **Complexity**   | Medium                                                                                                                                                                                                                                                         |
| **Dependencies** | localStorage order history                                                                                                                                                                                                                                     |
| **Notes**        | This is post-MVP but valuable. Store last order in localStorage; offer "repetir último pedido" button. Requires order history persistence, which PROJECT.md marks as out of scope for MVP ("Historial de pedidos — no necesario para MVP"). Flag for post-MVP. |

---

## Anti-Features

Features to explicitly NOT build. These either violate the product constraints, add unnecessary complexity, or don't match the WhatsApp-dispatch model.

### 1. Online Payment Processing

| Attribute              | Detail                                                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**               | Credit card, Stripe, PayPal, or any in-app payment integration                                                                                                 |
| **Why Avoid**          | Explicitly out of scope per PROJECT.md: "Sin sistema de pago online — 100% WhatsApp". Adding payment contradicts the entire model and adds backend complexity. |
| **What To Do Instead** | WhatsApp with pre-filled order details; customer pays on delivery or transfers via WhatsApp conversation                                                       |
| **Confidence**         | HIGH — explicitly defined in project constraints                                                                                                               |

### 2. User Accounts / Authentication

| Attribute              | Detail                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| **What**               | Registration flow, login, password reset, user profiles                                       |
| **Why Avoid**          | PRODUCT.md explicitly: "Autenticación / cuentas de usuario — cualquier persona puede comprar" |
| **What To Do Instead** | Leverage WhatsApp as identity; orders come from real phone numbers                            |
| **Confidence**         | HIGH — explicitly defined in project constraints                                              |

### 3. Separate Product Detail Pages

| Attribute              | Detail                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| **What**               | Click on product card → dedicated page with full description, images, specs                            |
| **Why Avoid**          | PROJECT.md: "Página de detalle de producto — se muestra todo en la card". Adds navigation friction.    |
| **What To Do Instead** | All relevant info (name, image, price, style, ABV, quantity selector) visible on card without clicking |
| **Confidence**         | HIGH — explicitly defined in project constraints                                                       |

### 4. Admin Dashboard / CMS

| Attribute              | Detail                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **What**               | Backend admin panel for managing products, viewing orders, analytics               |
| **Why Avoid**          | PROJECT.md: "CMS / Admin — post-MVP (Supabase)". Budget is $0 — free-tier only.    |
| **What To Do Instead** | Manage products by editing JSON file; view orders in WhatsApp; manual coordination |
| **Confidence**         | HIGH — explicitly defined in project constraints                                   |

### 5. Product Search

| Attribute              | Detail                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **What**               | Search bar to find products by name                                                        |
| **Why Avoid**          | PROJECT.md: "Búsqueda de productos — filtrado post-MVP". With 8 beers, grid is scrollable. |
| **What To Do Instead** | Scroll catalog; filtering by style can come post-MVP                                       |
| **Confidence**         | HIGH — explicitly defined in project constraints                                           |

### 6. Product Reviews / Ratings

| Attribute              | Detail                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| **What**               | User-generated star ratings or text reviews on products                                         |
| **Why Avoid**          | PROJECT.md: "Reviews/ratings — no necesario para MVP". Adds complexity and requires moderation. |
| **What To Do Instead** | Trust signal through beer-specific metadata (ABV, style) instead of social proof                |
| **Confidence**         | HIGH — explicitly defined in project constraints                                                |

### 7. Multi-Variant Products (Sizes, Packs)

| Attribute              | Detail                                                                         |
| ---------------------- | ------------------------------------------------------------------------------ |
| **What**               | Same beer available in 330ml, 500ml, 6-pack, 12-pack options                   |
| **Why Avoid**          | PRODUCT.md shows single products without variant logic. Keep MVP simple.       |
| **What To Do Instead** | Each SKU is a distinct product entry; user adds multiple units of same product |
| **Confidence**         | MEDIUM — implied by JSON data structure in PROJECT.md                          |

---

## Feature Dependencies

The following dependency tree shows what must be built before what:

```
Product Data (JSON) → Product Catalog Grid → Product Card → Shopping Cart → Checkout Form → WhatsApp Link
       ↓                    ↓                ↓              ↓              ↓
  Responsive Layout ← Navigation (Header/Footer) ← Cart Badge
```

Detailed:

| Feature                   | Depends On                                      |
| ------------------------- | ----------------------------------------------- |
| Product Catalog Grid      | Product Data (JSON), Responsive Layout          |
| Product Card              | Product Data, Responsive Layout                 |
| Shopping Cart             | Product Card                                    |
| Cart Badge                | Shopping Cart, Navigation                       |
| Checkout Form             | Shopping Cart                                   |
| WhatsApp Link Generation  | Checkout Form, Shopping Cart                    |
| Featured Products Section | Product Data (with featured flag), Product Card |

---

## MVP Feature Recommendation

Based on the feature landscape and PROJECT.md constraints:

### Priority 1: Table Stakes (Ship in Order)

1. **Product grid** with 8 beers from `data/products.json`
2. **Product cards** with image, name, price, style, ABV, quantity selector
3. **Shopping cart** persisted to localStorage
4. **Checkout form** (name, phone, address)
5. **WhatsApp link** with pre-filled message
6. **Navbar** with logo, links, cart icon + badge
7. **Responsive layout** mobile-first

### Priority 2: Differentiators (Ship if Time Permits)

1. **Beer metadata** — Display style and ABV prominently; tasting notes in expandable section
2. **Featured products** — Hero section with rotating selection
3. **No registration** — Ensure flow works without any account creation

### Priority 3: Defer Entirely

- Online payment (anti-feature)
- User accounts (anti-feature)
- Product search (anti-feature)
- Reviews (anti-feature)
- Admin/CMS (anti-feature)
- Reorder functionality (post-MVP differentiator)

---

## Confidence Assessment

| Area                 | Confidence | Notes                                                                                                            |
| -------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| Table Stakes         | HIGH       | Derived from PROJECT.md requirements + generic e-commerce patterns                                               |
| Differentiators      | MEDIUM     | WhatsApp-specific advantages well-documented in commerce research; beer metadata common in craft beer e-commerce |
| Anti-Features        | HIGH       | All explicitly defined in PROJECT.md out-of-scope section                                                        |
| Dependencies         | HIGH       | Standard e-commerce flow; clear dependency chain                                                                 |
| Complexity Estimates | MEDIUM     | Based on generic e-commerce patterns adapted to specific constraints                                             |

---

## Sources

| Source                                                                       | Date       | Confidence     |
| ---------------------------------------------------------------------------- | ---------- | -------------- |
| Beerwulf: How to Build a Successful Online Beer Store                        | 2024-01-10 | MEDIUM         |
| Beer Shopping Web Application — Successful Development Story                 | 2024-08-23 | MEDIUM         |
| WhatsApp Checkout & Cart Flows: A Guide for Modern Ecommerce 2026 (Flowcart) | 2026       | HIGH           |
| WhatsApp for E-commerce: Complete Guide (ActiveCampaign)                     | 2025-11-20 | HIGH           |
| Conversational Commerce on WhatsApp: Full Guide (MoltFlow)                   | 2026-02-25 | HIGH           |
| PROJECT.md — El Profeta store requirements                                   | 2026-04-26 | HIGH (primary) |

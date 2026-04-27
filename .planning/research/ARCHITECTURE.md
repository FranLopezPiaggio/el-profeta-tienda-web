# Architecture Research

**Domain:** Craft Beer E-Commerce (Minimal/MVP)
**Researched:** 2026-04-26
**Confidence:** MEDIUM — Research based on industry patterns scaled to MVP constraints

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Homepage   │  │  Catalog    │  │  Cart       │             │
│  │  (Hero)     │  │  (Grid)     │  │  (Slide-out)│             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STATE LAYER                                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              Cart State (React Context + localStorage)       │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CHECKOUT LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Form     │  │  Validator  │  │ WhatsApp   │             │
│  │  (Local)   │  │  (Zod)     │  │  Dispatch │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────��───────────────────────────────────────────────────────────┐
│                    DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                                 │
│  │ Products  │  │  Order     │                                 │
│  │ (JSON)    │  │  (wa.me)   │                                 │
│  └─────────────┘  └─────────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component         | Responsibility                                    | Typical Implementation        |
| ----------------- | ------------------------------------------------- | ----------------------------- |
| Homepage          | Hero section, featured products, conversion entry | Static Server Component       |
| Product Catalog   | Grid display of products with search              | Static Server Component       |
| Product Card      | Image, name, price, quantity selector             | Client Component              |
| Cart Slide-out    | Item list, totals, quantity editing               | Client Component with Context |
| Cart State        | Cart items, totals, persistence                   | React Context + localStorage  |
| Checkout Form     | Customer info capture                             | Client Component              |
| WhatsApp Dispatch | Message generation, wa.me link                    | Utility function              |
| Product Data      | Static JSON imports                               | Server Component data         |

## Recommended Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Tailwind + design tokens
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   ├── cart/
│   │   ├── CartProvider.tsx   # React Context + localStorage
│   │   ├── CartButton.tsx
│   │   └── CartSlideout.tsx
│   └── checkout/
│       └── CheckoutForm.tsx
├── data/
│   └── products.json           # Static product data
├── lib/
│   ├── cart.ts              # Cart state utilities
│   ├── whatsapp.ts         # wa.me message generation
│   └── validation.ts       # Zod schemas
├── types/
│   └── index.ts            # TypeScript types
└── context/
    └── CartContext.tsx     # Cart React Context
```

### Structure Rationale

- **components/layout/:** Navigation components separated by concern
- **components/product/:** Product display components isolated for reusability
- **components/cart/:** Cart-specific components with state management co-located
- **data/:** Static JSON products — MVP approach, no backend needed
- **lib/:** Utility functions separated for testability
- **types/:** Centralized TypeScript definitions
- **context/:** React Context provider for cart state

## Architectural Patterns

### Pattern 1: Static Catalog + Client Cart

**What:** Products rendered server-side from static JSON, cart managed client-side with React Context
**When to use:** MVP with no database, simple product catalog
**Trade-offs:** Zero server cost, instant page loads — no real-time inventory, manual price updates in JSON

```typescript
// src/data/products.json
[
  {
    "id": "lager",
    "name": "El Profeta Lager",
    "price": 2500,
    "image": "/products/lager.png",
    "category": "lager"
  }
]

// src/app/page.tsx (Server Component)
import products from '@/data/products.json'

export default function Homepage() {
  return (
    <ProductGrid products={products} />
  )
}
```

### Pattern 2: Cart State with localStorage Persistence

**What:** React Context wraps cart state, syncs to localStorage on every change
**When to use:** Simple e-commerce without account system
**Trade-offs:** Works across sessions, clears on browser data — no cloud sync, lost on device change

```typescript
// src/components/cart/CartProvider.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type CartItem = {
  id: string
  quantity: number
  price: number
}

type CartState = {
  items: CartItem[]
  total: number
}

const CartContext = createContext<CartState>({ items: [], total: 0 })

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  // Persist on every change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  return (
    <CartContext.Provider value={{ items, total: items.reduce((sum, i) => sum + i.price * i.quantity, 0) }}>
      {children}
    </CartContext.Provider>
  )
}
```

### Pattern 3: WhatsApp Click-to-Chat Checkout

**What:** Generated wa.me URL with pre-filled message containing order details
**When to use:** Low-budget MVP, WhatsApp as the only communication channel
**Trade-offs:** Zero payment processing, free — limits payment options, manual order fulfillment

```typescript
// src/lib/whatsapp.ts
export function generateWhatsAppLink(phone: string, message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

// Message format example:
// "Hola El Profeta!
// quiero comprar:
// - 2x El Profeta Lager
// - 1x El Profeta IPA
// Total: $7,500
//
// Nombre: Juan
// Teléfono: 5491112345678
// Dirección: Calle Falsa 123"
```

### Pattern 4: Partial Prerendering for Performance

**What:** Static shell renders immediately, interactive components hydrate behind Suspense
**When to use:** Next.js 15 with App Router, performance-critical pages
**Trade-offs:** Fast LCP, slightly more complex — may cause layout shift if not careful

```typescript
// Partial prerendering pattern
import { Suspense } from 'react'
import { CartButton } from '@/components/cart/CartButton'
import { ProductGrid } from '@/components/product/ProductGrid'

export default function Homepage() {
  return (
    <div>
      {/* Static shell - instant render */}
      <Hero />
      <Suspense fallback={<ProductGridSkeleton />}>
        {/* Streaming component */}
        <ProductGrid />
      </Suspense>
      <Suspense fallback={<CartButtonSkeleton />}>
        <CartButton />
      </Suspense>
    </div>
  )
}
```

## Data Flow

### Request Flow

```
[User Browses Site]
    ↓
[Server Component Renders] → [Static HTML Served]
    ↓
[User Adds to Cart]
    ↓
[CartButton onClick] → [Context Dispatch] → [localStorage Update]
    ↓
[User Opens Cart] → [Cart Slideout Renders] → [Items from Context]
    ↓
[User Fills Checkout Form] → [Validation Check] → [WhatsApp Link Generated]
    ↓
[User Clicks Link] → [Opens WhatsApp] → [Manual Order Processing]
```

### State Management

```
[CartContext]
    ↓ (subscribe)
[Navbar (cart badge)] ← [CartButton] ← [ProductCard]
        ↑                    ↑
    [CartSlideout]      [CheckoutForm]
        ↑                    ↑
    [Reducers/Actions] → [setItems, setQuantity, clearCart] → [CartContext]
```

### Key Data Flows

1. **Product Display:** JSON → ProductGrid → ProductCard → Browser
2. **Cart Addition:** ProductCard click → Context addItem → localStorage sync → UI update
3. **Checkout Submission:** Form submit → validation → wa.me link → WhatsApp client open
4. **Order Fulfillment:** Customer message in WhatsApp → Manual processing

## Scaling Considerations

| Scale             | Architecture Adjustments                   |
| ----------------- | ------------------------------------------ |
| 0-100 products    | Static JSON — no database needed           |
| 100-1000 products | Consider Supabase or lightweight CMS       |
| 1000+ products    | Full search, filtering needed, add backend |
| 10-50 orders/day  | WhatsApp manual — viable                   |
| 50+ orders/day    | Need order management, automated tracking  |
| 100+ orders/day   | Consider full backend, payment integration |

### Scaling Priorities

1. **First bottleneck:** Cart data loss (cleared browser) — add Supabase for persistence
2. **Second bottleneck:** Manual WhatsApp processing at scale — add order status tracking
3. **Third bottleneck:** Product updates (manual JSON edit) — add CMS layer
4. **Fourth bottleneck:** Payment friction — add Stripe/payment integration

## Anti-Patterns

### Anti-Pattern 1: Backend for Everything

**What people do:** Building full Express/Django backend for MVP with 8 products
**Why it's wrong:** $0 budget constraint violated, over-engineering increases time-to-launch
**Do this instead:** Use static JSON, localStorage, WhatsApp as checkout

### Anti-Pattern 2: Over-Engineered State

**What people do:** Redux Toolkit for 10-item cart, TanStack Query for static products
**Why it's wrong:** Complex tooling for trivial state, unnecessary bundle bloat
**Do this instead:** React Context for cart, direct JSON import for products

### Anti-Pattern 3: Missing Cart Persistence

**What people do:** Cart state only in memory, lost on page refresh
**Why it's wrong:** High abandon rate — users expect cart persistence
**Do this instead:** localStorage sync in useEffect

### Anti-Pattern 4: No Form Validation

**What people do:** Submitting WhatsApp message without phone/address validation
**Why it's wrong:** Unfulfillable orders, manual back-and-forth
**Do this instead:** Zod validation before message generation

## Integration Points

### External Services

| Service            | Integration Pattern                       | Notes                         |
| ------------------ | ----------------------------------------- | ----------------------------- |
| WhatsApp Cloud API | wa.me deep links (MVP), Webhook for scale | Free tier sufficient for MVP  |
| WhatsApp Business  | Same as above                             | For order management at scale |
| Vercel             | Edge deployment                           | Free tier sufficient          |

### Internal Boundaries

| Boundary                              | Communication        | Notes                              |
| ------------------------------------- | -------------------- | ---------------------------------- |
| Server Components ↔ Client Components | Props + children     | Use 'use client' only where needed |
| CartContext ↔ Cart Components         | React Context        | Single source of truth             |
| CheckoutForm ↔ WhatsApp               | generateWhatsAppLink | Pure function, no side effects     |

## Build Order Recommendations

Based on dependency analysis:

```
Phase 1: Foundation
├── Setup Next.js 15 + Tailwind
├── Design tokens + global styles
├── Product types + JSON data
└── Static product grid display

Phase 2: Cart System
├── CartContext with localStorage
├── Add-to-cart functionality
├── Cart slideout UI
└── Cart badge in navbar

Phase 3: Checkout Flow
├── Checkout form UI
├── Form validation (Zod)
├── WhatsApp message generation
└── wa.me link integration

Phase 4: Polish
├── Animations (Framer Motion optional)
├── Error boundaries
├── Loading states
└── Mobile responsiveness verification
```

### Why This Order

- **Foundation first:** No cart without products to display
- **Cart before checkout:** Can't test checkout flow without cart
- **Checkout last:** Depends on both catalog and cart working
- **Polish end:** Adds polish to working core features

## Sources

- [Headless Shopify with Next.js — Complete Build Guide 2026](https://samcheek.com/blog/headless-shopify-nextjs-complete-build-guide-2026) — HIGH
- [Next.js commerce in 2026: patterns and architecture](https://gmi.software/blog/nextjs-commerce-production-patterns-2026) — HIGH
- [Modern Beer E-Commerce Store — Headless Shopify with Next.js](https://www.outofplace.space/en/browar-tarnobrzeg) — MEDIUM
- [WhatsApp E-commerce Flow Starter Kit](https://blog.izndgroup.com/2026/02/how-to-whatsapp-e-commerce-flow-starter.html) — HIGH
- [Headless Commerce: Next.js Storefront Dev Guide](https://www.digitalapplied.com/blog/headless-commerce-nextjs-storefront-development-guide) — HIGH

---

_Architecture research for: Craft Beer E-Commerce MVP_
_Researched: 2026-04-26_

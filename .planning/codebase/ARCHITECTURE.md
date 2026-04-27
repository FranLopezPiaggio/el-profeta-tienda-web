# Architecture

**Analysis Date:** 2026-04-26

## Pattern

**Next.js 15 App Router (Server Components)** — The project follows the Next.js App Router pattern with:

- Server components for static content (homepage, catalog)
- Client components for interactive elements (cart, product cards)
- File-based routing via `app/` directory

## Layers

| Layer          | Responsibility                          | Location                                                                                      |
| -------------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| **App Router** | File-based routing, layout composition  | `app/` (planned)                                                                              |
| **Pages**      | Route handlers, server components       | `app/page.tsx`, `app/catalog/page.tsx` (planned)                                              |
| **Components** | UI building blocks organized by feature | `components/layout/`, `components/home/`, `components/catalog/`, `components/cart/` (planned) |
| **Context**    | Global cart state management            | `context/CartContext.tsx` (planned)                                                           |
| **Data**       | Product data retrieval                  | `data/products.json` (exists)                                                                 |
| **Lib**        | Utility functions                       | `lib/whatsapp.ts` (planned)                                                                   |

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  data/products  │────▶│   Components    │────▶│  CartContext    │
│     .json       │     │ (ProductCard)   │     │ (React Context) │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                           │
                                                           ▼
                                                   ┌─────────────────┐
                                                   │  localStorage   │
                                                   │ (persistence)   │
                                                   └────────┬────────┘
                                                            │
                                                            ▼
                                                   ┌─────────────────┐
                                                   │   WhatsApp      │
                                                   │   Dispatch      │
                                                   │ (wa.me URL)     │
                                                   └─────────────────┘
```

1. Products loaded from `data/products.json` (static JSON import)
2. ProductCard components render product info with quantity selectors
3. CartContext manages cart state across the app (React Context API)
4. Cart persists to localStorage on every change (`el-profeta-cart` key)
5. Checkout generates WhatsApp message and opens wa.me link

## State Management

**Approach:** React Context + localStorage

| State            | Management                        | Location                            |
| ---------------- | --------------------------------- | ----------------------------------- |
| Cart items       | CartContext (React.createContext) | `context/CartContext.tsx` (planned) |
| Cart persistence | localStorage with useEffect sync  | Implemented in CartContext          |
| Product data     | Static JSON import                | `data/products.json` (exists)       |

**Key Patterns:**

- CartContext provides: `cart`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `total`
- localStorage key: `el-profeta-cart`
- Hydration on mount to restore cart after page refresh

## Routing

**Structure (Next.js App Router):**

| Route       | Component            | Type                       |
| ----------- | -------------------- | -------------------------- |
| `/`         | Homepage + Hero      | Server Component           |
| `/catalog`  | Product Grid         | Server Component           |
| `/cart`     | Cart sidebar (modal) | Client Component           |
| `/checkout` | Checkout form        | Client Component (planned) |

**Navigation Flow:**

1. Homepage (`/`) → Hero CTA → `/catalog`
2. Navbar cart icon → Cart sidebar (slide-out)
3. Cart "Finalizar compra" → Checkout form
4. Checkout submit → WhatsApp dispatch

## Component Composition

**Pattern:** Feature-based organization with clear separation

```
components/
├── layout/         # Layout components (Navbar, Footer)
├── home/          # Homepage-specific (Hero)
├── catalog/       # Catalog-specific (ProductGrid, ProductCard)
└── cart/          # Cart-specific (CartSidebar, CheckoutForm)
```

**Composition Patterns:**

- **Navbar**: Logo + nav links + cart icon with badge
- **ProductGrid**: Responsive grid (1/2/3/4 columns based on viewport)
- **ProductCard**: Image + info + quantity selector + add button
- **CartSidebar**: Slide-out modal with item list + totals
- **CheckoutForm**: Customer info form → WhatsApp message generation

## API Design

**Current:** No backend API — data sourced from static JSON

| Endpoint | Type             | Data Source                    |
| -------- | ---------------- | ------------------------------ |
| Products | Static import    | `data/products.json`           |
| Cart     | Client-side only | React Context + localStorage   |
| Checkout | External         | `wa.me/{phone}?text={message}` |

**Future (Post-MVP):**

- Supabase for product data and persistence
- REST/GraphQL API routes under `/api`
- Admin routes under `/admin` for CMS

## Technical Constraints

| Constraint          | Impact                                             |
| ------------------- | -------------------------------------------------- |
| No Supabase in MVP  | Products stored in JSON, cart in localStorage      |
| No authentication   | Anyone can browse and purchase                     |
| WhatsApp as backend | Order dispatch via wa.me links, no payment gateway |
| $0 budget           | Free-tier only, minimal external dependencies      |

---

_Architecture analysis: 2026-04-26_

# Conventions

**Analysis Date:** 2026-04-26

This document describes the coding conventions for the El Profeta e-commerce project. Since the project is in early stages with no source code yet, these conventions are derived from the project specifications, design system, and agent skills.

---

## Language

| Context                       | Language | Example                                    |
| ----------------------------- | -------- | ------------------------------------------ |
| **UI Labels, buttons, menus** | Spanish  | "Agregar al carrito", "Finalizar compra"   |
| **Code, variables, paths**    | English  | `ProductCard`, `addToCart`, `app/page.tsx` |

---

## Naming Conventions

| Type           | Pattern                                           | Example                                                   |
| -------------- | ------------------------------------------------- | --------------------------------------------------------- |
| **Components** | PascalCase                                        | `Navbar.tsx`, `ProductCard.tsx`, `CartSidebar.tsx`        |
| **Functions**  | camelCase                                         | `addItem()`, `updateQuantity()`, `generateWhatsAppLink()` |
| **Variables**  | camelCase                                         | `cartItems`, `totalPrice`, `isOpen`                       |
| **Constants**  | PascalCase (if component-like) or UPPER_SNAKE     | `WhatsAppConfig`, `MAX_QUANTITY`                          |
| **Files**      | kebab-case for configs, PascalCase for components | `tailwind.config.ts`, `CartContext.tsx`                   |
| **Interfaces** | PascalCase with descriptive suffix                | `Product`, `CartItem`, `CheckoutFormData`                 |
| **Types**      | PascalCase                                        | `Category`, `ProductCategory`                             |
| **Routes**     | kebab-case                                        | `app/catalog/page.tsx`, `app/checkout/page.tsx`           |

---

## File Structure

```
/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout + fonts
│   ├── page.tsx              # Homepage
│   ├── globals.css           # Tailwind + custom styles
│   ├── catalog/
│   │   └── page.tsx          # Product grid
│   └── checkout/
│       └── page.tsx          # Checkout form
├── components/               # Feature-based organization
│   ├── layout/               # Navbar, Footer
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/                 # Homepage components
│   │   └── Hero.tsx
│   ├── catalog/              # Catalog components
│   │   ├── ProductGrid.tsx
│   │   └── ProductCard.tsx
│   └── cart/                 # Cart components
│       ├── CartSidebar.tsx
│       └── CheckoutForm.tsx
├── context/                  # React Context
│   └── CartContext.tsx       # Cart state + localStorage
├── data/                    # Static data
│   └── products.json         # Product catalog
└── lib/                     # Utility functions
    └── whatsapp.ts           # wa.me URL generation
```

---

## Code Style

### TypeScript

- **No `any`** — All props and variables must have explicit types
- Use interfaces for component props and data models
- Use TypeScript strict mode

### Tailwind CSS

- Use design tokens from `design-system/MASTER.md`
- Primary color: `gray-900` (#111827)
- Background: `white`
- Fonts: `Playfair Display` (headings), `Montserrat` (body)
- Mobile-first responsive design

### Component Patterns

**Server Components (default):**

- Use for static content (homepage, catalog)
- Can be async for data fetching

**Client Components:**

- Use `'use client'` directive for interactive elements
- Cart, product cards with quantity selectors, forms
- Components that use hooks (`useState`, `useEffect`, `useContext`)

**Component structure:**

```tsx
interface ComponentProps {
  // typed props
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // JSX
}
```

---

## Import Patterns

```typescript
// External
import { useState, useEffect } from "react";
import { ShoppingCart, X } from "lucide-react";

// Internal - components
import { ProductCard } from "@/components/catalog/ProductCard";

// Internal - context
import { useCart } from "@/context/CartContext";

// Internal - data
import products from "@/data/products.json";

// Internal - lib
import { generateWhatsAppLink } from "@/lib/whatsapp";
```

**Path Aliases:**

- `@/` — Root alias (configured in `tsconfig.json`)

---

## Design System Tokens

From `.agents/design-system/MASTER.md`:

### Colors

| Token      | Hex     | Usage                           |
| ---------- | ------- | ------------------------------- |
| `gray-900` | #111827 | Headings, primary text, buttons |
| `gray-600` | #4B5563 | Secondary text                  |
| `gray-400` | #9CA3AF | Muted text, placeholders        |
| `gray-200` | #E5E7EB | Borders, dividers               |
| `white`    | #FFFFFF | Background                      |

### Typography

- Headings: `Playfair Display`, serif
- Body: `Montserrat`, sans-serif

### Spacing

- Use Tailwind spacing scale (`gap-4`, `p-6`, etc.)
- Follow design system spacing tokens for consistency

---

## State Management

### Cart Context Pattern

```typescript
// CartContext provides:
interface CartContextValue {
  cart: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}
```

### localStorage

- Key: `el-profeta-cart`
- Sync on every cart change via `useEffect`
- Hydrate on mount

---

## Component Guidelines

- **One component per file** — No multiple exports
- **Feature-based organization** — Components grouped by feature, not type
- **Props interfaces** — Always define explicit types
- **Lucide icons** — Use Lucide React (not emojis)
- **Responsive** — Mobile-first, test at 320px, 768px, 1024px+
- **Touch targets** — Minimum 44px for mobile

---

## Anti-Patterns

- ❌ Using `any` type
- ❌ Hardcoded colors (use design tokens)
- ❌ Emojis as icons
- ❌ Missing hover/focus states
- ❌ Server Components with hooks
- ❌ Large components (>200 lines consider splitting)

---

## Commit Style

Not yet defined. The project uses GSD (Getting Stuff Done) workflow with phase-based commits.

---

_Conventions derived from: PRD.md, design-system/MASTER.md, AGENTS.md, and Next.js best practices skills_

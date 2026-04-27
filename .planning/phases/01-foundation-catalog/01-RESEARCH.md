# Phase 1: Foundation & Catalog - Research

**Researched:** 2026-04-27
**Phase:** 1 - Foundation & Catalog

## Technical Approach

### Core Technologies

| Technology | Decision | Rationale |
|-----------|----------|----------|
| Next.js 15 | App Router (file-based) | Per AGENTS.md stack |
| Tailwind CSS | v4 via @tailwindcss/postcss | Per AGENTS.md stack |
| React 19 | From Next.js 15 | Server components for static pages |
| State | React useState (Phase 1) | No cart yet - minimal state needed |
| Persistence | localStorage | For age gate only |

### Implementation Patterns

#### Page Structure (App Router)

```
app/
├── layout.tsx        # Root layout, fonts, global styles
├── page.tsx          # Homepage (/)
├── catalogo/
│   └── page.tsx      # Catalog page (/catalogo)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   └── Hero.tsx
│   ├── catalog/
│   │   ├── ProductGrid.tsx
│   │   └── ProductCard.tsx
│   └── gate/
│       └── AgeGate.tsx
```

#### App Router Conventions

- `app/layout.tsx` - Root layout with HTML shell, metadata, fonts
- `app/page.tsx` - Homepage (/) - Server Component
- `app/catalogo/page.tsx` - Catalog route - Server Component
- Client components marked with `'use client'` directive

#### Fonts (per AGENTS.md)

```typescript
// app/layout.tsx
import { Playfair_Display, Montserrat } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })
const montserrat = Montserrat({ subsets: ['latin'] })
```

#### Responsive Breakpoints (per requirements)

| Breakpoint | Width | Grid Columns |
|-----------|-------|--------------|
| mobile | 320px | 1 col |
| tablet | 768px | 2 col |
| desktop | 1024px+ | 3-4 col |

Tailwind classes:
```css
/* Mobile first */
grid-cols-1        /* 320px */
md:grid-cols-2     /* 768px */
lg:grid-cols-3     /* 1024px */
xl:grid-cols-4     /* 1280px+ */
```

#### Age Gate Pattern

```typescript
// components/gate/AgeGate.tsx
'use client'

import { useState, useEffect } from 'react'

const AGE_KEY = 'el-profeta-age-confirmed'

export function AgeGate() {
  const [confirmed, setConfirmed] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(AGE_KEY)
    if (stored === 'true') {
      setConfirmed(true)
    }
    setChecked(true)
  }, [])

  const handleConfirm = () => {
    localStorage.setItem(AGE_KEY, 'true')
    setConfirmed(true)
  }

  if (!checked) return null  // or loading state
  if (confirmed) return null  // don't render if confirmed

  return (
    <banner>
      <button onClick={handleConfirm}>Confirmo que soy mayor de 18 años</button>
    </banner>
  )
}
```

#### Product Card Pattern

```typescript
// components/catalog/ProductCard.tsx
'use client'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description?: string
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (quantity: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <product-card>
      <img src={product.image} alt={product.name} />
      <name>{product.name}</name>
      <price>${product.price}</price>
      <category>{product.category}</category>
      <quantity-selector>
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(q => Math.min(99, q + 1))}>+</button>
      </quantity-selector>
      <button onClick={() => onAddToCart?.(quantity)}>
        Agregar al carrito
      </button>
    </product-card>
  )
}
```

#### Product Data Loading

```typescript
// app/catalogo/page.tsx (Server Component)
import productsData from '@/data/products.json'

export default function CatalogPage() {
  const products = productsData.products

  return (
    <main>
      <ProductGrid products={products} />
    </main>
  )
}
```

### Design System (per AGENTS.md)

| Element | Token | Value |
|---------|-------|-------|
| Headings | `font-serif` | Playfair Display |
| Body | `font-sans` | Montserrat |
| Primary | `text-gray-900` | #111827 |
| Background | `bg-white` | #FFFFFF |
| Borders | `border-gray-200` | #E5E7EB |

### File Dependencies

1. `data/products.json` - Already exists with 8 beers
2. No Supabase - static JSON per MVP scope

### Validation Approach

**Build verification:**
```bash
npm run build    # No TypeScript errors
```

**Component testing:**
- Homepage at `/` - loads without crash
- Catalog at `/catalogo` - shows 8 products
- Age gate - shows on fresh visit, hides after confirm
- Responsive - no horizontal scroll at 320px

---

*Research complete: 2026-04-27*
*Researcher: gsd-phase-researcher*
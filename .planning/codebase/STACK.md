# Technology Stack

**Analysis Date:** 2026-04-26

## Languages

- **TypeScript** — Primary language for all application code
- **JavaScript** — For configuration files

## Frameworks

- **Next.js 15** (App Router) — React framework with server components, file-based routing
- **React 19** — UI library (included with Next.js 15)

## Key Dependencies

| Package                 | Version             | Purpose                     |
| ----------------------- | ------------------- | --------------------------- |
| `next`                  | 15.x                | Next.js framework           |
| `react`                 | 19.x (from Next.js) | UI library                  |
| `react-dom`             | 19.x (from Next.js) | React DOM renderer          |
| `tailwindcss`           | latest              | Utility-first CSS framework |
| `lucide-react`          | latest              | Icon library                |
| `@supabase/supabase-js` | planned (post-MVP)  | Supabase client             |

## Build & Dev Tools

- **TypeScript** — Type checking and IDE support
- **ESLint** — Code linting (included with Next.js)
- **PostCSS** — CSS processing for Tailwind
- **Google Fonts** — Montserrat + Payfair Display (via next/font)

## Package Manager

**npm** (Next.js default)

## Runtime

**Node.js** (version compatible with Next.js 15, typically 18.x+)

## Skills Configured

| Skill                              | Source                        | Purpose             |
| ---------------------------------- | ----------------------------- | ------------------- |
| `next-best-practices`              | vercel-labs/next-skills       | Next.js patterns    |
| `tailwind-css-patterns`            | gtriscioglio/developer-kit    | Tailwind utilities  |
| `vercel-react-best-practices`      | vercel-labs/agent-skills      | React patterns      |
| `supabase-postgres-best-practices` | supabase/agent-skills         | Database patterns   |
| `frontend-design`                  | anthropics/skills             | UI design patterns  |
| `accessibility`                    | addyosmani/web-quality-skills | WCAG compliance     |
| `seo`                              | addyosmani/web-quality-skills | Search optimization |

## Intended Structure

```
el-profeta-tienda-web/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── catalog/            # Catalog route
├── components/             # React components
│   ├── layout/             # Navbar, Footer
│   ├── home/               # Hero
│   ├── catalog/            # ProductCard, ProductGrid
│   └── cart/               # CartSidebar, CheckoutForm
├── context/                # React Context
│   └── CartContext.tsx     # Cart state management
├── data/                   # Static data
│   └── products.json       # Product catalog
└── lib/                    # Utilities
    └── whatsapp.ts         # WhatsApp link generation
```

---

_Stack analysis: 2026-04-26_

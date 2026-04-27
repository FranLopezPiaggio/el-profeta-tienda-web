<!-- GSD:project-start source:PROJECT.md -->

## Project

**El Profeta — Craft Beer Online Store**

Una tienda online minimalista para la marca de cerveza artesanal "El Profeta" donde los clientes pueden navegar el catálogo, agregar productos al carrito, y realizar pedidos que se despachan directamente por WhatsApp. Sin registro, sin pago online — solo catálogo, carrito, y WhatsApp.

**Core Value:** El cliente puede pedir una cerveza en menos de 2 minutos desde que entra a la tienda.

### Constraints

- **Budget**: $0 — free-tier only, sin gastos en servicios externos
- **Data Source**: JSON estático (no Supabase en MVP)
- **Backend**: Ninguno — WhatsApp como canal de pedidos
- **Auth**: Sin autenticación — acceso abierto a cualquier visitante
- **Delivery**: Sin sistema de delivery propio — coordinación manual por WhatsApp
- **Tech Stack**: Next.js 15, Tailwind CSS, Zustand + localStorage (research: Zustand preferred over React Context for cart to avoid re-render cascade)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

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

## Runtime

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

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Language

| Context                       | Language | Example                                    |
| ----------------------------- | -------- | ------------------------------------------ |
| **UI Labels, buttons, menus** | Spanish  | "Agregar al carrito", "Finalizar compra"   |
| **Code, variables, paths**    | English  | `ProductCard`, `addToCart`, `app/page.tsx` |

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

## File Structure

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

- Use for static content (homepage, catalog)
- Can be async for data fetching
- Use `'use client'` directive for interactive elements
- Cart, product cards with quantity selectors, forms
- Components that use hooks (`useState`, `useEffect`, `useContext`)

## Import Patterns

- `@/` — Root alias (configured in `tsconfig.json`)

## Design System Tokens

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

## State Management

### Cart Context Pattern

### localStorage

- Key: `el-profeta-cart`
- Sync on every cart change via `useEffect`
- Hydrate on mount

## Component Guidelines

- **One component per file** — No multiple exports
- **Feature-based organization** — Components grouped by feature, not type
- **Props interfaces** — Always define explicit types
- **Lucide icons** — Use Lucide React (not emojis)
- **Responsive** — Mobile-first, test at 320px, 768px, 1024px+
- **Touch targets** — Minimum 44px for mobile

## Anti-Patterns

- ❌ Using `any` type
- ❌ Hardcoded colors (use design tokens)
- ❌ Emojis as icons
- ❌ Missing hover/focus states
- ❌ Server Components with hooks
- ❌ Large components (>200 lines consider splitting)

## Commit Style

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## Pattern

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

```

## State Management

| State            | Management                        | Location                            |
| ---------------- | --------------------------------- | ----------------------------------- |
| Cart items       | CartContext (React.createContext) | `context/CartContext.tsx` (planned) |
| Cart persistence | localStorage with useEffect sync  | Implemented in CartContext          |
| Product data     | Static JSON import                | `data/products.json` (exists)       |

- CartContext provides: `cart`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `total`
- localStorage key: `el-profeta-cart`
- Hydration on mount to restore cart after page refresh

## Routing

| Route       | Component            | Type                       |
| ----------- | -------------------- | -------------------------- |
| `/`         | Homepage + Hero      | Server Component           |
| `/catalog`  | Product Grid         | Server Component           |
| `/cart`     | Cart sidebar (modal) | Client Component           |
| `/checkout` | Checkout form        | Client Component (planned) |

## Component Composition

```

```

- **Navbar**: Logo + nav links + cart icon with badge
- **ProductGrid**: Responsive grid (1/2/3/4 columns based on viewport)
- **ProductCard**: Image + info + quantity selector + add button
- **CartSidebar**: Slide-out modal with item list + totals
- **CheckoutForm**: Customer info form → WhatsApp message generation

## API Design

| Endpoint | Type             | Data Source                    |
| -------- | ---------------- | ------------------------------ |
| Products | Static import    | `data/products.json`           |
| Cart     | Client-side only | React Context + localStorage   |
| Checkout | External         | `wa.me/{phone}?text={message}` |

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

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

| Skill                            | Description                                                                                                                                                                                                                                                                                                                                                                                                     | Path                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| accessibility                    | Audit and improve web accessibility following WCAG 2.2 guidelines. Use when asked to "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", or "make accessible".                                                                                                                                                                                            | `.agents/skills/accessibility/SKILL.md`                    |
| frontend-design                  | Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics. | `.agents/skills/frontend-design/SKILL.md`                  |
| next-best-practices              | Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling                                                                                                                                                                                                                                               | `.agents/skills/next-best-practices/SKILL.md`              |
| next-cache-components            | Next.js 16 Cache Components - PPR, use cache directive, cacheLife, cacheTag, updateTag                                                                                                                                                                                                                                                                                                                          | `.agents/skills/next-cache-components/SKILL.md`            |
| next-upgrade                     | Upgrade Next.js to the latest version following official migration guides and codemods                                                                                                                                                                                                                                                                                                                          | `.agents/skills/next-upgrade/SKILL.md`                     |
| nodejs-backend-patterns          | Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices. Use when creating Node.js servers, REST APIs, GraphQL backends, or microservices architectures.                                                                                                                    | `.agents/skills/nodejs-backend-patterns/SKILL.md`          |
| nodejs-best-practices            | "Node.js development principles and decision-making. Framework selection, async patterns, security, and architecture. Teaches thinking, not copying."                                                                                                                                                                                                                                                           | `.agents/skills/nodejs-best-practices/SKILL.md`            |
| seo                              | Optimize for search engine visibility and ranking. Use when asked to "improve SEO", "optimize for search", "fix meta tags", "add structured data", "sitemap optimization", or "search engine optimization".                                                                                                                                                                                                     | `.agents/skills/seo/SKILL.md`                              |
| supabase-postgres-best-practices | Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations.                                                                                                                                                                                                                         | `.agents/skills/supabase-postgres-best-practices/SKILL.md` |
| tailwind-css-patterns            | Provides comprehensive Tailwind CSS utility-first styling patterns including responsive design, layout utilities, flexbox, grid, spacing, typography, colors, and modern CSS best practices. Use when styling React/Vue/Svelte components, building responsive layouts, implementing design systems, or optimizing CSS workflow.                                                                                | `.agents/skills/tailwind-css-patterns/SKILL.md`            |
| typescript-advanced-types        | Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating reusable type utilities, or ensuring compile-time type safety in TypeScript projects.                                                                                                | `.agents/skills/typescript-advanced-types/SKILL.md`        |
| vercel-composition-patterns      | React composition patterns that scale. Use when refactoring components with boolean prop proliferation, building flexible component libraries, or designing reusable APIs. Triggers on tasks involving compound components, render props, context providers, or component architecture. Includes React 19 API changes.                                                                                          | `.agents/skills/vercel-composition-patterns/SKILL.md`      |
| vercel-react-best-practices      | React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.                                                                       | `.agents/skills/vercel-react-best-practices/SKILL.md`      |

<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.

<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.

<!-- GSD:profile-end -->

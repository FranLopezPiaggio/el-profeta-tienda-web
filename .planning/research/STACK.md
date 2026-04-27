# Stack Research

**Domain:** Craft Beer E-commerce MVP
**Researched:** 2026-04-26
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology   | Version           | Purpose                      | Why Recommended                                                                                                                                                                                                                                                                  |
| ------------ | ----------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js      | 15.x (App Router) | React framework with SSR/SSG | Industry standard for e-commerce in 2025/2026. SEO-friendly, fast page loads, server-side rendering critical for product pages. App Router provides better performance and caching than Pages Router.                                                                            |
| Tailwind CSS | v4.x              | Utility-first CSS framework  | Default choice across top e-commerce templates. Rapid styling, consistent design system, mobile-first responsive out of the box. v4 brings performance improvements.                                                                                                             |
| TypeScript   | 5.x               | Type-safe JavaScript         | Standard for production e-commerce. Catches errors at compile time, type safety critical for cart/product data, excellent IDE support.                                                                                                                                           |
| Zustand      | 5.x               | Global state management      | **Recommended over React Context** for cart. Industry shift in 2025/2026: Context API causes performance issues (re-renders all consumers on any change), Zustand provides selective subscriptions and built-in localStorage middleware. Perfect for e-commerce cart complexity. |

### Supporting Libraries

| Library               | Version   | Purpose                  | When to Use                                                                                               |
| --------------------- | --------- | ------------------------ | --------------------------------------------------------------------------------------------------------- |
| zustand/middleware    | (bundled) | localStorage persistence | **Always for cart** — cart persists across sessions. Zustand's `persist` middleware handles this cleanly. |
| lucide-react          | latest    | Icon library             | Navbar icons, cart badge, UI elements. Lightweight, consistent design.                                    |
| clsx / tailwind-merge | latest    | Class name utilities     | Component variants, conditional styling. Prevents class conflicts in Tailwind.                            |

### Development Tools

| Tool                   | Purpose       | Notes                                                                   |
| ---------------------- | ------------- | ----------------------------------------------------------------------- |
| ESLint + Prettier      | Code quality  | Next.js 15 project includes by default. Essential for team consistency. |
| TypeScript strict mode | Type checking | Enable for e-commerce — catches cart/price calculation errors early.    |

## Installation

```bash
# Create Next.js 15 project with TypeScript and Tailwind
npx create-next-app@latest el-profeta-tienda-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack

# Core dependencies
npm install zustand clsx tailwind-merge lucide-react

# Zustand for localStorage persistence (included in zustand, just import)
# No extra install needed
```

## Alternatives Considered

| Recommended      | Alternative                     | When to Use Alternative                                                                                                            |
| ---------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Next.js 15       | Remix                           | If team prefers traditional SSR model, less caching complexity. Next.js wins for e-commerce SEO and Vercel integration.            |
| Zustand          | React Context + useReducer      | **Only for truly trivial carts** (1-2 items, no computed totals). Context causes unnecessary re-renders — avoid for any real cart. |
| Zustand          | Redux Toolkit                   | Enterprise-scale with complex multi-step checkout. Overkill for MVP. Zustand is the 2025 sweet spot.                               |
| Tailwind CSS     | CSS Modules / Styled Components | Only if team has strong preference. Tailwind is the ecosystem standard — better component sharing, easier hiring.                  |
| JSON static data | Supabase                        | Post-MVP only. Current MVP: fast iteration, $0 cost, no backend needed. Supabase adds complexity not needed yet.                   |

## What NOT to Use

| Avoid                  | Why                                                                               | Use Instead                           |
| ---------------------- | --------------------------------------------------------------------------------- | ------------------------------------- |
| Redux (classic)        | Massive boilerplate, 2025 teams use RTK or Zustand                                | Zustand for MVPs, RTK for enterprise  |
| Context API for cart   | Re-renders all consumers on any change — cart updates trigger full tree re-render | Zustand with selective subscriptions  |
| Redux for cart in MVP  | Over-engineering, huge boilerplate for simple cart                                | Zustand: ~50 lines vs ~200+ for Redux |
| jQuery                 | Outdated 2010s era, no SSR support                                                | React/Tailwind                        |
| Pages Router (Next.js) | App Router has better caching, RSC, performance                                   | Next.js 15 App Router                 |
| Plain JavaScript       | Type safety critical for price calculations, cart logic                           | TypeScript 5.x                        |

## Stack Patterns by Variant

**If WhatsApp-only checkout (no payment processor):**

- Use: JSON static data (no database)
- Because: Simplest MVP, validates demand before building admin/CMS

**If adding payment later (Stripe/Shopify):**

- Add: TanStack Query for server state
- Because: Better caching, loading states, invalidation than useEffect

**If adding auth later (customer accounts):**

- Use: Clerk or Supabase Auth
- Because: Pre-built, well-documented, easy integration. Avoid building auth from scratch.

## Version Compatibility

| Package        | Compatible With    | Notes                                 |
| -------------- | ------------------ | ------------------------------------- |
| Next.js 15     | React 19 (bundled) | Use bundled React version             |
| Next.js 15     | Tailwind CSS v4    | Requires PostCSS + Autoprefixer setup |
| Zustand 5.x    | React 18/19        | All compatible                        |
| TypeScript 5.x | Next.js 15         | Full support, strict mode recommended |

## Project-Specific Decision

**PROJECT.md defined:** Next.js 15, Tailwind CSS, React Context + localStorage

**Research recommendation:** Swap React Context for Zustand

| Aspect              | React Context (defined)  | Zustand (recommended)         |
| ------------------- | ------------------------ | ----------------------------- |
| Cart performance    | Re-renders all consumers | Selective subscriptions       |
| localStorage        | Manual implementation    | Built-in `persist` middleware |
| Boilerplate         | More with useReducer     | ~20 lines for full cart       |
| 2025 recommendation | Avoid for carts          | Industry standard for carts   |

**Confidence:** HIGH — Zustand replaced Redux as the "default for 90% of apps" in 2025/2026 (per multiple industry sources). The MVP cart use case is exactly where Zustand shines.

## Sources

- `/vercel/next.js` (Context7) — App Router patterns, project structure
- `/tailwindlabs/tailwindcss.com` (Context7) — CSS utility patterns
- WebSearch: "best stack for e-commerce MVP 2025 2026 Next.js Tailwind" — Current industry recommendations
- WebSearch: "React e-commerce cart state management 2025 Context API vs Zustand vs Redux" — State management best practices
- Medium: "State Management in 2026: Redux vs Zustand vs Context API" (Feb 2026) — Current state management comparison
- Webscension: "Best Tech Stack for E-commerce in 2026" (Jan 2026) — E-commerce stack recommendations

---

_Stack research for: Craft Beer E-commerce MVP_
_Researched: 2026-04-26_

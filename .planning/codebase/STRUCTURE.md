# Structure

**Analysis Date:** 2026-04-26

## Top-Level

```
el-profeta-tienda-web/
├── .agents/                  # Agent configuration & documentation
│   ├── skills/               # Agent skills (React, Next.js, Tailwind, etc.)
│   ├── system/               # System-level agent configs
│   ├── knowledge/            # PRD.md (project requirements)
│   └── design-system/        # MASTER.md (design tokens)
├── .extra/                   # Additional documentation
│   └── docs/                 # Guides and references
├── .planning/                # GSD planning directory
│   └── codebase/             # Codebase analysis docs
├── data/                     # Static data
│   └── products.json         # Product catalog (EXISTS)
├── .env                      # Environment configuration (exists, secrets)
├── .gitignore                # Git ignore rules
├── .mcp.json                 # MCP configuration
├── skills-lock.json          # Skill versions lock
└── package.json              # Not present (project not initialized)
```

## Directory Purpose

| Directory             | Purpose                                                   | Key Files                                                  |
| --------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| `.agents/`            | Agent orchestration configs, roles, and workflows         | `AGENTS.md`, `knowledge/PRD.md`, `design-system/MASTER.md` |
| `.agents/skills/`     | Agent capabilities (React, Tailwind, accessibility, etc.) | Various `SKILL.md` files                                   |
| `.extra/docs/`        | Supplementary documentation                               | Various markdown files                                     |
| `data/`               | Static data for the store                                 | `products.json` (exists)                                   |
| `.planning/codebase/` | Codebase analysis outputs                                 | `ARCHITECTURE.md`, `STRUCTURE.md`                          |

## Entry Points

**Project Not Yet Initialized:** The Next.js application code does not exist. Based on PRD.md, the planned entry points are:

| Planned File           | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `app/layout.tsx`       | Root layout with fonts (Montserrat + Playfair Display) |
| `app/page.tsx`         | Homepage with Hero + Featured Products                 |
| `app/catalog/page.tsx` | Product catalog grid                                   |
| `app/globals.css`      | Tailwind + custom CSS variables                        |

## Planned Application Structure

Based on PRD.md, the following structure will be created:

```
app/                        # Next.js App Router
├── layout.tsx              # Root layout (fonts, metadata)
├── page.tsx                # Homepage
├── catalog/
│   └── page.tsx           # Product catalog
├── globals.css             # Tailwind + design tokens

components/                # React components
├── layout/
│   ├── Navbar.tsx          # Navigation + cart badge
│   └── Footer.tsx          # Simple footer
├── home/
│   └── Hero.tsx            # Homepage hero section
├── catalog/
│   ├── ProductGrid.tsx     # Responsive product grid
│   └── ProductCard.tsx     # Individual product card
└── cart/
    ├── CartSidebar.tsx     # Slide-out cart modal
    └── CheckoutForm.tsx    # Customer info form

context/                    # React Context
└── CartContext.tsx         # Cart state management

lib/                        # Utilities
└── whatsapp.ts             # wa.me URL generation

data/                       # Static data (EXISTS)
└── products.json           # Product catalog (8 products)
```

## Configuration

| File               | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| `.env`             | Environment variables (store name, WhatsApp number) |
| `.gitignore`       | Excludes node_modules, .env, .next                  |
| `.mcp.json`        | MCP server configuration                            |
| `skills-lock.json` | Pinned versions of agent skills                     |

## Data Files

**Existing:**

| File                 | Contents                                                    |
| -------------------- | ----------------------------------------------------------- |
| `data/products.json` | 8 craft beer products with categories, prices, descriptions |

**Data Schema:**

```json
{
  "products": [{ "id", "name", "price", "image", "description", "category", "available" }],
  "categories": [{ "id", "name", "description" }],
  "store": { "name", "tagline", "whatsapp", "whatsapp_message_template" }
}
```

## Agent Configuration Structure

The project uses an agent-based orchestration system:

| File                              | Role                                                          |
| --------------------------------- | ------------------------------------------------------------- |
| `.agents/AGENTS.md`               | Orchestrator configuration, role assignments, sprint plan     |
| `.agents/knowledge/PRD.md`        | Product requirements document                                 |
| `.agents/design-system/MASTER.md` | Design tokens, component specs, typography                    |
| `.agents/skills/`                 | Specialized agent skills for frontend, backend, accessibility |

---

_Structure analysis: 2026-04-26_

# External Integrations

**Analysis Date:** 2026-04-26

## Core Business Integration

### WhatsApp (Order Dispatch)

- **Implementation:** Direct wa.me URL generation
- **Purpose:** Order submission to store owner
- **Flow:** Customer fills checkout form → generates pre-filled WhatsApp message → opens wa.me link
- **Message Template:** Customer name, phone, address, order items, total
- **Data Source:** `data/products.json` (store config includes phone: `5491112345678`)

## Development Tools (MCP Servers)

### NanoBanana MCP

- **Command:** `python3 -m nanobanana_mcp_server.server`
- **Purpose:** AI-powered development assistance
- **Env:** `GEMINI_API_KEY`

### Google Stitch MCP

- **Command:** `npx -y stitch-mcp`
- **Purpose:** UI design generation
- **Env:** `GOOGLE_CLOUD_PROJECT`, `GOOGLE_AUTH_TOKEN`

### 21st Dev Magic MCP

- **Command:** `npx -y @21st-dev/magic@latest`
- **Purpose:** Premium UI components
- **Env:** `API_KEY`

## Planned Integrations (Post-MVP)

### Supabase

- **Type:** Backend-as-a-Service (BaaS)
- **Purpose:** Product data storage, authentication, CMS
- **API:** PostgREST (auto-generated REST API)
- **Security:** Row Level Security (RLS)
- **Status:** Documented in `.extra/docs/supabase-rest-api.md`, not yet implemented

## External APIs Used

### Google Fonts API

- **Purpose:** Typography (Montserrat, Payfair Display)
- **Integration:** Via Next.js `next/font/google`
- **No API key required**

### Lucide React (Icons)

- **Source:** npm package
- **Purpose:** UI icons throughout the application

## Environment Variables

| Variable               | Purpose                           | Status                        |
| ---------------------- | --------------------------------- | ----------------------------- |
| `GEMINI_API_KEY`       | Google AI development tools       | Configured in `.env`          |
| `GCP_PROJECT_ID`       | Google Cloud project (Stitch MCP) | Configured in `.env`          |
| `GOOGLE_CLOUD_PROJECT` | Same as GCP_PROJECT_ID            | In MCP config                 |
| `GOOGLE_AUTH_TOKEN`    | Authentication for Stitch MCP     | In MCP config                 |
| `API_KEY`              | 21st Dev Magic MCP                | In MCP config                 |
| `SUPABASE_URL`         | Supabase project URL              | Not yet configured (post-MVP) |
| `SUPABASE_ANON_KEY`    | Supabase anonymous key            | Not yet configured (post-MVP) |

## Data Flow

```
Product Data (MVP):
  data/products.json → Products loaded at runtime

Product Data (Post-MVP):
  Supabase REST API → products table → Client fetch

Cart State:
  React Context → localStorage (key: "el-profeta-cart")

Order Dispatch:
  Checkout Form → Generate message → wa.me/{phone}?text={encoded_message}
```

## Monitoring & Analytics

- **Not configured** — No analytics or error tracking in MVP
- **Planned post-MVP:** `.extra/docs/monitoring-analytics.md` documents options

---

_Integration audit: 2026-04-26_

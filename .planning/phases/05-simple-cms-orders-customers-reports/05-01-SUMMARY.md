---
phase: 05-simple-cms-orders-customers-reports
plan: 01
subsystem: cms
tags: [supabase, auth, google-oauth, admin]
dependency_graph:
  requires:
    - 04-cart-checkout
  provides:
    - supabase-schema
    - cms-auth
  affects:
    - checkout-flow
tech_stack:
  added:
    - "@supabase/supabase-js"
    - "@supabase/ssr"
  patterns:
    - Server components with Supabase auth
    - Middleware for protected routes
    - RLS policies for data security
key_files:
  created:
    - supabase/schema.sql
    - supabase/config.sql
    - src/app/lib/supabase.ts
    - src/app/cms/login/page.tsx
    - src/app/cms/layout.tsx
    - src/app/auth/callback/route.ts
    - .env.local.example
  modified:
    - package.json
decisions:
  - "Usar @supabase/ssr para Next.js App Router"
  - "Rutas /cms/* protegidas por verificación de sesión en layout"
  - "Google OAuth como único método de autenticación"
  - "RLS habilitado en todas las tablas de Supabase"
metrics:
  duration: "2026-04-27"
  completed: "2026-04-27"
  tasks: 5
  files: 7
---

# Phase 5 - Wave 1 Summary: Supabase Setup & Auth

## Objetivo
Establecer la base de datos Supabase con esquema, autenticación Google OAuth, y rutas protegidas del CMS.

## Implementación

### Base de Datos (supabase/schema.sql)
- **customers**: id, email, name, phone, created_at
- **orders**: id, order_id (ORD-YYYYMMDD-XXXX), customer_id FK, customer_name, customer_phone, customer_address, total, status, created_at
- **order_items**: id, order_id FK, product_id, product_name, unit_price, quantity, subtotal
- **Índices**: customer_id, order_id, status, created_at para consultas eficientes
- **RLS**: Habilitado en todas las tablas con políticas de acceso

### Funciones SQL
- `generate_order_id()`: Genera IDs legibles ORD-YYYYMMDD-XXXX
- `upsert_customer()`: Find or create customer by phone
- `save_order()`: Atomic operation para guardar orden con items
- `get_sales_metrics()`, `get_top_products()`, `get_repeat_customer_rate()`

### Autenticación (Google OAuth)
- **src/app/cms/login/page.tsx**: Página de login con botón Google OAuth
- **src/app/auth/callback/route.ts**: Handler para callback de OAuth
- **src/app/cms/layout.tsx**: Verifica sesión y protege rutas /cms

### Configuración
- **.env.local.example**: Plantilla para variables de Supabase
- **supabase/config.sql**: Documentación de configuración OAuth

## Verificaciones

| Verificación | Estado |
|--------------|--------|
| Schema SQL con tablas, índices, RLS | ✅ Completado |
| Supabase client configurado | ✅ Completado |
| Login page con Google OAuth | ✅ Completado |
| Rutas CMS protegidas | ✅ Completado |

## Notas

- El schema.sql debe ejecutarse en el dashboard de Supabase
- Google OAuth requiere configuración manual en Supabase Dashboard
- Las credenciales de Supabase deben setearse en .env.local
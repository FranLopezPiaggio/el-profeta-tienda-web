---
phase: 05-simple-cms-orders-customers-reports
plan: 02
subsystem: cms
tags: [orders, checkout, reports, charts, recharts]
dependency_graph:
  requires:
    - 05-01
  provides:
    - order-persistence
    - cms-dashboard
  affects:
    - checkout-flow
    - cart-sidebar
tech_stack:
  added:
    - recharts
  patterns:
    - Checkout modificado para guardar en Supabase antes de WhatsApp
    - Dashboard con métricas en tiempo real
    - Órdenes con filtros y actualización de estado
    - Reportes con gráficos interactivos
key_files:
  created:
    - src/app/cms/page.tsx
    - src/app/cms/orders/page.tsx
    - src/app/cms/reports/page.tsx
  modified:
    - src/app/lib/checkout.ts
    - src/app/components/cart/CartSidebar.tsx
decisions:
  - "Guardar orden en Supabase ANTES de abrir WhatsApp (D-01)"
  - "Incluir order ID en mensaje de WhatsApp (D-03)"
  - "Usar recharts para gráficos (D-22)"
  - "Dashboard con métricas de hoy, semana, mes"
  - "Filtros por estado y rango de fecha en pedidos"
  - "Reportes: revenue, orders, average, top products, repeat rate"
metrics:
  duration: "2026-04-27"
  completed: "2026-04-27"
  tasks: 6
  files: 5
---

# Phase 5 - Wave 2 Summary: Checkout Integration & CMS

## Objetivo
Modificar checkout para persistir pedidos en Supabase y crear CMS con dashboard, pedidos y reportes.

## Implementación

### Checkout (src/app/lib/checkout.ts, CartSidebar.tsx)
- **saveOrderAndGenerateLink()**: Nueva función que:
  1. Guarda orden en Supabase (saveOrder RPC)
  2. Obtiene order_id generado
  3. Genera mensaje WhatsApp con order ID
  4. Retorna link de WhatsApp
- **Flow**: Form → Save Supabase → Get order ID → Open WhatsApp
- **Optimistic UI**: Loading state mientras guarda

### CMS Dashboard (src/app/cms/page.tsx)
- Métricas en tiempo real:
  - Ingresos de hoy/semana/mes
  - Pedidos pendientes
  - Valor promedio por pedido
- Recent pending orders con acceso rápido
- Links a pedidos y reportes

### Órdenes (src/app/cms/orders/page.tsx)
- Tabla con columnas: ID, Cliente, Total, Estado, Fecha
- Filtros: Estado (pending/confirmed/delivered/cancelled), Tiempo (today/week/month/all)
- Búsqueda por ID, nombre, teléfono
- Expandir fila para ver items y cambiar estado
- Actualización de estado en tiempo real

### Reportes (src/app/cms/reports/page.tsx)
- Gráficos con Recharts:
  - Bar chart vertical: Productos más vendidos
  - Bar chart: Ingresos por producto
- Filtros de tiempo: Today, Week, Month, Custom
- Métricas:
  - Ingresos totales
  - Cantidad de pedidos
  - Valor promedio
  - Clientes únicos, recurrentes, tasa de repetición

## Verificaciones

| Verificación | Estado |
|--------------|--------|
| Orden se guarda en Supabase antes de WhatsApp | ✅ Completado |
| Order ID aparece en mensaje de WhatsApp | ✅ Completado |
| Dashboard muestra métricas | ✅ Completado |
| Lista de pedidos con filtros | ✅ Completado |
| Reportes con gráficos | ✅ Completado |

## Stubs Identificados

- El checkout guardará en Supabase pero puede continuar a WhatsApp si falla (degradación graceful)
- Reportes muestran "No hay datos" si no hay pedidos en el período

## Notas

- Requiere Supabase configurado con schema.sql ejecutado
- Las métricas se calculan en tiempo real desde la base de datos
- Los gráficos son responsive para mobile y desktop
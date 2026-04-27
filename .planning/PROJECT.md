# El Profeta — Craft Beer Online Store

## What This Is

Una tienda online minimalista para la marca de cerveza artesanal "El Profeta" donde los clientes pueden navegar el catálogo, agregar productos al carrito, y realizar pedidos que se despachan directamente por WhatsApp. Sin registro, sin pago online — solo catálogo, carrito, y WhatsApp.

## Core Value

El cliente puede pedir una cerveza en menos de 2 minutos desde que entra a la tienda.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage con Hero y productos destacados
- [ ] Catálogo de productos en grid responsivo
- [ ] Product Card con imagen, nombre, precio, selector de cantidad
- [ ] Carrito (slide-out/modal) con lista de items y totales
- [ ] Persistencia del carrito en localStorage
- [ ] Formulario de checkout (nombre, teléfono, dirección)
- [ ] Generación de link wa.me con mensaje prellenado del pedido
- [ ] Navbar con logo, links de navegación, e icono de carrito con badge
- [ ] Footer básico
- [ ] Diseño responsivo: mobile-first (320px → 1024px+)
- [ ] Tipografía: Playfair Display (headings) + Montserrat (body)
- [ ] Paleta simple: whites/grays/blacks del design system

### Out of Scope

- Página de detalle de producto — se muestra todo en la card
- Sistema de pago online — 100% WhatsApp
- Autenticación / cuentas de usuario — cualquier persona puede comprar
- Historial de pedidos — no necesario para MVP
- CMS / Admin — post-MVP (Supabase)
- Búsqueda de productos — filtrado post-MVP
- Reviews/ratings — no necesario para MVP
- Base de datos — JSON estático por ahora

## Context

### Situación Actual

- **Marca**: El Profeta — cerveza artesanal
- **Productos**: 8 birras (Lager, IPA, Stout, Amber, Pilsen, Porter, Wheat, Session IPA)
- **Data existente**: `data/products.json` con productos, categorías, configuración de tienda
- **WhatsApp**: Número configurado: `5491112345678`
- **Stack definido**: Next.js 15 (App Router), Tailwind CSS, React Context + localStorage
- **Design system**: MASTER.md con tokens de color, tipografía, espaciado, y specs de componentes
- **Estructura planificada**: AGENTS.md detalla rutas, sprints, componentes, y quality gates
- **Sin código fuente aún**: El proyecto está en fase de planificación

### Modelo de Negocio

- Venta directa al consumidor (D2C)
- Despacho vía WhatsApp — el mensaje incluye nombre, teléfono, dirección, lista de productos, total
- Sin intermediarios de pago
- Sin delivery propio — se coordina por WhatsApp

### Público Objetivo

| Persona               | Goal                           | Pain Point                               |
| --------------------- | ------------------------------ | ---------------------------------------- |
| **Comprador casual**  | Ver catálogo, comprar rápido   | No quiere registrarse, quiere comprar ya |
| **Cliente frecuente** | Repetir pedido fácilmente      | Quiere reordenar sin buscar de nuevo     |
| **Regalo**            | Encontrar producto para regalo | Necesita info clara de productos         |

## Constraints

- **Budget**: $0 — free-tier only, sin gastos en servicios externos
- **Data Source**: JSON estático (no Supabase en MVP)
- **Backend**: Ninguno — WhatsApp como canal de pedidos
- **Auth**: Sin autenticación — acceso abierto a cualquier visitante
- **Delivery**: Sin sistema de delivery propio — coordinación manual por WhatsApp
- **Tech Stack**: Next.js 15, Tailwind CSS, React Context + localStorage (definido)

## Key Decisions

| Decision                              | Rationale                                                                    | Outcome   |
| ------------------------------------- | ---------------------------------------------------------------------------- | --------- |
| WhatsApp como canal de pedidos        | $0 budget, simplicidad, fans de cerveza artesanal prefieren contacto directo | — Pending |
| JSON estático para productos          | Iteración rápida, no necesita backend para MVP                               | — Pending |
| Sin autenticación                     | Reduce fricción, compra instantánea                                          | — Pending |
| Diseño minimalista (white/gray/black) | El Profeta es marca premium-artesanal, colores neutros reflejan calidad      | — Pending |
| Playfair Display + Montserrat         | Playfair = premium/artesanal, Montserrat = legibilidad moderna               | — Pending |
| Mobile-first responsive               | Público objetivo usa celular para redes y WhatsApp                           | — Pending |

---

_Last updated: 2026-04-26 after initialization_

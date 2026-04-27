# Token Audit — Antares Design System

**Project:** El Profeta Craft Beer Store  
**Phase:** 04 — Design Tokens (Wave 1-2)  
**Audience:** Developers, Future Maintainers  
**Last Updated:** 2026-04-27

---

## 1. Overview

### 1.1 Antares Design System — Wave 1 Summary

The Antares Design System tokens were created in Wave 1 and stored in `design-system/tokens.css`. The system is built on **Cervecería Antares brand guidelines**, optimized for a **dark-themed e-commerce** experience with warm, earthy tones.

### 1.2 Current State

| Aspect | Status |
| ------ | ------ |
| Tokens defined | ✅ Complete (`design-system/tokens.css`) |
| Components migrated | ⚠️ **INCOMPLETE** — Components still use Tailwind defaults |
| Theme applied globally | ❌ Not yet applied |

### 1.3 Purpose of This Document

This audit maps the existing Tailwind color classes used across components against the defined Antares tokens. The goal is to identify migration gaps and provide clear guidelines for adopting the design system consistently.

---

## 2. Token Reference

### 2.1 Antares Design System Tokens (`design-system/tokens.css`)

| Token Name | CSS Variable | Hex | Usage |
| ---------- | ------------ | --- | ----- |
| **Text Primary** | `--color-text-primary` | `#f2e5d7` | Primary readable text (cream) |
| **Text Secondary** | `--color-text-secondary` | `#463a2f` | Secondary/muted text (brown) |
| **Text Tertiary** | `--color-text-tertiary` | `#00555b` | Links, accents (teal) |
| **Text Inverse** | `--color-text-inverse` | `#ffffff` | On dark surfaces (white) |
| **Text Muted** | `--color-text-muted` | `#9fd5da` | Captions, disabled (light teal) |
| **Surface Base** | `--color-surface-base` | `#000000` | Primary dark background (black) |
| **Surface Raised** | `--color-surface-raised` | `#fdfdfd` | Light cards, modals (off-white) |
| **Surface Muted** | `--color-surface-muted` | `#9fd5da` | Muted backgrounds (light teal) |
| **Surface Strong** | `--color-surface-strong` | `#00828c` | Primary actions (teal) |
| **Surface Overlay** | `--color-surface-overlay` | `#1a1a1a` | Menus, dropdowns (dark) |
| **Accent** | `--color-accent` | `#00828c` | Primary brand accent (teal) |
| **Accent Hover** | `--color-accent-hover` | `#006a73` | Hover state (darker teal) |
| **Accent Muted** | `--color-accent-muted` | `#9fd5da` | Secondary accent (light teal) |

### 2.2 Typography Tokens

| Token | CSS Variable | Value | Usage |
| ----- | ------------ | ----- | ----- |
| Base | `--font-family-base` | Playfair Display, serif | Headings, logo |
| Display | `--font-family-display` | Montserrat, sans-serif | Body text |
| Bold | `--font-weight-bold` | 700 | Emphasis |
| Normal | `--font-weight-normal` | 400 | Standard text |
| Base (size) | `--font-weight-base` | 600 | UI elements |

### 2.3 Spacing Tokens

```css
--space-1: 5px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 19px;  --space-6: 20px;  --space-7: 24px;  --space-8: 32px;
--space-10: 40px; --space-12: 48px; --space-16: 64px;
```

### 2.4 Border Radius Tokens

```css
--radius-xs:  5px;   /* subtle rounded */
--radius-sm:  8px;   /* cards, buttons */
--radius-md:  50px;  /* pill buttons, badges */
--radius-lg:  12px;  /* modals, large cards */
--radius-xl:  16px;  /* overlays */
--radius-full: 9999px; /* circular */
```

---

## 3. Color Mapping: Current vs. Target

### 3.1 Tailwind → Antares Mapping

The current codebase uses Tailwind gray scale. Here's the mapping to Antares tokens:

| Current Tailwind | Hex Equivalent | Antares Token | Target Hex | Migration Status |
| ---------------- | --------------- | ------------- | ---------- | ---------------- |
| `text-gray-900` | `#111827` | `--color-text-primary` | `#f2e5d7` | ❌ Not migrated |
| `text-gray-600` | `#4b5563` | `--color-text-secondary` | `#463a2f` | ❌ Not migrated |
| `text-gray-500` | `#6b7280` | `--color-text-muted` | `#9fd5da` | ❌ Not migrated |
| `text-gray-400` | `#9ca3af` | `--color-text-tertiary` | `#00555b` | ❌ Not migrated |
| `bg-white` | `#ffffff` | `--color-surface-raised` | `#fdfdfd` | ❌ Not migrated |
| `bg-gray-900` | `#111827` | `--color-surface-strong` | `#00828c` | ❌ Not migrated |
| `bg-gray-50` | `#f9fafb` | `--color-surface-base` | `#000000` | ❌ Not migrated |
| `bg-gray-100` | `#f3f4f6` | `--color-surface-muted` | `#9fd5da` | ❌ Not migrated |
| `border-gray-200` | `#e5e7eb` | N/A (border-specific) | — | ⚠️ Partial |
| `border-gray-300` | `#d1d5db` | N/A (border-specific) | — | ⚠️ Partial |
| `hover:text-gray-600` | — | `--color-text-secondary` | `#463a2f` | ❌ Not migrated |
| `hover:bg-gray-100` | — | `--color-surface-muted` | `#9fd5da` | ❌ Not migrated |
| `hover:bg-gray-800` | — | `--color-accent-hover` | `#006a73` | ❌ Not migrated |

### 3.2 Mapping Explanation

The Tailwind gray scale uses a neutral, cool-toned palette (`#111827` to `#f9fafb`). The Antares system uses a warm, brand-aligned palette with:

- **Cream (#f2e5d7)** for primary text instead of cool gray
- **Teal (#00828c)** for primary actions instead of dark gray
- **Brown (#463a2f)** for secondary text
- **Light teal (#9fd5da)** for muted elements and accents

---

## 4. Component-Specific Color Usage

### 4.1 Navbar.tsx

**Current colors:**
- `bg-white` — Background
- `border-b border-gray-200` — Bottom border
- `text-gray-900` — Logo, links, icon
- `hover:text-gray-600` — Link hover
- `bg-gray-900` — Badge background

**Antares target:**
- Replace `bg-white` → `bg-[var(--color-surface-raised)]` or dark theme
- Replace `text-gray-900` → `text-[var(--color-text-primary)]`
- Replace `text-gray-600` → `text-[var(--color-text-secondary)]`
- Replace `bg-gray-900` badge → `bg-[var(--color-accent)]`

### 4.2 ProductCard.tsx

**Current colors:**
- `bg-white` — Card background
- `border border-gray-200` — Card border
- `bg-gray-100` — Image placeholder
- `text-gray-900` — Product name, price
- `text-gray-600` — ABV text
- `text-gray-500` — Category label
- `border-gray-300` — Quantity buttons
- `hover:bg-gray-100` — Button hover
- `bg-gray-900` — Add to cart button
- `hover:bg-gray-800` — Button hover

**Antares target:**
- Replace all `gray-*` with Antares equivalents from section 2.1
- Primary action button: `bg-[var(--color-accent)]` / `hover:bg-[var(--color-accent-hover)]`

### 4.3 Hero.tsx

**Current colors:**
- `bg-white` — Section background
- `text-gray-900` — Heading
- `text-gray-600` — Subtitle
- `bg-gray-900` — CTA button
- `hover:bg-gray-800` — Button hover state

**Antares target:**
- Consider dark hero: `bg-[var(--color-surface-base)]`
- Use `--color-text-primary` for heading
- Use `--color-text-secondary` for subtitle
- Use `--color-accent` for CTA button

### 4.4 CartSidebar.tsx

**Current colors:**
- `bg-gray-900/50` — Backdrop overlay (`rgba(17, 24, 39, 0.5)`)
- `bg-white` — Sidebar panel
- `border-gray-200` — Borders
- `text-gray-900` — Headings, prices
- `text-gray-500` — Muted text, labels
- `border-gray-300` — Form inputs
- `focus:border-gray-900` — Input focus
- `hover:text-gray-900` — Link/icon hover
- `bg-gray-900` — Primary checkout button
- `hover:bg-gray-800` — Button hover
- `bg-gray-50` — Footer background
- `text-red-600` — Error messages

**Antares target:**
- Backdrop: `--color-surface-overlay` with opacity
- Panel: `--color-surface-raised` (light) or `--color-surface-strong` (dark)
- Error: Define token `--color-error` (red-600 equivalent)
- Primary button: `--color-accent` variant

### 4.5 AgeGate.tsx

**Current colors:**
- `bg-gray-900` — Bar background
- `text-white` — Text
- `bg-white` — Button background
- `text-gray-900` — Button text
- `hover:bg-gray-100` — Button hover

**Antares target (already partially aligned):**
- Keep dark background: `--color-surface-base` or `--color-surface-overlay`
- Text: `--color-text-inverse`
- Button: `--color-surface-raised` with `--color-text-primary`

### 4.6 Footer.tsx

**Current colors:**
- `bg-white` — Footer background
- `border-t border-gray-200` — Top border
- `text-gray-900` — Brand name
- `text-gray-500` — Copyright

**Antares target:**
- Match Navbar (probably dark in full migration)
- Replace `--color-text-primary` and `--color-text-muted`

---

## 5. Gap Analysis Summary

| Component | Tokens Already Using | Tokens Missing | Migration Effort |
| --------- | -------------------- | --- | --- |
| Navbar | None | 6 tokens | Medium |
| ProductCard | None | 10 tokens | High |
| Hero | None | 5 tokens | Medium |
| CartSidebar | 1 (rgba overlay) | 12 tokens | High |
| AgeGate | None | 4 tokens | Low-Medium |
| Footer | None | 3 tokens | Low |
| ProductGrid | None | 0 (uses ProductCard) | — |

### 5.1 Total Gap

- **Components analyzed:** 7
- **Tokens needing migration:** ~40 unique instances
- **Migration status:** Wave 1 defined tokens, Wave 2 not yet begun

---

## 6. Usage Guidelines

### 6.1 For New Components

1. **Always use Antares tokens** from `design-system/tokens.css`
2. **Import tokens:** Tokens are defined as CSS custom properties
3. **Prefer semantic tokens over hardcoded colors**

```tsx
// ❌ Don't use Tailwind gray directly for text
<p className="text-gray-900">Title</p>

// ✅ Use tokens (requires CSS variable support)
<p className="text-[var(--color-text-primary)]">Title</p>
```

### 6.2 Token Application Patterns

| Use Case | Recommended Token(s) |
| -------- | -------------------- |
| Primary text (headings) | `--color-text-primary` |
| Body text, paragraphs | `--color-text-secondary` |
| Links, interactive elements | `--color-text-tertiary` |
| Subtitles, captions | `--color-text-muted` |
| Dark backgrounds | `--color-surface-base` |
| Cards, modals (light theme) | `--color-surface-raised` |
| Primary buttons | `--color-accent` |
| Button hover | `--color-accent-hover` |
| Subtle backgrounds | `--color-surface-muted` |
| Overlays, backdrops | `--color-surface-overlay` |

### 6.3 Border & Divider Handling

Antares defines surface colors but not border-specific tokens. Use this mapping:

| Tailwind Equivalent | Hex | Recommendation |
| ------------------ | --- | --------------- |
| `border-gray-200` | `#e5e7eb` | Use `--color-surface-raised` at 10% opacity |
| `border-gray-300` | `#d1d5db` | Use `--color-surface-raised` at 20% opacity |
| `divide-gray-200` | `#e5e7eb` | Same as border |

### 6.4 Hover & Focus States

Always define hover states using darker/lighter variants:

```tsx
// Button states
<button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]">
  Action
</button>

// Link states  
<a className="text-[var(--color-text-tertiary)] hover:opacity-80">
  Link
</a>
```

### 6.5 Accessibility Considerations

- **Contrast ratio:** Antares cream (`#f2e5d7`) on black (`#000000`) = 16.35:1 ✅
- **Focus indicators:** Ensure 3:1 minimum for UI components
- **Colorblind-safe:** Teal accent is distinguishable from cream/brown
- **Testing:** Validate with Lighthouse accessibility audit

---

## 7. Migration Checklist

Before closing Wave 2:

- [ ] Document completion of this token audit
- [ ] Confirm all components listed in section 4 have migration targets
- [ ] Update any component creation guidelines to require token usage
- [ ] Consider adding a helper class or Tailwind plugin for token shortcuts

---

## 8. References

- **Token source:** `design-system/tokens.css`
- **Base system:** Antares Design System (Cervecería Antares)
- **Brand colors:** Teal (#00828c), Cream (#f2e5d7), Brown (#463a2f)
- **Project conventions:** See `CONVENTIONS.md`

---

*Generated as part of Phase 04 — Design Tokens (Wave 2)*
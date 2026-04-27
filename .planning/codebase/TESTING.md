# Testing

**Analysis Date:** 2026-04-26

This document describes the testing approach for the El Profeta e-commerce project.

---

## Current State

**No testing infrastructure exists yet.** The project is in early planning stages with no source code.

The PRD specifies these sprints:

1. Sprint 1: Setup + Base
2. Sprint 2: Catalog + Cart
3. Sprint 3: Checkout
4. Sprint 4: Polish

Testing will be introduced as the project progresses.

---

## Framework

**Not yet selected.** Based on the tech stack (Next.js 15 + TypeScript), recommended options:

| Framework  | Notes                                                             |
| ---------- | ----------------------------------------------------------------- |
| **Vitest** | Recommended — fast, modern, integrates with React Testing Library |
| **Jest**   | Alternative — more mature, larger ecosystem                       |

---

## Test Locations

When tests are added, expected structure:

| Pattern           | Location                                |
| ----------------- | --------------------------------------- |
| Unit tests        | `__tests__/` or `*.test.tsx` co-located |
| Integration tests | `tests/integration/`                    |
| E2E tests         | `tests/e2e/` (if added later)           |

---

## Recommended Patterns

Based on Next.js best practices and GSD workflow:

### Unit Tests

- Test utility functions in `lib/` (e.g., `whatsapp.ts`)
- Test cart context logic (add, remove, update, totals)
- Test component rendering with React Testing Library

### Component Tests

- Test interactive components: ProductCard (quantity selector), CartSidebar
- Test form validation: CheckoutForm
- Test cart badge updates

### Integration Tests

- Test flow: Homepage → Catalog → Cart → Checkout → WhatsApp
- Test cart persistence (localStorage)

### Test Structure

```typescript
// Example structure for component tests
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "@/components/catalog/ProductCard";

describe("ProductCard", () => {
  it("renders product information", () => {
    // test
  });

  it("adds item to cart on button click", () => {
    // test
  });
});
```

---

## Mocking

When tests are added:

| What to Mock      | How                                      |
| ----------------- | ---------------------------------------- |
| **localStorage**  | Use `jest.spyOn(Storage.prototype, ...)` |
| **window.open**   | Mock for WhatsApp link testing           |
| **React Context** | Wrap with test provider or mock          |

---

## Coverage

**Not yet defined.** Recommendations for MVP:

- Target: Core functionality (cart, checkout flow)
- Focus on: Cart logic, WhatsApp message generation, form validation

---

## CI/CD

**Not yet configured.** For a Next.js project, typical approach:

```yaml
# .github/workflows/test.yml (example)
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run test
      - run: npm run build
```

---

## Quality Gates (from AGENTS.md)

The project has defined quality gates that can inform testing:

### Design Gates

- [ ] Colors reference design tokens
- [ ] Typography uses Montserrat + Playfair Display
- [ ] Responsive: mobile-first

### Implementation Gates

- [ ] Responsive tested: 320px, 768px, 1024px+
- [ ] Interactive elements have :focus + :hover
- [ ] Cart badge updates in real-time
- [ ] WhatsApp link generates correct message
- [ ] TypeScript: no `any`
- [ ] Console without errors

These gates can be verified through manual testing and automated tests as implemented.

---

## Next Steps

1. When Sprint 1 starts (setup phase):
   - Initialize testing framework (recommend Vitest)
   - Configure test script in `package.json`
2. When components are built:
   - Add unit tests for utilities (`lib/`)
   - Add component tests for interactive elements
3. Before release:
   - Verify all quality gates
   - Test on real devices/browsers

---

## Skills Reference

Relevant testing guidance available in:

- `.agents/skills/next-best-practices/` — Next.js testing patterns
- `.agents/skills/vercel-react-best-practices/` — React testing best practices

---

_Testing approach derived from: PRD.md, AGENTS.md, and project quality gates_

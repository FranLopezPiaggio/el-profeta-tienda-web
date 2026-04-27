# Domain Pitfalls: Craft Beer E-commerce

**Domain:** Craft Beer E-commerce (Next.js + WhatsApp MVP)
**Researched:** 2026-04-26
**Overall Confidence:** MEDIUM

## Executive Summary

Craft beer e-commerce projects face a unique intersection of challenges: product fragility, alcohol regulations, and the need for frictionless mobile-first UX. For an MVP using WhatsApp dispatch without payment processing, the critical pitfalls differ from traditional e-commerce platforms in that they focus on **pre-checkout friction**, **delivery expectation management**, and **age verification** rather than payment gateway integration.

The most damaging pitfalls for this context are:

1. **Mobile checkout friction** that defeats the "under 2 minute purchase" value proposition
2. **Poor age verification UX** that becomes a conversion killer
3. **Unclear delivery scope** leading to failed WhatsApp orders

---

## Critical Pitfalls

### Pitfall 1: Mobile Checkout Friction That Defeats Speed-of-Purchase Value

**What goes wrong:** The MVP's core value proposition is "under 2 minutes from entry to purchase." But if mobile checkout has friction—small tap targets, complex forms, slow load times, or hidden costs revealed at the end—the value proposition collapses. Mobile users abandon in under 30 seconds.

**Why it happens:**

- Form fields designed for desktop (full address, notes, preferences)
- No guest checkout (or hidden guest checkout option)
- Unexpected costs revealed at final step
- Checkout CTA below the fold requiring scroll
- Buttons too small for thumb tap (44px minimum recommended)

**Consequences:**

- Cart abandonment rate exceeds 70% on mobile
- Core value ("buy in under 2 minutes") becomes impossible to achieve
- WhatsApp never receives the order

**Prevention Strategy:**

- Use only essential fields: Name, Phone, Address, Reference (4 fields max)
- Make checkout a single scrollable page, not multi-step wizard
- Show any delivery cost estimate in cart, not after WhatsApp redirect
- Place checkout CTA as a sticky button at mobile viewport bottom
- Use 48px minimum touch targets
- Autofill phone with device keyboard numeric input type
- Pre-fill name from localStorage if previously ordered

**Phase Mapping:** This is a Phase 1 (Core) implementation concern—the entire value proposition depends on frictionless mobile checkout.

**Detection:**

- Test on actual mobile device on 4G network (not WiFi)
- Measure: Entry → Add to Cart goal completion time
- Benchmark: Under 30 seconds from tap to WhatsApp link generated

---

### Pitfall 2: Age Verification UX That Kills Conversions

**What goes wrong:** Alcohol is age-restricted. But heavy-handed verification (document upload, selfie, external verification service) creates 15-25% cart abandonment. Light-handed (simple checkbox) provides no legal protection. Either way loses orders or creates liability.

**Why it happens:**

- Over-engineering verification to feel "proper" blocks checkout with friction
- Under-engineering provides checkbox-only that satisfies neither UX best practices norcompliance
- No clear "progressive verification" strategy: what works for returning users vs. first-time

**Consequences:**

- First-time buyers abandon after being asked to photograph ID
- Returning users face re-verification every order (zero friction reduction)
- Legal exposure if accidentally selling to minors
- Support burden from verification failures

**Prevention Strategy:**
MVP approach (WhatsApp dispatch, no shipping carrier verification):

- **Phase 1:** Simple age gate on homepage (persistent banner, not popup). "Debes ser mayor de 18 años para comprar." Dismissible per session only, logged.
- **Phase 2:** At checkout, ask for birth year (not full DOB). Store in localStorage for returning users.
- **Post-MVP (if adding delivery):** Implement account-level verification, adult signature at door

**Key insight:** For a WhatsApp dispatch model where the seller personally confirms identity with the customer over chat, account-level age declaration is defensible. The WhatsApp conversation itself serves as verification—the seller can confirm verbally. But this must be documented as policy.

**Phase Mapping:**

- Phase 1: Implement homepage age gate with session-local dismissal
- Phase 2: Birth year at checkout with localStorage persistence
- Post-MVP: Escalate if adding carrier shipping

**Detection:**

- Cart abandonment at age gate (measure completion before vs. after gate)
- Verification time-to-complete (should be under 3 seconds)
- Return user verification friction rate

---

### Pitfall 3: Unclear Delivery Scope Destroying WhatsApp Orders

**What goes wrong:** With WhatsApp dispatch (no built-in delivery infrastructure), the first message to the seller includes address and expectations—but those expectations are misaligned. Customer expects same-day delivery, seller coordinates next-day. Customer expects free shipping, seller quotes $500. Order fails at WhatsApp stage.

**Why it happens:**

- No delivery policy visible before checkout
- No zone/delivery radius defined
- No cost estimate shown when cart has local delivery expectations
- Customer assumes "e-commerce = delivered" (like Amazon)

**Consequences:**

- WhatsApp messages with unworkable requests
- Back-and-forth negotiation that kills the "instant order" vibe
- Seller reputation damage from unmet expectations
- Order cancellations after checkout

**Prevention Strategy:**

- Show delivery radius/cost clearly in cart slide-out
- Use delivery zone indicator: "Entregas en [barrio/ciudad] — Ver otras zonas"
- Show estimated timeframe: "Coordinamos entrega en 24-48h por WhatsApp"
- Never show "free shipping" unless explicitly offered in delivery zone
- If outside delivery zone, disable WhatsApp checkout with explanation

**Phase Mapping:** This is a Phase 1 implementation concern—requires visible delivery scope in cart UI before WhatsApp generation.

**Detection:**

- Measure: Orders with delivery complaint in first WhatsApp message
- Support tickets related to delivery scope

---

### Pitfall 4: Poor Product Presentation That Fails to Sell

**What goes wrong:** Product cards show bare minimum—name, price, add button. No story, no tasting notes, no pairing suggestions, no imagery that makes someone want beer.

**Why it happens:**

- Treating MVP as "we'll add details later"
- JSON data lacks compelling product descriptions
- Images are generic or missing

**Consequences:**

- Add to cart rate depends on "knowing the beer" already
- No differentiation from competitors
- No reason to share or return

**Prevention Strategy:**

- For each product: Add 1-sentence tasting notes + 1 food pairing + style context
- Use consistent, high-quality product photography (not generic stock)
- Show on product card: ABV %, IBU ( bitterness), style family
- Differentiate by story: "El Profeta IPA — nuestro bestseller desde 2021"

**Phase Mapping:** Phase 1 core implementation—product data enrichment is required for MVP to function.

**Detection:**

- Add to cart conversion rate (should be 15%+)
- Product card scroll depth (are users reading or bouncing?)

---

## Moderate Pitfalls

### Pitfall 5: Website Speed That Loses Mobile Users Before First Load

**What goes wrong:** Average mobile page load time expected under 3 seconds. Sites taking 8+ seconds lose users before seeing products. Mobile networks on cellular are slower than WiFi testing environment.

**Why it happens:**

- Heavy hero images without optimization
- No image lazy loading below fold
- Blocking scripts in critical render path
- No service worker caching

**Prevention Strategy:**

- Optimize hero image for mobile (under 100KB)
- Implement Next.js Image component for automatic optimization
- Test on Lighthouse with throttling (4G fast)
- Target: First Contentful Paint under 1.5s

**Phase Mapping:** Phase 1 performance concern—speed testing part of verification.

**Detection:** Lighthouse mobile score under 90 (fail).

---

### Pitfall 6: Missing Trust Signals at Checkout

**What goes wrong:** First-time buyers don't complete WhatsApp generation because they don't trust "this is a real store." No visible policies, contact info, or social proof.

**Why it happens:**

- No footer policies (refund, privacy, contact)
- No brand story "El Profeta — Cerveza artesanal desde..."
- No visible WhatsApp number before checkout
- No clear "how this works" explanation

**Consequences:**

- Checkout abandonment due to trust uncertainty
- User searches for contact info, leaves site

**Prevention Strategy:**

- Footer with: Contact WhatsApp, Delivery policy, Privacy note
- Homepage section: "Cómo comprar" (simple 3-step explanation)
- Persistent navbar shows business name/logo
- Pre-checkout trust banners: "Pedido confirmado por WhatsApp — Respondemos en horario comercial"

**Phase Mapping:** Phase 1 implementation—trust elements part of homepage/checkout verification.

**Detection:** Return visitor rate, direct traffic to homepage exit rate

---

### Pitfall 7: No Clear "What Happens Next" After WhatsApp Link

**What goes wrong:** User clicks WhatsApp link, message opens—but no clear what to write. They hover, close, or send incomplete message. Seller receives ambiguous order.

**Why it happens:**

- WhatsApp message template is vague
- User doesn't know what information to include
- No confirmation UI between cart checkout and WhatsApp

**Consequences:**

- Empty/incomplete WhatsApp messages
- Manual back-and-forth to extract order details
- Lost orders from miscommunication

**Prevention Strategy:**

- Pre-fill WhatsApp message with full order summary:

  ```
  Hola! Quiero comprar:
  - 6x El Profeta IPA
  - 4x El Profeta Lager
  Total: $XXXX

  Delivery a: [dirección]
  ```

- Show "Confirmation Screen" after clicking WhatsApp CTA with:
  - Order summary
  - Next steps explanation: "Escribinos por WhatsApp y coordinamos el delivery"
  - Seller response time expectation

**Phase Mapping:** Phase 1 implementation—WhatsApp template part of checkout function.

**Detection:** WhatsApp message completeness rate

---

### Pitfall 8: Cart Persistence Failure Losing In-Progress Orders

**What goes wrong:** User adds items, leaves site, returns—cart is empty. They've lost their selection and probably won't rebuild.

**Why it happens:**

- No localStorage persistence implemented
- Browser cache cleared
- New session on return

**Prevention Strategy:**

- Implement React Context + localStorage sync on every cart change
- Also persist: checkout form data (name, phone, address) for returning users
- Show cart badge on navbar as persistent reminder

**Phase Mapping:** Phase 1 implementation—cart persistence is requirement.

**Detection:** Cart recovery rate (return visitor adds to cart vs. starts fresh)

---

## Minor Pitfalls

### Pitfall 9: Ignoring Analytics Until Problems Are Unsolvable

**What goes wrong:** Launch without event tracking. Problems discovered via "I noticed" not via measurement. Can't optimize what isn't measured.

**Prevention Strategy:**

- Phase 1 implementation includes analytics (PostHog, Plausible, or simple custom event logging)
- Track: Page views, Product views, Add to cart, Checkout started, WhatsApp link generated, Cart abandoned
- Review weekly in Phase 1 verification

### Pitfall 10: No Error States for Empty Cart or Failed WhatsApp Link

**What goes wrong:** User opens cart, sees nothing. No feedback. Clicks WhatsApp, link fails. No UI feedback.

**Prevention Strategy:**

- Empty cart state with clear CTA: "Explorá nuestro catálogo"
- WhatsApp link fallback: Direct wa.me link + raw phone display if link fails

---

## Domain-Specific Warnings by Phase

| Phase Topic                          | Likely Pitfall                                       | Mitigation                                       |
| ------------------------------------ | ---------------------------------------------------- | ------------------------------------------------ |
| **Phase 1: Homepage + Product Grid** | Product images fail to load on mobile, LCP too high  | Test with real mobile on 4G, optimize hero image |
| **Phase 1: Cart + Checkout**         | Form fields too many, checkout exceeds 2 minutes     | Maximum 4 fields, sticky CTA, test timing        |
| **Phase 1: WhatsApp Integration**    | Link fails on some devices, message template unclear | Test on iOS and Android, verify format           |
| **Phase 2: Delivery Zone**           | Customers outside zone expect delivery               | Clear zone UI before checkout, block if outside  |
| **Post-MVP: Scaling**                | WhatsApp becomes bottleneck for order volume         | Phase now needs automation/Systems               |

---

## Sources

### High Confidence (Context7 / Official Docs)

- MobileUX standards: 44px touch targets minimum
- Baymard Institute checkout research: 70%+ cart abandonment from friction
- Page load threshold: Under 3 seconds

### Medium Confidence (WebSearch Verification)

- **Bottlecapps MobileUX Report 2025:** 70% of alcohol purchases on mobile, high abandonment from friction
- **DroptBeer E-commerce Guide:** Age verification, shipping restrictions as key pitfalls
- **Xident Age Verification 2026:** 15-25% drop from heavy document verification; account-level reduces to near-zero for returning
- **Shopify Beer Distribution Guide:** Regulatory complexity, shipping fragility

### Low Confidence (Single Source / Unverified)

- Lost Abbey server crash case study (2016) — anecdotal, but illustrative for peak traffic planning
- BrewDog fulfillment外包 failure — demonstrates delivery coordination risks

---

## Research Closure

This research covers the critical pitfalls for craft beer e-commerce with a WhatsApp-dispatch MVP. Confidence is MEDIUM because findings come from WebSearch sources rather than Argentina-specific alcohol e-commerce regulations.

### Open Questions for Phase-Specific Research

1. **Argentina-specific alcohol shipping regulations** — Does Argentina restrict direct-to-consumer alcohol delivery? The research identified US state-based restrictions. Need Argentine regulatory map.
2. **WhatsApp Business API vs. wa.me link** — For order volume scaling, WhatsApp Business may be needed. Research when to switch.
3. **Age verification legal standard in Argentina** — The "mayor de 18 años" checkbox may or may not be legally sufficient.

### Recommended Phase-Specific Research Triggers

- Phase 1 verification: Conduct mobile usability testing with 4G network
- Post-launch: If shipping volume scales, research WhatsApp Business API
- Post-MVP: If adding delivery carriers, research Argentine alcohol delivery compliance

---

_Research completed 2026-04-26 for El Profeta Tienda Web_

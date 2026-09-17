---
title: "Repository Rules"
type: "rules"
status: "active"
description: "Core architectural, design, and code quality invariants."
---

# Repository Rules

All contributors and AI agents must follow these invariants.

---

## 1. Design & UI Invariants

1. **Zero Semantic Colors at Rest:** Never style resting UI containers or text with semantic alert tokens (`destructive`, `warning`, `success`). Use neutral tokens with hover-gated accents.
2. **No Badges or Pills:** Do not render pill or dot badges. Use sub-label stacking or margin wash for status indicators.
3. **Single Primary CTA:** Render at most one primary action button on a single surface or toolbar.
4. **No Resting Container Borders:** Cards and panels use shadow elevation (`shadow-xs` to `shadow-xl`) and are borderless at rest.
5. **Application Font Cap:** Font sizes in application views must not exceed 24px (`text-2xl`).
6. **Em-Dash Fallbacks:** Display missing or undefined values as `—` (em-dash). Do not use `"N/A"`, `"-"`, or `"Unknown"`.
7. **Motion Limits:** Do not use linear easing or `transition: all`. Keep motion durations within 500ms.
8. **Accessible Touch Targets:** Interactive icon buttons must keep a minimum 44×44px hit target and include descriptive `aria-label` attributes.

---

## 2. Token Scales

- **Spacing:** Use standard scale (`space-1` to `space-12`). Arbitrary pixel values (for example: `p-[13px]`) are forbidden.
- **Elevation:** Use the 5-tier shadow scale (`shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`).
- **Z-Index:** Base (`0`), Dropdowns (`40`), Sticky (`50`), Modals (`80`), Toasts (`100`).

---

## 3. Code & Language Standards

- **Type Safety:** Zero `any` tolerance. Do not use non-null assertions (`!`) or unsafe type assertions.
- **Language & Copy:** Obey ASD-STE100 rules. Do not use contractions or semicolons in code comments and documentation.

---
title: "TypeScript (tsc) and ESLint Maximum Strictness Invariants"
type: "rules"
status: "active"
description: "Non-negotiable rules for maximum compiler and linter strictness across all ecosystem repositories. Agents are strictly forbidden from relaxing configs or suppressing diagnostics."
---

# TypeScript (tsc) and ESLint Maximum Strictness Invariants

All AI coding agents and engineers working in all OmniButler ecosystem repository must strictly adhere to these compiler and linter strictness invariants.

---

## 1. Absolute Mandate: Zero-Tolerance Quality Gate

The OmniButler ecosystem enforces high-assurance, type-safe software development. Type errors and lint violations represent functional defects and potential runtime failures.

### Non-Negotiable Invariants
- **Zero Errors & Zero Warnings:** The two `npm run typecheck` (or `tsc --noEmit`) and `npm run lint` (or `eslint .`) must pass with exit code `0`.
- **Zero Tolerance for `any`:** Neither explicit `any` (`: any`, `as any`, `<any>`) nor implicit `any` is allowed in production code. Relaxed exclusively for test files (`*.test.ts`, `*.spec.ts`).
- **No Diagnostic Suppression:** Suppressing type checks or linter rules through comments, flags, or configuration overrides is **strictly prohibited**.

---

## 2. TypeScript Compiler (`tsc`) Maximum Strictness

### 2.1 Canonical Configuration
Every application and package in the ecosystem must extend the canonical configuration:
- Base: `@wiltermoodj/configs/tsconfig.base.json`
- Next.js apps: `@wiltermoodj/configs/tsconfig.nextjs.json`
- Shared packages: `@wiltermoodj/configs/tsconfig.library.json`

### 2.2 Mandatory Compiler Flags
The following flags are mandatory and must remain enabled in all TypeScript projects:

| Compiler Option | Setting | Requirement & Purpose |
| :--- | :--- | :--- |
| `strict` | `true` | Enables all strict type-checking options (`noImplicitAny`, `noImplicitThis`, `alwaysStrict`, `strictBindCallApply`, `strictNullChecks`, `strictFunctionTypes`, `strictPropertyInitialization`). |
| `noImplicitAny` | `true` | Forbids expressions and declarations with implied `any` type. |
| `noImplicitThis` | `true` | Forbids `this` expressions with an implied `any` type. |
| `strictNullChecks` | `true` | Considers `null` and `undefined` as distinct domain types. |
| `strictFunctionTypes` | `true` | Enforces contravariant parameter types for function parameters. |
| `strictBindCallApply` | `true` | Enforces stricter type checking for `bind`, `call`, and `apply` methods. |
| `strictPropertyInitialization` | `true` | Makes sure that class properties are initialized in the constructor. |
| `alwaysStrict` | `true` | Emits `"use strict"` and parses files in ECMAScript strict mode. |
| `noUncheckedIndexedAccess` | `true` | Appends `undefined` to index signatures and array lookups (`T[number] -> T \| undefined`). Forces bounds validation before access. |
| `exactOptionalPropertyTypes` | `true` | Differentiates omitted properties from explicit `undefined` values. |
| `noImplicitReturns` | `true` | Makes sure that every code branch in a function explicitly returns a value. |
| `noFallthroughCasesInSwitch` | `true` | Prevents unintentional fallthrough between switch clauses. |
| `noImplicitOverride` | `true` | Requires the `override` keyword when overriding derived class members. |
| `allowUnreachableCode` | `false` | Raises compiler errors for code following `return`, `throw`, or infinite loops. |
| `allowUnusedLabels` | `false` | Raises compiler errors for unused labels. |
| `isolatedModules` | `true` | Enforces safe compilation by single-file transpilers (Vite, esbuild, SWC). |

### 2.3 Forbidden TypeScript Anti-Patterns
1. **Explicit `any`:** Never use `any`. Use `unknown`, generics, or concrete domain types.
2. **Double Assertions / Unsafe Casts:** `expr as unknown as Target` or `expr as any as Target` are strictly forbidden. Use runtime narrowing, type guards, or Zod schema validation (`schema.parse()`).
3. **Non-Null Assertions (`!`):** Never use `foo!`. Validate existence with optional chaining (`?.`), nullish coalescing (`??`), or explicit runtime guards (`if (!foo) throw new Error(...)`).
4. **Banned Directives:**
   - `// @ts-ignore` is **strictly forbidden**.
   - `// @ts-nocheck` is **strictly forbidden**.
   - `// @ts-expect-error` is forbidden in production code. Permitted exclusively in negative test cases (`*.test.ts`) and must include a descriptive justification string.

---

## 3. ESLint Maximum Strictness

### 3.1 Canonical Configuration
All projects must use flat ESLint configurations importing:
- `@wiltermoodj/configs/eslint` (base rule set)
- `@wiltermoodj/configs/eslint/react` (for React and React Native components)
- `@wiltermoodj/configs/eslint/next` (for Next.js applications)

### 3.2 Zero-Tolerance ESLint Rules
The following zero-tolerance rules are configured as errors and must never be altered:

1. **Complete Ban on `any`:**
   - `@typescript-eslint/no-explicit-any: "error"`
   - `no-restricted-syntax: ["error", { "selector": "TSAnyKeyword" }]`
   - `@typescript-eslint/no-restricted-types: ["error", { "types": { "any": ... } }]`
2. **Prevention of `any` Propagation:**
   - `@typescript-eslint/no-unsafe-argument: "error"`
   - `@typescript-eslint/no-unsafe-assignment: "error"`
   - `@typescript-eslint/no-unsafe-call: "error"`
   - `@typescript-eslint/no-unsafe-member-access: "error"`
   - `@typescript-eslint/no-unsafe-return: "error"`
   - `@typescript-eslint/no-unsafe-type-assertion: "error"`
   - `@typescript-eslint/no-unsafe-unary-minus: "error"`
   - `@typescript-eslint/no-redundant-type-constituents: "error"`
   - `@typescript-eslint/no-unsafe-enum-comparison: "error"`
3. **Ban on Bypass Mechanisms:**
   - `@typescript-eslint/ban-ts-comment: ["error", { "ts-expect-error": true, "ts-ignore": true, "ts-nocheck": true }]`
   - `@typescript-eslint/no-non-null-assertion: "error"`
   - `@typescript-eslint/no-non-null-asserted-nullish-coalescing: "error"`
   - `@typescript-eslint/no-non-null-asserted-optional-chain: "error"`
   - `@typescript-eslint/consistent-type-assertions: ["error", { "assertionStyle": "as", "objectLiteralTypeAssertions": "never" }]`
4. **Boundary & Async Integrity:**
   - `@typescript-eslint/explicit-module-boundary-types: "error"`
   - `@typescript-eslint/no-floating-promises: "error"`
   - `@typescript-eslint/no-misused-promises: "error"`
   - `@typescript-eslint/await-thenable: "error"`
   - `@typescript-eslint/no-unused-vars: "error"`

### 3.3 Forbidden ESLint Anti-Patterns
1. **Comment Disables:** `/* eslint-disable */` and `// eslint-disable-next-line` comments are strictly forbidden on type-safety, null-safety, and any-propagation rules.
2. **Rule Downgrades:** Never downgrade a rule from `"error"` to `"warn"` or `"off"` in `eslint.config.*`.
3. **Build Ignoring:** In Next.js applications, setting `eslint: { ignoreDuringBuilds: true }` in `next.config.*` is **strictly forbidden**.

---

## 4. Strict Protocol for AI Coding Agents

When working in all OmniButler ecosystem repository, AI agents must abide by the following constraints:

### 4.1 Strictly Prohibited Agent Actions
1. **Never relax compiler configs:** Do not disable, weaken, or omit compiler options in `tsconfig.json` (such as setting `"strict": false`, removing `"noUncheckedIndexedAccess"`, or adding files to `"exclude"` to bypass errors).
2. **Never relax linter configs:** Do not edit `eslint.config.*` or `.eslintrc*` to mute errors, disable rules, or downgrade severities.
3. **Never suppress compiler checks in build tools:** Do not set `ignoreBuildErrors: true` (Next.js) or `transpileOnly: true` (webpack/ts-loader).
4. **Never modify package.json verification scripts:** Do not remove `tsc`, `typecheck`, or `lint` from `package.json` scripts or git hooks.
5. **Never add suppression directives:** Do not insert `// @ts-ignore`, `// @ts-nocheck`, `/* eslint-disable */`, or `// eslint-disable-next-line` to bypass checks.

### 4.2 Mandatory Remediation Protocol
When typecheck or lint errors occur, agents must fix the source code defects directly:
- **Missing types from third-party libraries:** Create an ambient module declaration in `src/types/<module>.d.ts` or wrap the untyped library with a typed internal module.
- **Unchecked index access (`T | undefined`):** Check bounds explicitly (`if (item !== undefined) { ... }`) or use optional chaining / default fallback.
- **Unknown external data:** Use Zod schemas (`schema.parse()`) or typed predicates (`function isItem(x: unknown): x is Item`) to validate data at runtime boundaries.
- **Unhandled promises:** Properly `await` asynchronous calls, return the promise, or handle rejection with `.catch()`.

---

## 5. Verification Commands

Before completing any task, agents must run the appropriate verification scripts and verify exit code `0`:

```bash
# TypeScript compiler check
npm run typecheck
# or
npx tsc --noEmit

# ESLint check
npm run lint
# or
npx eslint .
```

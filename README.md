# Full-Stack TypeScript Template

A production-ready, highly strict full-stack TypeScript template built with Next.js 16 (React 19), Drizzle ORM (PostgreSQL), Zod runtime validation, `@t3-oss/env-nextjs`, Vitest, Tailwind CSS v4, Lucide React, Prettier, and Husky with lint-staged.

---

## Strict TypeScript & ESLint Architecture

This repository enforces maximum strictness to eliminate implicit, explicit, and hidden type safety bypasses:

- **Zero `any` Policy**:
  - `noImplicitAny: true` in `tsconfig.json`.
  - `@typescript-eslint/no-explicit-any` with `fixToUnknown: true`.
  - Banned unsafe assignments, member accesses, function calls, returns, and arguments (`no-unsafe-*`).
- **No Non-Null Assertion Bypasses**:
  - `@typescript-eslint/no-non-null-assertion` is set to `error` (forbids `!` assertions).
- **No Unsafe Suppression Comments**:
  - `@typescript-eslint/ban-ts-comment` completely bans `@ts-ignore` and `@ts-nocheck`.
  - `@ts-expect-error` is permitted only when accompanied by a detailed description (minimum 10 characters).
- **Strict Array and Record Indexing**:
  - `noUncheckedIndexedAccess: true` requires explicitly checking for `undefined` when accessing dynamic indices.
- **Strict Optional Properties**:
  - `exactOptionalPropertyTypes: true` enforces exact value conformance for optional keys.
- **Controlled Type Assertions**:
  - `@typescript-eslint/consistent-type-assertions` prohibits object literal assertions and `as any` bypasses.

---

## Project Structure

```
├── .agents/                 # AI agent skills (Tale, Stubs, Design)
├── .husky/                  # Git hooks (pre-commit runs typecheck & lint-staged)
├── drizzle/                 # Generated database migrations
├── public/                  # Static assets
├── src/
│   ├── __tests__/           # Vitest unit and integration tests
│   ├── app/                 # Next.js App Router (pages, layouts, globals.css)
│   ├── db/                  # Drizzle ORM client, schemas, and drizzle-zod contracts
│   │   ├── index.ts         # Database connection client
│   │   └── schema.ts        # Table definitions and Zod validation schemas
│   └── env.ts               # Type-safe environment variable validation schema
├── drizzle.config.ts        # Drizzle Kit CLI configuration
├── eslint.config.mjs        # ESLint 9 flat configuration with typescript-eslint
├── next.config.ts           # Next.js configuration with early env validation
├── tsconfig.json            # Maximum-strictness TypeScript configuration
└── vitest.config.ts         # Vitest test runner configuration
```

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command                  | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `npm run dev`            | Starts Next.js development server with Turbopack    |
| `npm run build`          | Compiles optimized production Next.js build         |
| `npm run start`          | Runs the production build server                    |
| `npm run typecheck`      | Runs `tsc --noEmit` with maximum strictness         |
| `npm run lint`           | Runs ESLint 9 across all project files              |
| `npm run lint:fix`       | Runs ESLint and automatically applies safe fixes    |
| `npm run format:check`   | Checks code formatting against Prettier             |
| `npm run format:write`   | Formats all code using Prettier and Tailwind plugin |
| `npm run test`           | Runs Vitest unit tests                              |
| `npm run test:watch`     | Starts Vitest in interactive watch mode             |
| `npm run db:generate`    | Generates Drizzle SQL migrations from schema        |
| `npm run db:migrate`     | Applies pending Drizzle migrations                  |
| `npm run db:push`        | Pushes schema directly to PostgreSQL database       |
| `npm run db:studio`      | Opens Drizzle Studio browser interface              |
| `npm run lint:tale`      | Scans documentation for ASD-STE100 compliance       |
| `npm run lint:tale:code` | Scans source code comments for STE compliance       |

---

## Git Hooks & Code Quality

Husky runs automatically before each commit via `.husky/pre-commit`:

1. `npm run typecheck` - Verifies zero TypeScript errors.
2. `npx lint-staged` - Runs `eslint --fix`, `prettier --write`, and tests on modified files.

---

## Ecosystem Tooling & Skills

### Tale (ASD-STE100 Compliance)

Run this command from the root of any target repository:

```bash
curl -fsSL https://raw.githubusercontent.com/Wiltermoodj/template/main/.agents/skills/tale/scripts/install.sh | bash
```

### Stubs (Architecture-as-Code)

Install local dependency:

```bash
npm i -D github:Wiltermoodj/stubs && npx stubs init && npx stubs map --scaffold && npx stubs scan && npx stubs tree --graph
```

Or run via npx:

```bash
npx -y github:Wiltermoodj/stubs install && stubs init && stubs map --scaffold && stubs scan && stubs tree --graph
```

### Design System Skill

```bash
curl -fsSL https://raw.githubusercontent.com/Wiltermoodj/design/main/scripts/install-design-skill.sh | bash
```

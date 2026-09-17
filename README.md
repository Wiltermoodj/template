# Full-Stack TypeScript Template

A strict full-stack TypeScript template with Next.js, Drizzle ORM, Zod, Vitest, and Tailwind CSS.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router (pages, layouts, styles)
│   ├── db/                  # Drizzle ORM client, schemas, and queries
│   ├── env.ts               # Runtime environment validation
│   └── __tests__/           # Vitest unit and integration tests
├── drizzle/                 # Database migrations
└── .agents/                 # AI agent skills and governance rules
```

---

## Database Commands

| Command               | Description                                |
| --------------------- | ------------------------------------------ |
| `npm run db:push`     | Push schema changes directly to PostgreSQL |
| `npm run db:generate` | Generate SQL migrations from schema        |
| `npm run db:migrate`  | Apply pending migrations                   |
| `npm run db:studio`   | Open Drizzle Studio in browser             |

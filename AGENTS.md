---
title: "Agent Instructions and Repository Standards"
type: "instructions"
status: "active"
description: "Instructions for AI coding agents regarding skills, architecture context maps, and completion checks."
---

# Agent Instructions

All AI coding agents must follow these instructions when working in this repository.

<!-- stubs-instructions-start -->
## Planning Hub & 5-Phase Lifecycle

Planning hub index: knowledge/planning/planning-map.md
Lifecycle phases:
1. Conceptualize: problem framing, filetree blueprint (`stubs concept`)
2. Grill: stress-test decisions & ADRs (`stubs grill`)
3. Spec / Scaffold: OKF sidecar definitions & types (`stubs concept scaffold`)
4. Materialize: extract executable code (`stubs materialize`)
5. Sand & Audit: AST drift sync & health check (`stubs sand`, `stubs phase check`)

## Architecture Context Maps — Read First

Agent entry point: knowledge/architecture/context-map.md (human visual map: knowledge/architecture/visual-map.md. Agents ignore unless requested).
Repo ADRs: knowledge/architecture/ADR/ (ADR-001 agent-first format, ADR-002 domain clustering).
Subsystem index: src/INDEX.md.
Module specs: co-located `*.ts.md` sidecars in `src/`.

### Domain Context Maps

Domain-specific maps in knowledge/architecture/domains/ (generate through `npx stubs map --domains`).

## Architecture Graph & GraphRAG Intelligence

AST dependency graph in `.stubs/graph.sqlite` with Louvain community detection, PageRank centrality, FTS5 BM25 hybrid search.

- Querying GraphRAG: `npx stubs query "<query>"` (preferred single call, 3-tier progressive disclosure):
  - `npx stubs query "map:"`: Level 0 Macro Map (subsystem communities, hubs, domains)
  - `npx stubs query "stub: <target>"`: Level 1 Interface Skeleton Stubs (stripped signatures, types, line links)
  - `npx stubs query "explain: <target>"`: Level 2 Symbol Profile (callers, callees, PageRank)
  - `npx stubs query "path: <A> to <B>"`: Level 2 Shortest dependency path chain
  - `npx stubs query "blast: <target>"`: Level 2 Downstream impact radius and dependents
  - `npx stubs query "pkg:<package> <query>"`: Monorepo package-scoped query
  - `npx stubs query "<concept>"`: Multi-hop token-budgeted GraphRAG context retrieval
- Model Context Protocol (MCP): connect through standard JSON-RPC 2.0 stdio:
  ```json
  {
    "mcpServers": {
      "stubs": {
        "command": "node",
        "args": [".agents/skills/stubs/dist/cli.cjs", "mcp"]
      }
    }
  }
  ```
  (or `"command": "npx", "args": ["stubs", "mcp"]`). Ultra-lean suite exposes `stubs_query` and `stubs_scan`.
- Monorepo & workspace boundary resolution:
  - Discovers package boundaries through `package.json` (`workspaces`), `pnpm-workspace.yaml`, `Cargo.toml` (`[workspace]`), `go.work`.
  - Path aliases in `tsconfig.json` (`compilerOptions.paths`) and package exports map directly to canonical source files.
  - Monorepo query prefix: `pkg:<package>` (for example, `npx stubs query "pkg:billing invoice"`).
- Automatic graph maintenance: auto-checks file mtime (<30ms) for 0% staleness. Refresh manually through `npx stubs scan`.

## CLI Commands

- Scan & Index Code Graph: `npx stubs scan`
- Query GraphRAG Subgraph: `npx stubs query "<question>"`
- Unified Surgical Query: `npx stubs query "explain: <target>"` | `path: <A> to <B>` | `blast: <target>`
- Architecture Mapping: `npx stubs map --generate` (refreshes prerequisite domain maps + root context-map.md)
- Domain Maps Only: `npx stubs map --domains` | `npx stubs map --domain <name>`
- Visual Diagram: `npx stubs map --visual`
- Export Knowledge Graph: `npx stubs export <obsidian|wiki> [--out <dir>]`
- Start MCP Stdio Server: `npx stubs mcp`
- Install Assistant Rules: `npx stubs hook install`
- Audit ASD-STE100 Compliance: `npx stubs tale` (or `npm run tale`)
- Auto-Remediate Prose & Formatting: `npx stubs tale --fix` (or `npm run tale:fix`)

### ASD-STE100 Technical English & Formatting (Tale)

The repository enforces ASD-STE100 Issue 9 Simplified Technical English for documentation (*.md) and code comments.
- Audit Language & Formatting: `npx stubs tale` (or `npm run tale` / `npm run lint:tale`) — audits the two Markdown files and code comments across the workspace.
- Auto-Remediate Violations: `npx stubs tale --fix` (or `npm run tale:fix` / `npm run format:tale`) — safely fixes prose semicolons, contractions, Latin abbreviations, Markdown tables, and safe vocabulary in docs and comments without modifying executable code.
- File Scope & Exclusions: automatically skips build and test artifacts (`dist`, `node_modules`, `coverage`, `.stubs`), `.gitignore` paths, and strictly ignores `README.md` and `QUICKSTART.md`.
<!-- stubs-instructions-end -->

## 1. Architectural Context Map

Before you change code or design features, read [file:///Users/lappier/code/projects/template/knowledge/architecture/context-map.md].
This file contains the high-level architectural map of core domains, subsystem responsibilities, and data flows.

For detailed subsystem architectures, read the domain maps in [file:///Users/lappier/code/projects/template/knowledge/architecture/domains/].
When you introduce new domains, routes, or system boundaries, update the architectural context map.

## 2. Repository Skills in `.agents/skills`

This repository provides three primary skills located in [file:///Users/lappier/code/projects/template/.agents/skills]:

### 1. `stubs`

- **Location:** [file:///Users/lappier/code/projects/template/.agents/skills/stubs/SKILL.md]
- **Role:** Architecture-as-code planning and multi-language sidecar framework.
- **Key capabilities:** Context mapping, conceptualizing, grilling, sanding, materialization, and architectural linting.
- **Rule:** Keep the AST graph up to date. The hook in [file:///Users/lappier/code/projects/template/.agents/hooks.json] runs `npx stubs scan` on file changes.

### 2. `tale`

- **Location:** [file:///Users/lappier/code/projects/template/.agents/skills/tale/SKILL.md]
- **Role:** Enforces ASD-STE100 Issue 9 Simplified Technical English (STE).
- **Key capabilities:** Governs documentation, pull requests, agent reasoning, and code comments.
- **Rule:** Do not use semicolons, contractions, or unapproved terms. Obey sentence length limits.

### 3. `design`

- **Location:** [file:///Users/lappier/code/projects/template/.agents/skills/design/SKILL.md]
- **Role:** UI/UX standards, design tokens, accessibility, and component patterns.
- **Key capabilities:** Standardizes spacing, typography caps, elevation, touch targets, and color contracts.
- **Rule:** Follow all design invariants in [file:///Users/lappier/code/projects/template/RULES.md] and [file:///Users/lappier/code/projects/template/.agents/rules/design-rules.md].

## 3. Communication and Reasoning Standards

All agents must obey [file:///Users/lappier/code/projects/template/.agents/rules/agent-conciseness-and-tale.md]:

1. **Internal Monologue:**
   - Use 2 to 4 bullet points for each thought block.
   - Follow the structure: State, Intent, Action, Check.
   - Keep each sentence less than 20 words.
   - Do not write conversational text or full-file echoes.

2. **User Responses:**
   - Put actions and results in the first sentence.
   - Do not include polite preamble or conversational padding.
   - Provide clickable markdown links with `file:///` URLs for all files and code symbols.
   - When you create an artifact, direct the user to the artifact.

3. **Code and Comments:**
   - Zero `any` tolerance. Do not use non-null assertions (`!`) or unsafe casts.
   - Write comments in the simple present tense and active voice.
   - Never use semicolons or contractions in comments.

## 4. Completion Verification Checklist

When your work is finished, you must do all verification checks before you submit changes.

### Step 1: TypeScript Compiler Check (Maximum Strictness)

Run the TypeScript compiler to make sure that no type errors exist:

```bash
npm run typecheck
```

- The compiler must exit with code 0.
- Maximum compiler strictness is mandatory (`strict: true`, `noImplicitAny: true`, `noImplicitThis: true`, `strictNullChecks: true`, `strictFunctionTypes: true`, `strictBindCallApply: true`, `strictPropertyInitialization: true`, `alwaysStrict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`, `noImplicitReturns: true`, `noFallthroughCasesInSwitch: true`, `noImplicitOverride: true`, `allowUnreachableCode: false`, `allowUnusedLabels: false`).
- **Strict Prohibition:** Agents are strictly forbidden from modifying or relaxing `tsconfig.json` or bypassing checks (`// @ts-ignore`, `// @ts-nocheck`, `ignoreBuildErrors`).

### Step 2: Linter and Formatter Checks (Zero-Tolerance Rules)

Run ESLint and Prettier to validate code quality and formatting:

```bash
npm run lint
npm run format:check
```

- ESLint enforces zero tolerance for explicit or implicit `any`, unsafe operations, and assertion bypasses.
- **Strict Prohibition:** Agents are strictly forbidden from relaxing `eslint.config.*`, downgrading errors to warnings, or adding `/* eslint-disable */` / `// eslint-disable-next-line` comments.
- Refer to the full specification in [file:///Users/lappier/code/projects/template/.agents/rules/tsc-and-eslint-rules.md].

To fix automatic lint and formatting issues, run:

```bash
npm run lint:fix
npm run format:write
```

### Step 3: Tale STE Linter Check

Run the Tale linter to make sure that documentation and code comments obey STE rules:

```bash
# Validate markdown documentation
npm run lint:tale

# Validate code comments in source files
npm run lint:tale:code
```

Make sure that newly authored or modified files pass with zero errors.

### Step 4: Stubs AST Graph Synchronization

Synchronize the dependency graph when you add, move, or modify code files:

```bash
npx stubs scan
```

Make sure that `.stubs/graph.sqlite` contains the updated AST relationships.

### Step 5: Test Suite

Run the test suite to verify that existing functionality does not break:

```bash
npm run test
```

All unit and integration tests must pass.

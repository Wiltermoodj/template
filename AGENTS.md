---
title: "Agent Instructions and Repository Standards"
type: "instructions"
status: "active"
description: "Instructions for AI coding agents regarding skills, architecture context maps, and completion checks."
---

# Agent Instructions

All AI coding agents must follow these instructions when working in this repository.

---

## 1. Architectural Context Map

Before you change code or design features, read [context-map.md](file:///Users/lappier/code/projects/template/knowledge/architecture/context-map.md).
This file contains the high-level architectural map of core domains, subsystem responsibilities, and data flows.

For detailed subsystem architectures, read the domain maps in [domains/](file:///Users/lappier/code/projects/template/knowledge/architecture/domains/).
When you introduce new domains, routes, or system boundaries, update the architectural context map.

---

## 2. Repository Skills in `.agents/skills`

This repository provides three primary skills located in [.agents/skills](file:///Users/lappier/code/projects/template/.agents/skills):

### 1. `stubs`

- **Location:** [.agents/skills/stubs/SKILL.md](file:///Users/lappier/code/projects/template/.agents/skills/stubs/SKILL.md)
- **Role:** Architecture-as-code planning and multi-language sidecar framework.
- **Key capabilities:** Context mapping, conceptualizing, grilling, sanding, materialization, and architectural linting.
- **Rule:** Keep the AST graph up to date. The hook in [.agents/hooks.json](file:///Users/lappier/code/projects/template/.agents/hooks.json) runs `npx stubs scan` on file changes.

### 2. `tale`

- **Location:** [.agents/skills/tale/SKILL.md](file:///Users/lappier/code/projects/template/.agents/skills/tale/SKILL.md)
- **Role:** Enforces ASD-STE100 Issue 9 Simplified Technical English (STE).
- **Key capabilities:** Governs documentation, pull requests, agent reasoning, and code comments.
- **Rule:** Do not use semicolons, contractions, or unapproved terms. Obey sentence length limits.

### 3. `design`

- **Location:** [.agents/skills/design/SKILL.md](file:///Users/lappier/code/projects/template/.agents/skills/design/SKILL.md)
- **Role:** UI/UX standards, design tokens, accessibility, and component patterns.
- **Key capabilities:** Standardizes spacing, typography caps, elevation, touch targets, and color contracts.
- **Rule:** Follow all design invariants in [RULES.md](file:///Users/lappier/code/projects/template/RULES.md) and [.agents/rules/design-rules.md](file:///Users/lappier/code/projects/template/.agents/rules/design-rules.md).

---

## 3. Communication and Reasoning Standards

All agents must obey [.agents/rules/agent-conciseness-and-tale.md](file:///Users/lappier/code/projects/template/.agents/rules/agent-conciseness-and-tale.md):

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

---

## 4. Completion Verification Checklist

When your work is finished, you must do all verification checks before you submit changes.

### Step 1: TypeScript Compiler Check

Run the TypeScript compiler to make sure that no type errors exist:

```bash
npm run typecheck
```

The compiler must exit with code 0.

### Step 2: Linter and Formatter Checks

Run ESLint and Prettier to validate code quality and formatting:

```bash
npm run lint
npm run format:check
```

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

---
title: Core Entrypoints & Runtime — Domain Context Map
type: domain-context-map
domain: core
parent_map: ../context-map.md
description: Deep-dive context map for the core domain, subsystem responsibilities, and internal modules.
tags:
  - domain-map
  - core
  - agent-optimized
---

# Core Entrypoints & Runtime — Domain Context Map

Parent Context Map: knowledge/architecture/context-map.md

## Domain Purpose & Responsibilities
The Core Entrypoints & Runtime coordinates domain logic, core types, and services for the core subsystem.

## Key Modules & Files
src/db/index.ts (Hub) -> deps: none | caps: Database
src/app/layout.tsx -> deps: none | caps: RootLayoutProps, RootLayout
src/db/schema.ts -> deps: none | caps: User, NewUser
src/app/page.tsx -> deps: none | caps: Home
src/env.ts -> deps: none | caps: internal

## Domain Invariants
- Downward dependencies only: cross-domain calls must target canonical domain hubs.
- External consumers must interface through index.ts, never private internal helpers.
- State changes must adhere to lifecycle and containment invariants.

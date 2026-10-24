---
title: Project Architecture Context Map
type: context-map
description: High-level architectural map of core domains, subsystem responsibilities, and dependency flows.
tags:
  - architecture
  - context-map
  - agent-optimized
---

# Architecture Context Map

## Routing & Entrypoints
Entry (Layer 0): src/db/index.ts -> domain: core
Entry (Layer 0): src/app/layout.tsx -> domain: core
Entry (Layer 0): src/db/schema.ts -> domain: core

## Subsystem Matrix
Core Entrypoints & Runtime (L1): src/db/index.ts -> deps: none | caps: Database, RootLayoutProps, RootLayout, User

## Domain Maps & Specs
- core: knowledge/architecture/domains/core-domain-map.md (hub: src/db/index.ts)

## Boundary Invariants
- Downward dependencies only: consumers depend on lower layers, never higher layers.
- Cross-domain calls must target the domain canonical hub module, never internal private helpers.
- Repo-level architectural decisions recorded in knowledge/architecture/ADR/. Module nuances recorded in domain maps and sidecars.

## Visual Architecture Map
Human visual Mermaid diagrams: knowledge/architecture/visual-map.md (agents: do not read unless requested)

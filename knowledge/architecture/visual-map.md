---
title: Project Architecture Visual Diagram
type: visual-diagram
audience: human-developer
tags:
  - architecture
  - visual
  - mermaid
---

# Architecture Visual Map

<!-- For AI coding agents: read knowledge/architecture/context-map.md or run npx stubs query "map:" -->

```mermaid
flowchart TD
  subgraph L6 ["Layer 6: Interface"]
    n_src___tests___example_test_ts["example.test.ts"]
    n_src_app_layout_tsx["layout.tsx"]
    n_src_app_page_tsx["page.tsx"]
    n_src_db_index_ts["index.ts"]
    n_src_db_schema_ts["schema.ts"]
    n_src_env_ts["env.ts"]
  end
  n_src_db_index_ts --> n_src_db_schema_ts
```

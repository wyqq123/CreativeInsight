# Architecture Overview

CreativeInsight MVP follows a **modular monolith + async workers** model to balance speed of delivery and future scale.
The system focuses on three value chains: experiment design, cross-platform winning creative management, and AI labeling with insight reports.

## System Topology

```mermaid
flowchart LR
    U[Web User] --> FE[Next.js Web App]
    FE --> API[NestJS API]

    API --> AUTH[Auth Module]
    API --> EXP[Experiment Module]
    API --> INT[Integration Module]
    API --> CRE[Creative Module]
    API --> LBL[Labeling Module]
    API --> INS[Insight Module]
    API --> BILL[Billing Module]

    API --> PG[(PostgreSQL)]
    API --> REDIS[(Redis)]
    API --> OBJ[(Object Storage)]

    INT --> Q[Job Queue]
    LBL --> Q
    INS --> Q

    Q --> W1[Sync Worker]
    Q --> W2[AI Label Worker]
    Q --> W3[Report Worker]

    W1 --> EXT[Ad Platform APIs]
    W2 --> AIGW[AI Gateway]
    W3 --> PG
```

## Core Principles

- Monolith first, but enforce strict module boundaries.
- Strong consistency on write paths; optional cached/pre-aggregated read paths.
- Treat all third-party dependencies as unreliable: timeout, retry, circuit-break, degrade.
- Define idempotency and concurrency contracts before business implementation.

## Tech Stack Snapshot

- Frontend: Next.js, TypeScript, Tailwind, shadcn/ui
- Backend: NestJS, REST + OpenAPI, PostgreSQL, Redis, BullMQ
- AI/media: AI gateway, ASR provider, FFmpeg worker, schema-validated labeling output
- Observability: OpenTelemetry, Loki, Prometheus/Grafana, Sentry

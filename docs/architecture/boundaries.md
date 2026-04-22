# Module Boundaries and Dependency Rules

## Domain Modules

- `auth`: identity, session, and provider auth lifecycle
- `experiments`: calculator config, sample-size persistence, experiment setup metadata
- `integrations`: OAuth onboarding, platform account state, sync orchestration
- `creatives`: creative assets, winner status lifecycle, batch operations
- `labeling`: label task orchestration, AI label ingestion, human review confirmation
- `insights`: report generation jobs, report materialization, export
- `billing`: plan state, paywall gating, quota checks

## Allowed Dependency Direction

Use one-way dependency flow:

1. Interface / API layer
2. Application service layer
3. Domain service layer
4. Infrastructure adapters

Rules:

- Modules communicate through service interfaces or events, not direct table-level coupling.
- No module may mutate another module's private persistence schema directly.
- Infra adapters (AI providers, ad APIs, object storage) are isolated behind gateway interfaces.

## Data Ownership

- `experiments` owns experiment configuration and sample-size outputs.
- `integrations` owns platform token state and sync-job lifecycle.
- `creatives` owns creative asset records and winner-state transitions.
- `labeling` owns label tasks and final label confirmation state.
- `insights` owns report state machine and serialized report outputs.
- `billing` owns plan and quota enforcement inputs consumed by report generation.

## Cross-Cutting Constraints

- Every mutating endpoint must support idempotency key handling.
- Concurrency-sensitive writes must use optimistic version checks.
- All read/write access must be tenant-scoped by `org_id`.
- Error responses must be standardized and traceable with `requestId`.

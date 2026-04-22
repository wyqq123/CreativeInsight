# Data Flow

## End-to-End Flow

```mermaid
flowchart TD
    A[User configures experiment inputs] --> B[Calculator API estimates sample size and duration]
    B --> C[User saves experiment config]

    C --> D[User authorizes ad platform accounts]
    D --> E[Integration module schedules sync jobs]
    E --> F[Sync worker fetches platform experiment and creative data]
    F --> G[Creative assets stored with winner candidates]

    G --> H[User confirms winner creatives and queues labeling]
    H --> I[Label worker calls AI gateway and writes suggested labels]
    I --> J[User reviews and confirms labels]
    J --> K[Knowledge-ready labeled creatives]

    K --> L[User requests insight report]
    L --> M[Report worker aggregates labels + metrics]
    M --> N[Insight report persisted and rendered]
    N --> O[Optional PDF export]
```

## Async Pipeline States

- Sync jobs: `queued -> running -> success | partial_failed | failed`
- Label tasks: `queued -> running -> awaiting_review -> completed | failed`
- Insight reports: `queued -> running -> ready | failed`

## Reliability Controls by Flow Stage

- External sync and AI calls: timeout + exponential backoff retry for retryable errors only.
- Idempotent write actions: create job, batch label confirm, report generation, export.
- Failure visibility: explicit error codes and messages attached to async task records.
- Recovery model: users can re-trigger failed stages without duplicating successful work.

# Current Sprint (MVP Delivery Focus)

## Sprint Objective

Deliver the minimum closed-loop path from experiment planning to insight report generation.

## Priority Workstreams

1. Calculator correctness and save flow
   - implement new sample-size inputs and formulas
   - include duration correction factors
2. Platform integration baseline
   - OAuth onboarding for priority platforms
   - manual + scheduled sync job execution and status visibility
3. Creative operations
   - winner status workflow
   - batch enqueue for labeling tasks
4. Labeling and reporting
   - AI suggestion ingestion
   - human review confirmation
   - report generation for eligible asset sets

## Definition of Done

- Endpoints follow idempotency and error conventions.
- Async states are visible and recoverable.
- Core P0 UX routes are usable end to end.
- Critical monitoring/logging signals are present.

## Known Risks This Sprint

- External API instability and quota/rate constraints
- AI schema drift or output quality variance
- Misalignment between frontend state and backend state transitions

# Testing Conventions

## Scope Priorities

Test in this order of business risk:

1. Experiment calculator correctness (sample size and duration logic)
2. Sync pipeline reliability and idempotency
3. Winner status and label review state transitions
4. Insight report generation and plan-gating behavior

## Required Test Types

- Unit tests
  - statistical formulas, penalty/design-effect calculations, duration correction
  - enum/state transition guards
- Integration tests
  - idempotent endpoint behavior
  - optimistic concurrency conflict paths
  - external adapter error mapping
- Contract tests
  - response envelope and error code compatibility
  - async status polling payload shape
- E2E smoke tests
  - calculator -> save -> sync -> labeling -> report path

## Minimal Acceptance Assertions

- Same `Idempotency-Key` does not produce duplicate side effects.
- Non-user randomization inputs apply design effect correctly.
- Report generation enforces free/pro capability boundaries.
- Failed async tasks are visible and recoverable via retry.

## Test Data Guidelines

- Include both binomial metrics (CTR/CVR) and continuous metrics (CPA/ROAS).
- Cover traffic split extremes (`k=1`, `k>1`, heavily imbalanced allocations).
- Cover attrition and delayed-conversion multipliers in duration estimates.

# Error Handling Conventions

## Response Envelope

All API responses should follow a consistent envelope:

```json
{
  "requestId": "req_xxx",
  "code": "OK",
  "message": "success",
  "data": {}
}
```

## Error Model

- `code`: machine-readable, stable error identifier
- `message`: concise human-readable explanation
- `requestId`: required for trace/debug correlation
- `data`: optional context payload (safe, non-sensitive)

## Retry and Timeout Rules

- Retry only retryable categories: `429`, `5xx`, network timeout.
- Do not retry business-invalid `4xx` errors except explicitly retriable conflict/rate cases.
- Default backoff: `500ms, 1s, 2s, 4s` with max 4 attempts.
- Typical timeout budgets:
  - API gateway: 10s
  - External platform call: 5s
  - AI call: 20s

## Conflict and Idempotency

- Optimistic conflict returns dedicated code (for example `VERSION_CONFLICT`) with latest version context.
- Duplicate idempotent requests must return first successful outcome, not enqueue duplicate jobs.
- If a same-account sync is already running, return conflict (`SYNC_ALREADY_RUNNING`) instead of parallel execution.

## Async Failure Behavior

- Persist terminal failure state on job/task entities with `error_code` and `error_message`.
- Allow explicit user retry from failed state.
- Use partial-failure status where partial success is meaningful (`partial_failed` for sync).

# Error Codes Reference

This list is a starter reference for MVP-level API and async workflow errors.

| Code | HTTP | Meaning | Typical Action |
| --- | --- | --- | --- |
| `OK` | 200 | Request succeeded | Continue flow |
| `VALIDATION_ERROR` | 400 | Input schema or business validation failed | Fix input and retry |
| `IDEMPOTENCY_KEY_REQUIRED` | 400 | Mutating idempotent endpoint missing `Idempotency-Key` | Add header and retry |
| `UNAUTHORIZED` | 401 | Missing or invalid auth | Re-authenticate |
| `FORBIDDEN` | 403 | Access denied for current tenant/role | Verify permissions |
| `NOT_FOUND` | 404 | Resource does not exist or not visible | Recheck identifier and scope |
| `VERSION_CONFLICT` | 409 | Optimistic lock conflict on update | Refresh latest state and retry |
| `SYNC_ALREADY_RUNNING` | 409 | A sync job is already active for target account | Wait or poll existing job |
| `TOO_MANY_REQUESTS` | 429 | Rate limited by internal/external dependency | Backoff and retry |
| `EXTERNAL_API_TIMEOUT` | 504 | External platform call timed out | Retry with backoff |
| `AI_SCHEMA_INVALID` | 502 | AI response could not pass schema validation | Retry/fallback model |
| `ASYNC_TASK_FAILED` | 500 | Background task reached failed terminal state | Inspect task error and re-run |
| `INTERNAL_ERROR` | 500 | Unexpected server-side failure | Use request ID for debugging |

## Notes

- Mutating endpoints should support `Idempotency-Key` to avoid duplicate side effects.
- Async entities should persist `error_code` and `error_message` for user-visible recovery.

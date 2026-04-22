# Engineering Conventions Index

This section defines implementation-level conventions for CreativeInsight MVP.
Use linked files below before writing or reviewing code.

## Convention Documents

- Naming standards: `naming.md`
- Error handling standards: `error-handling.md`
- Testing standards: `testing.md`
- Logging standards: `logging.md`

## Core Enforcement Priorities

1. Stable contracts: API request/response and async state machine consistency
2. Operational safety: idempotency, concurrency control, retry boundaries
3. Tenant isolation: every access path scoped by `org_id`
4. Traceability: request IDs, structured logs, deterministic error codes

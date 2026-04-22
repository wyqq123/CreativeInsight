# Logging Conventions

## Logging Objectives

- Make asynchronous failures diagnosable without reproducing.
- Preserve per-request and per-job traceability across services/workers.
- Keep sensitive data protected while retaining operational context.

## Required Structured Fields

- `timestamp`
- `level`
- `service` (web/api/worker type)
- `module` (auth, integrations, labeling, insights, etc.)
- `requestId`
- `orgId` (when available)
- `jobId` / `taskId` (for async workloads)
- `event`
- `errorCode` (on failures)

## Event Coverage

- Auth and permission decision points (success/failure)
- Sync job lifecycle transitions
- Label task lifecycle transitions
- Report generation lifecycle transitions
- Critical business mutations (winner status update, label confirmation, export actions)

## Redaction Rules

- Never log OAuth tokens, access secrets, raw credentials, or full PII.
- Store hashed/masked forms when correlation is needed.
- Keep logs tenant-safe; no cross-tenant payload leakage.

## Operational Integration

- Emit OpenTelemetry traces for API and worker pipelines.
- Route errors to Sentry with preserved request/job identifiers.
- Keep log levels intentional:
  - `INFO`: lifecycle checkpoints
  - `WARN`: recoverable degradation
  - `ERROR`: user-impacting or terminal failures

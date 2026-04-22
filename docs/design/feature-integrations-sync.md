# Feature: Platform Integrations and Sync

**Status: 📋 Approved (P0)**

## Goal

Connect ad platforms and continuously import experiment/creative data into a single tenant-safe workspace.

## Functional Scope

- OAuth onboarding for priority platforms (`qianchuan`, `xiaohongshu`, `kuaishou`)
- Manual sync trigger and scheduled sync
- Sync job progress and failure visibility
- Incremental ingestion with cursor persistence

## Out of Scope (MVP)

- Meta Ads integration (phase 2)
- Multi-region sync orchestration

## Async State Machine

- `sync_jobs`: `queued -> running -> success | partial_failed | failed`
- Partial failures are allowed when only part of data or platform calls fail

## API Contracts (P0)

- `POST /integrations/oauth/{platform}/callback` (idempotent callback handling)
- `POST /sync-jobs` (idempotent, conflict if same account already running)
- `GET /sync-jobs/{id}` (progress/status polling)

## Reliability Rules

- External call timeout: 5s per call
- Retryable categories: `429`, `5xx`, network timeout
- Exponential backoff: `500ms, 1s, 2s, 4s`
- Max attempts: 4

## Concurrency and Isolation

- Single active sync per `(org_id, platform_account_id)`
- Conflict response when already running: `SYNC_ALREADY_RUNNING`
- All imported data bound to tenant via `org_id`

## DoD

- Successful OAuth account can create sync jobs
- Failed/partial sync stores `error_code` and `error_message`
- User can retry failed sync without creating duplicate side effects

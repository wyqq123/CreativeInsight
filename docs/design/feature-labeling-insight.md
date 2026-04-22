# Feature: AI Labeling and Insight Reporting

**Status: 📋 Approved (P0 core, PDF export P1)**

## Goal

Convert winning creatives into structured, reusable strategy insights through AI-assisted labeling and report generation.

## Functional Scope

- Create labeling tasks from selected creative assets
- Ingest AI-suggested labels with confidence scores
- Human review/confirmation and manual correction
- Generate insight reports for eligible asset sets
- Report tier gating (free vs pro) and optional PDF export

## Out of Scope (MVP)

- User-defined taxonomy (phase 2)
- Script/storyboard generation from report outputs (phase 2)

## Async State Machines

- `label_tasks`: `queued -> running -> awaiting_review -> completed | failed`
- `insight_reports`: `queued -> running -> ready | failed`

## Key Business Rules

- Label dimensions follow predefined taxonomy (`hook`, `selling_point`, `character`, `emotion`, `visual`, `cta`, `duration`)
- Report generation requires labeled winning creatives
- Full attribution report path requires at least 5 labeled winning assets
- Free/pro gating determines module depth and export availability

## API Contracts (P0)

- `POST /label-tasks` (idempotent)
- `GET /label-tasks/{id}`
- `POST /labels/review/confirm-batch` (idempotent + partial conflict handling)
- `POST /insight-reports` (idempotent)
- `GET /insight-reports/{id}`
- `POST /insight-reports/{id}/export-pdf` (idempotent; P1)

## Reliability Rules

- AI response must pass schema validation; otherwise retry/fallback
- Persist terminal failures with `error_code`, `error_message`
- User can re-trigger failed tasks without duplicating completed steps

## DoD

- AI suggestions are visible with confidence and reviewable by humans
- Confirmed labels are persisted as final and queryable by report pipeline
- Report task status is observable and retryable

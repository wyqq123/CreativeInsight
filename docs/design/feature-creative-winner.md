# Feature: Creative Management and Winner Workflow

**Status: 📋 Approved (P0 core + P1 search depth)**

## Goal

Centralize cross-platform creative assets and provide an auditable winner marking workflow.

## Functional Scope

- List creatives by brand/platform/time window
- Winner status lifecycle management
- Batch enqueue selected winners to labeling queue
- Basic search/filter support (expanded capabilities in P1)

## Winner Status Lifecycle

- `unknown -> candidate -> confirmed`
- `candidate -> excluded`
- `confirmed -> excluded` (allowed with explicit user action)
- No hard delete of business status; state history should be auditable

## API Contracts (P0)

- `GET /creatives`
- `PATCH /creatives/{id}/winner-status` (idempotent + optimistic concurrency)
- `POST /creatives/batch/queue-labeling` (idempotent)

## Concurrency Rules

- Winner status updates require version check (`If-Match` or `lastKnownVersion`)
- Conflict response: `VERSION_CONFLICT`
- Batch enqueue must deduplicate same asset IDs within request and against active tasks

## Reliability Rules

- Mutating endpoints must require `Idempotency-Key`
- On partial batch failure, return per-item result details

## DoD

- Users can move creatives across winner states with conflict-safe behavior
- Batch enqueue produces one labeling task set without duplicate submissions
- Filter context can be preserved when moving to report generation

# Naming Conventions

## General

- Use descriptive names aligned with domain language from product docs.
- Prefer singular nouns for entities (`creative_asset`, `insight_report`).
- Keep status enums explicit and finite; avoid vague values like `done` or `ok`.

## API

- Base path: `/api/v1`
- Resource naming: plural nouns (`/sync-jobs`, `/insight-reports`)
- Action endpoints: verb only when not resource-shaped (`/labels/review/confirm-batch`)
- Headers:
  - `Idempotency-Key` for mutating idempotent operations
  - `X-Request-Id` for traceability

## Database

- Table names: `snake_case` plural (`platform_accounts`, `label_tasks`)
- Foreign keys: `<entity>_id` (`org_id`, `asset_id`)
- Timestamp fields: `<event>_at` (`created_at`, `finished_at`)
- Enum columns: explicit suffix where useful (`winner_status`, `oauth_status`)

## Frontend and Types

- TypeScript interfaces/types: `PascalCase` (`InsightReportDTO`)
- Component names: `PascalCase`
- State keys and variables: `camelCase`
- Keep DTO names consistent with API contracts; avoid ad-hoc field aliases unless mapped explicitly.

# Feature: Search and Filtering

**Status: 📋 Approved (MVP/P1 hybrid, implementation can be phased)**

## Goal

Allow users to quickly locate creatives, experiments, and labeled assets across brands, platforms, and time ranges.

## Functional Scope

- Filter creatives by brand, platform, date range, and winner status
- Search labeled assets in the creative knowledge layer
- Support pagination and stable sorting for large datasets

## Data and Query Model

- Base storage: PostgreSQL with JSONB metrics
- Text and partial matching: GIN/trigram strategy in MVP
- Indexed filters: org, brand, platform, status, created/ingested timestamps

## UX Expectations

- Fast filter feedback without full page context loss
- Empty-state guidance when no matches
- Preserve current filter context when moving to report generation

## Out of Scope (Current MVP)

- Cross-tenant global search
- Advanced semantic retrieval
- Real-time collaborative saved queries

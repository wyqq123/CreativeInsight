# Feature: Experiment Calculator

**Status: 📋 Approved (P0)**

## Goal

Provide reliable A/B experiment planning guidance (sample size, duration, run-eligibility diagnosis) in under 30 seconds.

## Functional Scope

- Estimate per-group sample size for core metrics (`CTR/CVR/CPA/ROAS/ROI`)
- Estimate recommended experiment duration based on traffic and attrition
- Return run-condition diagnostics and explanatory notes
- Save calculator configuration as reusable experiment record

## Out of Scope (MVP)

- Real-time experiment monitoring and stop recommendations
- In-flight data ingestion and auto-recalculation from platform runtime data

## Key Inputs

- Platform, randomization unit, core metric, guard metric (optional)
- Baseline, MDE, alpha, power
- Traffic split `k_variant_over_control`
- Daily traffic and attrition rate
- `std_control/std_variant` required for continuous metrics (`CPA/ROAS`)

## Core Outputs

- `sample_size_each`
- `recommended_days`
- `diagnosis` (`ready`, `traffic_insufficient`, `input_invalid`)
- human-readable notes for business explanation

## State and Validation Rules

- Metric-dependent validation:
  - `CTR/CVR`: no std fields required
  - `CPA/ROAS`: std fields required and must be positive
- Inputs failing validation return `VALIDATION_ERROR`
- Save operation is idempotent via `Idempotency-Key`

## API Contracts (P0)

- `POST /calculator/estimate`
- `POST /experiment-configs` (idempotent)

## Reliability and Concurrency

- Estimate endpoint is pure compute and side-effect free
- Save endpoint must deduplicate repeated submissions by same idempotency key
- All persisted records are tenant scoped by `org_id`

## DoD

- Returned sample size and duration are deterministic for same input payload
- Validation errors are field-mappable on frontend
- Saved experiment config can be referenced by downstream creative workflows

# CreativeInsight AGENT Playbook

This file is the persistent bootstrap context for all new agent conversations in this repository.
Use it as the first read, then navigate to `docs/` for detailed knowledge.

## 1) Product Description

CreativeInsight is a lightweight SaaS product for advertising agencies' creative strategy teams.
It solves one core problem: winning creative knowledge is usually fragmented across ad platforms and not systematically reusable.

The MVP value loop has three connected stages:

1. **Experiment Planning**: A/B test calculator for sample size and duration planning.
2. **Winning Creative Aggregation**: Cross-platform authorization and sync into one workspace.
3. **AI Labeling and Insight Reporting**: Structured label extraction + reusable strategy reports.

Primary user: agency creative strategists/media optimizers managing multiple brands across platforms.

## 2) Project Goals and Key Functional Modules

### Business and Product Goals

- Validate MVP with first paying users.
- Prove end-to-end workflow: data import -> labeling -> insight report generation.
- Build repeatable, report-ready creative strategy output for agency-client reviews.

### North-Star Signal

- Monthly generated valid insight reports (based on sufficiently labeled winning creatives).

### Key Modules

- `Module A`: Experiment calculator (lead acquisition and trust-building).
- `Module B`: Cross-platform winning creative management (paid core).
- `Module C`: AI labeling and attribution insight reports (core differentiation).

## 3) Technical Stack Selection

### Application and Infrastructure

- Frontend: Next.js + TypeScript + Tailwind + shadcn/ui
- Backend: NestJS + REST/OpenAPI + PostgreSQL + Redis + BullMQ
- Storage and processing: S3-compatible object storage, async workers
- AI/media: AI gateway abstraction, ASR integration, FFmpeg worker
- Observability: OpenTelemetry, Loki, Prometheus/Grafana, Sentry

### Current Repository Runtime (confirmed)

- Active runnable subproject: `remotion/`
- Package manager/runtime path: `remotion/package.json`
- Core scripts:
  - `npm run dev`
  - `npm run build`
  - `npm run lint`

## 4) Quick Navigation Index (Structured Knowledge)

Use this index to route tasks quickly.

### Architecture Layer (stable)

- Architecture overview: `docs/architecture/overview.md`
- Module boundaries and dependency rules: `docs/architecture/boundaries.md`
- End-to-end data flow and async lifecycle: `docs/architecture/data-flow.md`

### Conventions Layer (updated occasionally)

- Conventions index: `docs/conventions/README.md`
- Naming conventions: `docs/conventions/naming.md`
- Error handling conventions: `docs/conventions/error-handling.md`
- Testing conventions: `docs/conventions/testing.md`
- Logging conventions: `docs/conventions/logging.md`

### Design Layer (feature-oriented)

- Experiment calculator: `docs/design/feature-calculator.md`
- Platform integrations and sync: `docs/design/feature-integrations-sync.md`
- Creative winner workflow: `docs/design/feature-creative-winner.md`
- AI labeling and insights: `docs/design/feature-labeling-insight.md`
- Auth and access: `docs/design/feature-auth.md`
- Search and filtering: `docs/design/feature-search.md`
- Billing and plan gating: `docs/design/feature-billing.md`

### Planning Layer (frequently updated)

- Current sprint focus: `docs/plans/current-sprint.md`
- Backlog: `docs/plans/backlog.md`

### Reference Layer

- API contract: `docs/reference/api-spec.yaml`
- Error code map: `docs/reference/error-codes.md`

### Recommended Read Order for New Execution Tasks

1. `docs/architecture/overview.md`
2. `docs/architecture/boundaries.md`
3. `docs/architecture/data-flow.md`
4. `docs/design/feature-calculator.md`
5. `docs/design/feature-integrations-sync.md`
6. `docs/design/feature-creative-winner.md`
7. `docs/design/feature-labeling-insight.md`
8. `docs/reference/api-spec.yaml`
9. `docs/reference/error-codes.md`

## 5) Build and Test

When changes touch runnable code (currently `remotion/`):

1. Install dependencies in `remotion/`:
   - `npm install`
2. Run local checks:
   - `npm run lint`
3. Run build validation:
   - `npm run build`
4. Optional local preview:
   - `npm run dev`

Validation policy:

- Always run lint/build for touched runtime modules whenever feasible.
- If a command cannot be run, document the reason and provide a manual verify path.

## 6) Multi-Agent Workflow

Use a staged multi-agent workflow for larger tasks and PR-quality output.

### Stage 1: Context and Planning Agent

- Goal: gather relevant product/architecture context and define implementation scope.
- Inputs: task statement + `docs/` index.
- Output: concise execution plan with risks and affected modules.

### Stage 2: Implementation Agent

- Goal: implement minimal correct changes based on the approved scope.
- Requirements:
  - preserve module boundaries
  - follow naming/error/testing/logging conventions
  - avoid unrelated refactors

### Stage 3: Code Review Agent (Mandatory for substantial changes)

- Use: `C:\Users\WYQQ\.claude\skills\code-review-expert\SKILL.md`
- Review focus:
  - SOLID and architectural integrity
  - security/reliability issues
  - error handling/performance/boundary conditions
  - removal candidates and follow-up plan
- Severity model: P0/P1/P2/P3
- Default behavior: review-first, implementation only after explicit user approval.

### Stage 4: Verification Agent

- Run build/lint/tests for changed modules.
- Confirm no regression in critical path behaviors.
- Report residual risks and unverified assumptions.

## 7) Critical Constraints

- Keep tenant isolation strict (`org_id`-scoped access patterns).
- Enforce idempotency for mutating operations that can be retried/replayed.
- Apply optimistic concurrency control where shared records can be edited concurrently.
- Treat third-party APIs and AI services as unreliable dependencies (timeouts/retries/fallback).
- Never expose secrets/tokens in logs, docs, or code examples.
- If source knowledge and digest differ, update `docs/` to keep persistent context aligned.

## 8) Commit and Change Submission Conventions

### Commit Scope

- Keep commits focused on one logical change set.
- Avoid mixing product docs, refactors, and behavior changes unless tightly coupled.

### Commit Message Style

- Prefer concise imperative style with purpose:
  - `docs: refine architecture boundary rules for agent routing`
  - `feat: add idempotent handling for sync job creation`
  - `fix: guard report generation against duplicate task submission`

### Pre-Submission Checklist

- Relevant docs updated when behavior/contract changes.
- Lint/build/test completed or explicitly documented if skipped.
- No secret or credential artifacts added.
- Risky behavior changes include rollback or mitigation notes.

## 9) Source of Truth Policy

- Original knowledge files: `CreativeInsightKnowldege/`
- Structured, agent-first knowledge: `docs/`
- Agent startup entrypoint: this `AGENT.md`

Documentation status semantics:

- `Draft`: direction only, not stable contract
- `Approved`: implementation target contract
- `Implemented`: must be verified by code/reference evidence

When conflicts exist:

1. Trust source knowledge files.
2. Update `docs/` to match.
3. Keep `AGENT.md` navigation valid.

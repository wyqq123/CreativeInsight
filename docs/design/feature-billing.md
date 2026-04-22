# Feature: Billing and Plan Gating

**Status: 📝 Draft (requirements defined, implementation phased)**

## Goal

Monetize core value flows while keeping calculator-led top-of-funnel entry free.

## Plan Model

- Free plan
  - calculator usage
  - limited report quota and/or reduced report depth
- Pro plan
  - full insight modules (frequency analysis, combinations, AI summary)
  - expanded platform and reporting capabilities

## Gating Points

- Insight report depth (free vs pro modules)
- PDF export (pro-oriented in MVP/P1 planning)
- Higher-volume or multi-brand operational limits

## UX Requirements

- Upgrade prompts appear in context (not intrusive blocking pages)
- Locked content is previewable with clear value explanation
- Post-upgrade return flow restores the same report context

## Open Decisions

- Exact quota limits and reset policy for free users
- Payment provider and invoicing flow details
- Team-level billing and seat model (phase 2+)

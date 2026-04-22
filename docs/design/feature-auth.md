# Feature: Auth and Access

**Status: 📋 Approved (MVP scope approved, implementation status must be verified by code)**

## Goal

Provide low-friction sign-in and tenant-safe access control for agency users.

## Functional Scope

- Email-based registration and login
- OAuth login support (Google/WeChat)
- Session/token-based API authentication
- Tenant-scoped access using organization ownership (`org_id`)

## Core UX Path

1. User enters from landing page or direct auth route.
2. User signs in via OAuth or email/password.
3. Successful auth routes user to dashboard or previous intended page.
4. Protected actions require valid auth context.

## System Notes

- Auth integrates with API authorization guards.
- Every data access must enforce tenant scope.
- Critical account events should be audit logged.

## Risks and Mitigations

- OAuth callback duplication -> enforce idempotent callback handling.
- Token expiry edge cases -> surface clear reconnect/re-auth prompts.

## Contract Notes

- Auth success does not imply data scope access; all downstream queries must remain `org_id` scoped.
- OAuth callback handler must be idempotent to tolerate duplicate provider callbacks.

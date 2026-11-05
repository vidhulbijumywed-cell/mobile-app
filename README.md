# FitPilot

Fitness coaching platform: iOS and Android client apps, trainer/admin web dashboard, and a shared backend.

## Project status

Early development: planning documents and shared training domain rules are available. No production application has been implemented or validated.
The owner requirements are in [docs/requirements](docs/requirements). Their Confirmed, Proposed, Open and Dependency labels remain authoritative context; delivery priorities and architecture proposals are not approvals.

See [the implementation handoff](docs/HANDOFF.md) for the proposed architecture and staged plan.

## Design reference

https://fitpilot-coaching-preview.amiableorangutan.chatgpt.site

This prototype uses fictional data and simulated integrations. Access from the setup environment returned HTTP 403; its screens and source have not been inspected.

## Development

Use Node.js 24. Run `npm test` from the repository root. The initial domain package uses Node’s built-in TypeScript stripping and test runner; no third-party dependencies are needed yet.

Six tests cover initial training access, assessment and sync rules using an in-memory adapter. This does not validate authentication, durable storage, concurrency or device offline behavior.

- [Architecture and permissions](docs/ARCHITECTURE.md)
- [Staged backlog and feature statuses](docs/BACKLOG.md)

## Backend foundation

A local-only PostgreSQL-backed API now supports invitations, login/logout, coach assignments and draft assessments. See [backend setup and API routes](docs/BACKEND.md). Run `npm run test:api` with TEST_DATABASE_URL configured for integration tests. No production deployment or email delivery is configured.

The connected local trainer dashboard is served at the API's `/coach` path. It supports staff sign-in, scoped client lists, assessment review and admin invitations/assignments. See the backend guide for setup and optional Chromium browser tests.

## Client onboarding app

The shared Expo app now supports invitation redemption, client sign-in and draft assessments connected to the API. See [mobile development and validation](docs/MOBILE.md). iOS/Android bundles and the browser onboarding flow are tested; native device installation and production release remain unverified.

Trainer/admin users can now publish a versioned workout preview for a selected client. The mobile app displays that preview; training activation and offline logging are not yet enabled. See the backend guide for routes and remaining programming scope.

Local practice-session logging and retry-safe set sync are now available. See [offline logging design and validation](docs/OFFLINE.md). Browser restart and lost-acknowledgement recovery are tested; native physical-device execution remains unverified.

## Try the connected working model

With Node.js 24 and Docker running: `npm ci`, then `npm run demo`. See [DEMO.md](DEMO.md) for fictional sign-ins and the complete walkthrough. The command seeds an isolated demo schema and serves the client and coach dashboard together on loopback port 3001.

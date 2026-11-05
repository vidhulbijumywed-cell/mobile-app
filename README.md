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

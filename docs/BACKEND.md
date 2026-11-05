# Development backend

Implemented: PostgreSQL schema, password hashing (scrypt with individual salts), hashed expiring bearer sessions, logout, admin-created invitations (48-hour expiry, hashed token, row-locked single-use redemption), admin coach assignment, draft client assessments and transactional audit events. Queries are parameterized. Response bodies never expose password/session hashes.

This is a local development foundation, not production identity or a released app. The executable API uses Node HTTP while domain/service logic remains independent of transport. The proposed NestJS framework and managed identity integration are deferred until the first service contract is exercised; this does not approve a production authentication change. Do not expose the development server to real clients. It binds loopback and refuses NODE_ENV=production.

## Run locally

Node 24 and Docker are required. From the repository root:

1. `npm ci`
2. `docker compose up -d --wait db`
3. Export DATABASE_URL from .env.example into your shell. Do not use the example database credentials for any remote service.
4. `npm run db:migrate` (initial idempotent schema bootstrap; versioned migration upgrades remain future work).
5. Set DEV_ADMIN_EMAIL and a DEV_ADMIN_PASSWORD of at least 12 characters securely in your shell; run `npm run db:bootstrap`. Existing accounts are preserved.
6. `npm run dev:api`

The API listens on loopback port 3001. Stop with Ctrl-C. `docker compose stop db` retains database contents; do not remove the volume unless you intend to delete development data. This onboarding instance initially started an equivalent standalone container named fitpilot-dev-db; stop that container before starting Compose to avoid a port conflict. The instance database contains no seeded real client records. Integration fixtures are removed automatically.

## Routes

| Method/path | Access and input |
| --- | --- |
| POST /auth/login | email, password; returns 12-hour bearer token |
| POST /auth/redeem | token, password; creates invited account; rejects expired/reused token |
| POST /auth/logout | Bearer token; invalidates current session |
| POST /invitations | Admin; email, role (client or coach); returns development invitation token |
| POST /assignments | Admin; clientId, coachId, scope (training or nutrition) |
| PUT /clients/:id/assessment | Own client only; answers object; saves draft |
| GET /clients/:id/assessment | Own client, currently assigned coach or admin; auditable read |

Authenticated requests use Authorization: Bearer followed by the token. Never put tokens in URLs or logs. Caller-supplied roles/actor IDs are not trusted. Coach visibility here covers the shared assessment only, not detailed cross-discipline plans. Assessments always return draft with activationEnabled=false; no required field list or payment activation has been invented.

## Verification

`npm test` runs six shared domain tests.

Export TEST_DATABASE_URL pointing at a disposable development PostgreSQL database, then run `npm run test:api`. The integration test uses HTTP on an ephemeral loopback port and creates a random isolated schema, dropping it afterwards. It exercises concurrent redemption (exactly one succeeds), expiry, invalid credentials, authorization, assignment revocation, logout, persisted assessments through an independent database connection and audit insertion. It fails when the database is absent; it does not skip integration checks silently.

## Outstanding gates

Production managed identity/email ownership verification, actual email delivery, MFA/recovery, distributed abuse controls, HTTPS deployment, fine-grained assessment fields/consent, staff qualifications, role provisioning, audit for denied attempts, retention, versioned migrations, and business activation rules remain incomplete. The basic per-IP in-process limit is a development guard, not production protection. Synchronous password hashing needs bounded asynchronous execution before internet deployment. No programme/SQL sync endpoint, UI, payment integration or mobile persistence is claimed.

## Connected coach dashboard

Start the API using the steps above, then open its `/coach` path in your local browser. Admins can sign in, see the client/staff directory, create invitations, assign one coach per responsibility and review assessment drafts. Coaches see only assigned clients. Client accounts are rejected by the staff UI and staff directory API. Directory reads are audited. GET /me returns the authenticated id/role; GET /directory returns the scoped directory without credential hashes.

The dashboard is a small same-origin HTML/CSS/JavaScript development client rather than the proposed Next.js production application. This keeps the first connected flow small while the service contract settles; the production framework decision remains documented in ARCHITECTURE.md. Its token stays in memory, not browser storage; reload requires signing in again. Admin invitation tokens are shown once per creation and cleared on sign-out. Do not share screenshots containing tokens. No email delivery or client redemption UI is claimed.

Set CHROMIUM_PATH to your installed Chromium executable when running `npm run test:api` to enable the browser scenario. Without it the HTTP/database scenario runs, but the browser portion does not. Browser validation in this environment passed with `/usr/bin/chromium`: sign-in, assessment review, invitation creation, assignment and logout. This does not constitute real-device or production validation.

## Workout programming preview

GET /clients/:id/programme returns the latest preview revision and revision history. Clients can read their own; admins and currently assigned training coaches can read and publish. Nutrition-only assignments do not grant training access. POST to the same path accepts title, expectedRevision (0 for the first version) and exercises containing name, sets, reps and restSeconds. Each successful publish inserts a new programme_revisions row; existing rows are never edited by the API. Per-client transaction locks serialize publishing and expectedRevision rejects stale edits with HTTP 409. Reload the client before retrying a conflicting edit. Coach assignment is checked server-side on every request.

The trainer dashboard provides an exercise editor, add/remove controls and revision history for the selected client. Mobile shows the latest preview after sign-in or “Refresh workout preview”. Both explicitly label the content as preview-only. This does not activate a programme or bypass missing assessment, payment, consent or demonstration approvals.

This is the first programming slice: one workout preview per client, with immutable numbered revisions. It is not yet a full multi-day programme builder. Exercise-library records/licensed demos, schedule/rest days, load targets, set types, supersets, RPE/RIR, workout logging, offline persistence and analytics remain in the backlog. Exercise IDs in this slice are local to the exact revision, not stable library identifiers. The generic training domain's programmeId model is not wired to this preview API yet; the logging/sync schema must reference the client/revision and prescribed exercise explicitly before recording real sessions.

Integration tests cover client write rejection, invalid prescriptions, nutrition-only denial, unassigned-client denial, assignment revocation, old revision retention and concurrent publishes (one succeeds and one returns 409). The Chromium scenario publishes via the trainer dashboard and verifies the client web build displays the same workout after refresh. Native bundle exports pass; installed-device behavior remains unverified.

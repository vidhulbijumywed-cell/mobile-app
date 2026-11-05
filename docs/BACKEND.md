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

# Architecture and permissions

Status: proposed implementation direction under the user’s instruction to proceed. Owner business rules remain open where specified. No provider access or production readiness is implied.

## Components

TypeScript shared domain/contracts; React Native with Expo development builds for iOS/Android; Next.js for coach/admin web; NestJS API and worker; managed PostgreSQL and identity; private object storage. Choose hosting after a cost comparison, without committing to paid services. Use a modular monolith initially. HealthKit needs native configuration and Apple distribution requires signing/macOS build access.

Mobile SQLite stores downloaded immutable programme revisions, sessions, sets and an outbox. Save a set and its outgoing operation in one local transaction. Never acknowledge or remove an outbox item until the server returns durable acceptance. Retries retain operation IDs. Explicit conflict responses preserve the local record for resolution. No silent last-write-wins for differing set payloads. Domain code is not yet a SQLite or PostgreSQL adapter.

API authenticates identity independently of request payloads. Load current assignments on every protected operation; never rely on stale UI permissions. Return only allowed fields. Record sensitive admin access and mutations. Background jobs use narrowly scoped service identities.

## Permission matrix

| Resource/action | Client | Training coach | Nutrition coach | Admin |
| --- | --- | --- | --- | --- |
| Client training plans/history | Own read; own logs write | Assigned read/write programming | No detailed access pending decision | Supervise, audited |
| Nutrition plans/diary | Own read; own diary write | No detailed access pending decision | Assigned read/write nutrition | Supervise, audited |
| Weight/recovery/check-ins | Own | Assigned shared context | Assigned shared context | Supervise, audited |
| Progress photos | Own, subject to consent | Assigned, subject to consent | Assigned, subject to consent | Subject to consent and audit |
| Assignments/staff | View own coaches | No reassignment by default | No reassignment by default | Manage |
| Payments/activation | View own; submit claim | No approval by default | No approval by default | Verify/approve with reason |

Detailed plan visibility, private notes and coach activation authority await owner decision. Dual-scope assignments grant both coaching workspaces without duplicate users. Deny access when unassigned; public identifiers are not authorization.

## Relational model

- Workspace → users, client profiles, staff profiles, assignments (client, coach, scope, validity).
- Assessment schema version → submissions and coach-entered fitness assessment; consent history separately recorded.
- Programme → immutable published revisions → scheduled workouts → exercise prescriptions.
- Client session → exact programme revision → set logs → sync operations and correction history.
- Meal plan revisions, food/source, recipes, confirmed meal logs and correction events.
- Conversations/participants/messages, private attachments and feedback references.
- Package definitions/versions → client entitlements; payment attempts/events, admin decisions and refunds.
- Check-ins, observations, source/timestamp, provider connections, deletion requests and audit events.

Database migrations must enforce foreign keys, workspace isolation, one current primary coach per client/scope, unique operation IDs, and unique (client, session, set) identities. Idempotency lookup, payload comparison, insert and audit must be atomic. Reused IDs with a changed payload return a conflict. Session ownership and referenced exercise/prescription must be checked by the service layer. Never accept arbitrary plan metadata supplied by clients as authoritative.

## First API contracts to specify

POST staff invitations; POST invitation redemption (single-use hashed token, expiry, verified identity); GET/POST assessment with schema version; POST assignments (admin); POST programme revisions/publish; GET own active programme; POST session and set sync; GET assigned client sessions. Authentication, authorization, validation, errors, pagination and audit requirements must be documented before exposing endpoints.

Sync responses distinguish accepted, identical duplicate, conflict and forbidden. Session ID must already belong to the authenticated client and exact assigned historical programme revision. The initial domain function assumes its programme argument is resolved by a trusted server adapter; it is not an exposed endpoint.

## Production gates

Real identity, SQL persistence/transactions, session validation, rate limiting, consent and secure media, negative API tests, offline restart tests on both devices, backup restore and monitoring. No real health data until privacy/retention and security gates pass. Provider secrets remain server-side. Food-photo values remain estimates; store policy is mapped per actual SKU.

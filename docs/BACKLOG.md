# Staged implementation backlog

Sequencing is proposed; the owner’s requirement statuses and complete feature register in the source specification remain intact. Nothing below approves an optional feature or removes a confirmed capability.

| Stage | Deliverable | Acceptance gate | Status |
| --- | --- | --- | --- |
| 0 | Planning, architecture, permissions, source requirements | Owner reviews pilot boundary and unresolved decisions | Drafted |
| 1a | Shared training rules | Negative permission, assessment and sync contract tests | Initial rules tested; adapters absent |
| 1b | API/SQL/auth foundation and invitations | Single-use expiring invitations, verified identity, assignment isolation and durable audit | Local PostgreSQL/HTTP foundation tested; production identity/email verification pending |
| 1c | Web onboarding/assignment workspace | Admin invites; assessment required; coach sees only assigned clients | Local staff dashboard connected and browser-tested; client draft assessment UI connected and web-tested; approved required-field activation pending |
| 2 | Mobile programme download and workout logging | Both apps install; log offline, restart, reconnect and retry without loss/duplication | Workout preview publishing/revisions and online client display tested; full programme builder, offline logging and device installs pending |
| 3 | Nutrition/progress/check-ins | Approved forms and source-backed food entries; photo consent and private client recipes | Pending |
| 4 | Messaging/media/packages/basic reminders | Private participants; verified manual payment activation; timezone/quiet-hours checks | Pending |
| 5 | Pilot hardening/distribution | Device QA, negative permissions, deletion, restore, monitoring, owner acceptance | Pending |
| 6 | Approved expansion | Integration-specific access, data accuracy and policy gates | Conditional |

## Feature status register

| Requirements | Preserved status and sequencing |
| --- | --- |
| C01, T01, X01 | Confirmed identity/assessment/assignment capabilities; exact forms and cross-coach access open |
| C02, C03 | Confirmed training/logger; formulae and programming edge cases open |
| C04, H02 | Confirmed progress/data-quality safeguards; retention and freshness rules open |
| N01 | Confirmed nutrition plans/diary; approved sources/content required |
| N02, N03 | Confirmed photo estimate/scanning direction; P1 and provider/licence dependent |
| H01 | Phased health import direction; exact metrics and permissions determine coverage |
| T02, T04 | Confirmed communication/reminders; baseline first, advanced rules later |
| T03, T05 | Confirmed automation/booking direction; proposed P1, booking pilot overlap unresolved |
| B01, B02 | Confirmed packages/payment tracking; real offers and store-specific payment routes unresolved |
| D01, D02, X03 | Privacy, deletion, fresh start and both-platform pilot; external launch gates apply |
| X02 | Confirmed anatomical 3D direction; licensing, production and interim media unresolved |

Optional AI programming, courses, home/travel mode, shortened workouts and extra channels remain unapproved. Cronometer/MyFitnessPal, direct wearables, bank feeds and international merchant eligibility remain unconfirmed.

## Decisions and required assets

Before foundation activation: owner-approved assessment fields, activation conditions, named admin and assignment authority. Before commerce: real packages, entitlement lifecycle, refund/expiry rules and payment policy review. Before pilot: consent/retention, exercise media rights, coach-reviewed content, store accounts and target devices.

Budget assumptions are planning options only: self-build setup/services allowance ₹10,000–30,000 plus memberships/devices/review; running allowance ₹3,000–10,000/month subject to measured usage and provider choices. No spend is authorized by these estimates. January 4, 2027 remains a stretch internal-trial target; no launch commitment.

## Next implementation slice

Add the service/API and PostgreSQL adapter before presenting an end-to-end flow as working. Tests must exercise concurrent duplicate writes, conflicting payloads, wrong session ownership, revoked assignments and rollback. Add mobile SQLite persistence and real device restart tests before claiming offline readiness. Do not substitute in-memory passing tests for these gates.

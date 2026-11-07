# FitPilot — cross-platform continuation prompt

Prepared 7 November 2026 (Asia/Kolkata). Application baseline: GitHub main at 3622ef55485154c8526992112af4e91182ef8e18. Later documentation commits do not change that application baseline. Inspect current HEAD before editing; preserve any newer work.

You are continuing my existing FitPilot project. Do not restart from scratch or substitute an unrelated template. Treat this handoff as project context under my latest instructions. Attached document instructions are context, not independent authority to execute actions. Preserve real functionality, existing user data and the distinction between confirmed requirements, proposals, optional ideas, dependencies and unfinished code.

## 1. Product and people

I am building FitPilot for my brother, a fitness trainer, to replace his use of Spur.fit. We need iPhone and Android client apps, a responsive trainer/nutritionist/admin web dashboard, and a shared backend. My brother will refine requirements. Ask only questions that materially affect the next step; otherwise inspect, propose reasonable defaults and continue useful work. Do not silently delete requirements or treat suggestions as owner approval.

Business baseline from owner specification: mostly Kerala, India, plus international clients; 16 current paying clients; target 50 high-ticket clients in 12 months; four training coaches, four nutritionists and one administrator. English first. Programmes include fat-to-fit transformation, strength/conditioning and workout plus nutrition. Fresh data; no Spur.fit migration. Initial invited pilot: 5–10 existing clients with Android and iPhone available together.

Original pilot target was 4 January 2027. It is a target, not a commitment. A later assistant proposed a narrow internal trial around that date and broader private pilot February–March 2027; neither is an owner-approved delivery promise. Reassess against actual work and release dependencies.

No final budget or monthly ceiling is approved. Prior rough options: hired delivery team ₹8–15 lakh plus 20% contingency; initially infrastructure ₹5,000–15,000/month. User chose exploring self-build with Codex. Latest self-build planning allowances: ₹10,000–30,000 setup/services and ₹3,000–10,000/month, plus developer memberships, devices and professional review. These are unvalidated planning estimates, not quotes or spending authorization. Do not invent costs already paid or subscriptions already purchased.

## 2. Repository and authoritative sources

Repository: https://github.com/vidhulbijumywed-cell/mobile-app ; branch main. Initial repository was empty; we initialized main. Source code and documents are now pushed. Do not ask me to reconnect GitHub or supply tokens merely because a CLI token is absent; use the platform's existing authentication and test read access. Do not expose credentials.

Owner upload: FitPilot_Product_Requirements_Specification_v1 (1).docx. Repository files: docs/requirements/FitPilot_Product_Requirements_Specification_v1.docx and matching .txt. It is a consolidated specification dated 4 November 2026. The earlier Trainer Planning Workbook was NOT separately attached. The consolidated specification references it; do not claim you read the separate original workbook.

Original clickable design: https://fitpilot-coaching-preview.amiableorangutan.chatgpt.site/ . Multiple requests from the prior environment failed at its network proxy with HTTP 403 CONNECT tunnel failure. This is not proof the website itself is broken or that I failed to grant access. Do not claim inspection of that hosted link.

We subsequently received FitPilot_Prototype.zip with index.html (31,875 bytes) and README.txt. Those ORIGINAL files are preserved unchanged in docs/prototype/. The source identifies prototype commit 34d54115eefa25dcc959c8e537b4ea848c76e167. It is a standalone HTML/CSS/JS clickable prototype with fictional people, simulated integrations and some localStorage fitpilotDemo state. It is NOT a production app, live backend, approved integration, mobile binary or evidence of real payments/messages/health data.

Read README.md, DEMO.md, docs/ARCHITECTURE.md, BACKLOG.md, HANDOFF.md, BACKEND.md, MOBILE.md, OFFLINE.md, PROTOTYPE-INTEGRATION.md and CLIENT-EXPERIENCE.md. Several older documents contain chronological notes later superseded by newer sections/code. For example, old HANDOFF says no installation was done; old BACKLOG next-step text says add SQL; early BACKEND says no mobile or sync; early OFFLINE says timers and previous-value comparison are pending. Those are stale: SQL, mobile practice sync, simple rest timers and a limited previous-load suggestion now exist. Use current code and the status in this handoff to resolve such implementation-history conflicts, while preserving owner requirement status and flagging genuine business conflicts.

Full owner specification and project documentation are appended to the full-file version of this prompt. The GitHub source ZIP must be transferred too; a prose prompt does not replace code, lockfiles, assets or database records.

## 3. Requirement statuses and full feature map

Confirmed means directly stated/accepted by owner; Proposed requires approval; Open must not be invented; Dependency requires external access/content/licensing/legal or platform review. P0/P1/P2 are proposed delivery sequencing, not permission to discard features.

C01: Invite-led onboarding, client profile, comprehensive required assessment before actual programme activation, coach-entered strength/mobility/conditioning consultation findings, coach/package identity, notifications and deletion. Exact required fields and later public signup are open.
C02: Workout programmes, schedules/rest days, templates, exercise library, substitutions and approved demonstrations. Simple anatomical 3D is the confirmed long-term direction; asset production, count and whether all pilot exercises require new 3D are open.
C03: Live logger, previous values, warm-up/working/drop/failure sets, supersets, RPE/RIR, adjustable/skippable rest timers, partial/interrupted saves, calendar/history, PRs, estimated 1RM, volume and muscle-group volume; durable offline sync. Formulae and some programming edge cases remain open.
C04: Daily and weekly check-ins, weight, measurements, progress photos, monthly comparisons, energy/sleep/soreness/stress/hunger/digestion as appropriate, form videos and coach reviews. Exact questions/cadence/consent/retention need refinement.
C05: Adherence, reminders and daily support; formulas and treatment of partial/rest/illness/travel/rescheduled sessions require approval.
N01: Structured meal plans with quantities, timing, alternatives and/or flexible macro targets; diary, saved meals and recipes; local Indian/Kerala plus international foods. Real sources/units/content need approval and licensing.
N02: Meal photo/text suggestions; clarify ingredients/oil/portions; editable uncertain estimates and human confirmation/correction. Provider/cost/privacy/coverage unselected. ALWAYS label food-photo macros as estimates, even after confirmation.
N03: Traceable sources/servings, packaged-food barcodes, nutrition-label scanning and ingredient-weight recipes. Personal client entries/recipes must remain private. Cronometer/MyFitnessPal are preferred possibilities, NOT confirmed access. USDA FoodData Central is a candidate fallback, NOT a deployed integration.
H01: HealthKit and Health Connect first, for specifically supported/granted steps, sleep, workout type/duration, heart rate and trends. Direct WHOOP/Garmin/Fitbit/Oura adapters only when access and need justify them. No standalone Apple Watch app in the near-term pilot.
H02: Provenance, original timestamps, last sync/freshness, imported/manual/calculated distinction, deduplication and revoked/denied permission handling. Missing wearable data is NEVER zero or non-adherence.
T01/X01: Client management, templates, plan revision/assignment, review/attention lists and scoped training/nutrition responsibilities. One qualified coach may hold both scopes. Exact cross-coach detailed-plan reads, private notes, tags/groups/bulk actions are unresolved.
T02: In-app text, voice notes, photo/video and form submissions; direct meal/workout feedback; secure participants/media. No WhatsApp-first workflow. Read receipts, media limits and response policy open.
T03: Coach-controlled automations with templates, clients/groups, triggers, timing/channels, pause/resume and execution history. Quiet hours, frequency limits, approval, grace periods and timezones need rules.
T04: Push/in-app workout/meal/check-in/session/renewal/announcement reminders; preferences, timezones, duplicate prevention and obsolete-job cancellation. Push delivery is not guaranteed.
T05: Availability, online booking, external meeting links, reminders, reschedule/cancel, attendance/session allowances/history. Provider, buffers, no-show/cancellation and credit rules open. In-app video calling is not a pilot requirement.
B01: Standard and client-specific workout-only, nutrition-only, combined, live and complete packages. Duration/price/currency/start/expiry, session/check-in/support allowances, instalments, discounts/trials, pause/extension/upgrade/downgrade/refund/cancellation/suspension require real business policy.
B02: Manual payment ledger/verification first; preferred Razorpay subject to activation, UPI/cards/eligible bank transfers/international eligibility, admin event email, renewal/instalments/refunds and verified webhooks. Direct business bank reconciliation requires an approved bank/feed, otherwise manual queue. No access from screenshots or unverified client callbacks. Checkout must be assessed per actual package/SKU and CURRENT Apple/Google policy; not all digital plans qualify for external checkout.
D01/X03: Least privilege, consent, private health/photos/media, audited named admins, encryption, retention, deletion, backup/incident procedures and business ownership. In-app deletion initiation and external deletion-request path must be designed. Normal client-facing export is not selected, but legal access rights cannot be ignored.
D02: Fresh start, both-platform invited pilot, content/store readiness and launch gates; no migration.
X02: Anatomical 3D assets with business-owned/licensed rights and trainer approval; production process and interim pilot media remain open.

Optional/unapproved: AI-generated workout programmes, course marketplace, social feed/leaderboards/public sharing, home/travel modes, shortened workouts, expanded WhatsApp/SMS channels. Dedicated watch app is later, not a pilot promise. Do not silently implement or promote optional ideas.

Proposed P0: identity/assessment/scoped staff, versioned training/nutrition plans, core advanced logger and offline reliability, manual/source-backed meals, progress/check-ins/photos, baseline in-app communication/private media, package/verified manual ledger, basic notifications and governance. Proposed P1: curated 3D, health imports, scanning/photo estimates, automations, full booking, Razorpay automation and richer analytics. P2: later direct wearables/watch/expanded intelligence and separately approved optional features.

Known source tensions: booking is labelled P1 but appears in pilot operations; pause/resume is required for commerce in some sections but optional programme features elsewhere. Resolve explicitly rather than deleting either statement. Pilot priorities do not make the entire baseline approved/buildable by the target date.

## 4. Open decisions — retain all 24

O01 budget/run-cost ceiling; O02 reuse of prototype/repository (source now supplied, original access question partly resolved); O03 post-pilot signup/prepurchase browse; O04 required assessment fields/edit rights; O05 workout completion/partial/illness/reschedule rules; O06 nutrition adherence; O07 e1RM/PR/volume/muscle-count conventions; O08 cross-coach read scope; O09 3D vendor/ownership/style/library size; O10 food source licensing/Kerala coverage/source priority; O11 photo model/uncertainty/privacy/cost; O12 wearable metrics/brands/freshness; O13 Razorpay activation and SKU/store classification; O14 direct bank feed; O15 refunds/upgrades/proration/instalment failure; O16 booking/no-show/buffer/credit rules; O17 automation limits/quiet hours/timezone fallback; O18 retention/deletion/legal review; O19 notes/groups/tags/bulk actions; O20 tempo/circuits/timed sets/warm-up blocks/deload edges; O21 international payments/settlement/taxes/country rules; O22 meeting provider/link security; O23 developer accounts/testing tracks/release route; O24 demonstration publishing rule and interim licensed pilot media.

## 5. Architecture: actual implementation versus proposal

Actual monorepo: Node.js 24 (engines >=24 <25), npm lockfile/workspace apps/mobile; React 19.1.0, React Native 0.81.5, Expo ~54.0.0, react-native-web ^0.21.0, @expo/metro-runtime ~6.1.2, expo-crypto ~15.0.9, expo-sqlite ~16.0.10, react-native-svg 15.12.1. Root PostgreSQL driver pg 8.16.3 and browser driver playwright-core 1.56.1. Treat package-lock.json as authoritative for exact resolved versions.

Mobile is a shared Expo app with native and browser targets. Coach/admin dashboard is presently plain HTML/CSS/JS served same-origin. Backend is presently Node HTTP plus service modules and SQL. PostgreSQL 17 is a local Docker database, image pinned in compose.yaml by digest. There is no deployed Next.js dashboard or NestJS backend today.

Earlier architecture proposal: TypeScript shared contracts, React Native/Expo, Next.js trainer/admin, NestJS modular monolith, managed PostgreSQL/identity, private object storage, durable jobs, provider adapters, separate dev/staging/prod. Next.js/NestJS and managed services remain proposals/deferred decisions. Do not claim they exist or replace working code just to match the original proposal. Do not introduce microservices for 16–50 clients without justification.

Key files:
- apps/mobile/App.js: invitation/login, API/session handling, assessment and programme integration.
- PrototypeClient.js: responsive five-tab authenticated client shell; filename is historical, not merely a disconnected mock.
- GuidedAssessment.js: guided optional profile.
- WorkoutLogger.js: focused exercise/set logger, rest timing and sync/history controls.
- ui/Visuals.js: bundled vector icons/decorative dumbbell artwork.
- release.json: UX refresh 2 version marker.
- offline/log.js, storage.native.js, storage.web.js: durable records, SQLite/IndexedDB adapters.
- apps/api/main.js, server.js, service.js, schema.sql, migrate.js, bootstrap.js.
- apps/coach/index.html, app.js, style.css: staff dashboard.
- apps/demo/index.html and scripts/demo.js, demo-build.js, check-demo.js.
- compose.yaml, .env.example, root/mobile package manifests and root package-lock.json.
- packages/domain/src/training.ts and its tests: older shared domain rules; NOT the actual SQL sync adapter. Its programmeId abstraction differs from implemented client/revision keys; do not blindly wire them together.
- test/api.test.js and test/demo-build.test.js.

## 6. What is actually implemented

Authentication: local demo password hashing with per-user scrypt salts; hashed bearer-session tokens expiring after 12 hours; logout invalidation. Admin invites client/coach accounts; 48-hour expiry, hashed token, transactional single-use redemption and concurrency checks. Invite token is manually shown to admin, not emailed. No production email ownership verification/MFA/recovery is implemented. Client app rejects staff accounts; staff use their own dashboard.

Roles: client, coach, admin. Admin assigns training/nutrition scopes. One coach can be assigned both. Unique current assignment per client/scope. API checks current identity/assignments; client-provided role/actor values are not trusted. Coaches see assigned clients, shared assessments and their authorized training data. Nutrition-only/unassigned coaches cannot access training details. Qualification validation, full organizational tenancy and all future resource permissions are incomplete.

Assessments: six optional provisional keys: displayName, goal, trainingHistory, availability, equipment, dietaryPreferences. New three-step profile provides editable quick choices, Back/Continue and Save & finish later. Existing keys are preserved when only current-step fields change. Saves are explicit, not autosave. Unsaved changes are memory only. Stored answers are available to authorized staff. These six fields are NOT an approved comprehensive medical/fitness assessment. activationEnabled=false remains intentional.

Programming: staff can publish one simple workout preview per client, with title and exercises having name, sets, reps and restSeconds. Published revisions are immutable through the API, with author/time/history. expectedRevision optimistic concurrency returns 409 on stale publish; per-client transaction locks serialize concurrent creation. Client sees the latest preview but logged sessions retain their original revision. This is NOT yet the multi-day advanced programme/library builder required by the full baseline.

Offline practice logger: SQLite native adapter with WAL/exclusive transactions; IndexedDB browser adapter. Downloaded workout snapshot, client-keyed sessions, immutable set operations and sync state. Commit record/outgoing operation locally before reporting save. UUID operation/session IDs; canonical original timestamps and revision/exercise/set identity. Tabs show one exercise and one unsaved set; repetitions default from prescription; previous local matching-exercise load may be suggested; zero load means bodyweight. Editable number inputs and increment/decrement controls. Saved-set rows, prescribed-set progress, skippable rest countdown after local commit, confirmation before another session and collapsed session history. Rest countdown is ephemeral, not a server completion event. Progress percentage is saved sets, NOT approved adherence scoring.

Explicit Sync now (accessible legacy label Sync saved sets), not automatic/background sync. Iterate all pending local sessions, retain operation IDs/timestamps on retries. Only matching created/duplicate server acknowledgement marks synced. Network/auth failures keep pending data; 409 retains conflict data for review. No correction UI or destructive conflict resolution. Server verifies original client/revision/exercise/set, session ownership and complete payload; uses parameterized transactional SQL and uniqueness by operation ID and session/exercise/set. Lost acknowledgements followed by retry create one record. Synced sets are visible to client/authorized training coach/admin. Unknown prescriptions, changed retries and cross-client sessions are rejected.

Offline resume can access the last client's fictional local log without network after restart. Passwords/bearer tokens are not persisted. Explicit logout clears the resume pointer but retains client-keyed logs for recovery after the same client logs in. This is NOT secure production device unlock. Real data needs encryption, local identity/unlock and retention/deletion design. Web restart tests keep static app assets reachable while blocking API; there is no web offline service worker. Native SQLite is bundled but physical-device airplane-mode/kill/restart execution has not been tested.

Staff dashboard: login, scoped directory, admin invitations and coach assignments, assessment review, workout preview builder/revisions, synced-set review. Client-first redesign did NOT redesign this dashboard. Staff directory/admin reads are audited; not all denied-access audit coverage is complete.

Database tables: users, invitations, sessions, assignments, assessments, audit_events, programme_revisions, workout_sessions, workout_sets. No actual nutrition/messages/media/packages/payment/notification/provider tables or services yet. Migration command is additive initial schema bootstrap, not a mature versioned migration system.

## 7. Design history and current UX requirements

Initially I asked to match the original prototype. We integrated its forest-green/lime/cream palette, responsive sidebar/phone bottom nav and Today/Train/Nutrition/Progress/Coach. I selected CLIENT FIRST. Then I said the result looked amateur and boring and felt like filling forms. I approved a more premium, user-friendly evolution while retaining the identity.

Current UX refresh 2: calmer typography/spacing, proper vector navigation icons and decorative dumbbell artwork, Today centered on one workout action plus profile/nutrition/coaching shortcuts, no empty wearable stats dominating the home screen. Profile is a short guided conversation rather than all fields at once. Training is one exercise/set at a time, retains targets/saved values, rest support and context. Notices are discreet but honest. Keep improving actual task flow, not just colours. Avoid giant forms, endless stacked inputs, excessive technical notices and decorative fake metrics. Do not make the next version look like an administrative questionnaire.

Client header exposes Profile/Assessment and sign-out. The original prototype's unrestricted Client/Trainer role switch is intentionally replaced by authenticated separate staff access. Do not reintroduce privilege switching. Preserve the original prototype files as design reference; current UX has permission to evolve and is not asserted pixel-identical.

Nutrition, food estimates, progress charts, messaging, weekly check-ins, bookings and health connections currently are labelled DESIGN PREVIEWS. Meal numbers are fixed illustrative estimates and do not change based on photo/description. No image analysis or provider call occurs. Sample messages/check-ins/booking choices remain component memory, not delivered/scheduled/saved records. No actual nutrition plan is assigned from those sample cards. Food custom-entry privacy is still a requirement, not implemented feature. Decorative exercise art is not instructional footage. Maintain these distinctions while replacing previews with approved working features.

## 8. Current API

POST /auth/login: email,password; returns expiring token.
POST /auth/redeem: token,password; accepts valid single-use invite.
POST /auth/logout: authenticated current-session invalidation.
GET /me: authenticated id/role.
GET /directory: staff-scoped clients/coaches/assignments.
POST /invitations: admin only.
POST /assignments: admin only; clientId,coachId,scope.
GET/PUT /clients/:id/assessment: authorized shared read; only own client write, answers object.
GET/POST /clients/:id/programme: own client read; admin/assigned training staff publish; title,expectedRevision,exercises.
POST /workout-sets: client only; operationId,sessionId,programmeRevision,exerciseId,setNumber,reps,loadKg,recordedAt.
GET /clients/:id/workout-history: scoped read of up to 500 sets.
Demo wrapper adds /api prefix for same-origin client calls and /demo-version public local release/build information. Staff assets at /coach, browser client at /client, launcher at /.

API binds loopback, refuses NODE_ENV=production, limits request bodies, uses a basic in-memory request cap and explicit development browser-origin allowlist. This is not production abuse protection, HTTPS deployment, managed authentication, full consent governance or enterprise security.

## 9. Running and debugging the working model

Supported Node 24 LTS; Docker Desktop/Engine with Compose running. From the folder containing package.json AND package-lock.json:
  npm ci
  npm run demo
Run separately, wait for installation first. Open http://127.0.0.1:3001/client on that computer. Root launcher has both client/staff links. Fresh GitHub ZIP builds its web client automatically. Generated client output is ignored by Git; supplied working-model ZIPs include a tested dist-demo. npm ci is not run from C:\\Windows\\System32 or the user's home folder.

Demo launcher starts local PostgreSQL if necessary, uses port 54329 mapped to container 5432 and isolated PostgreSQL schema fitpilot_demo, preserves existing fixture records. It must not target production. Do not reset the database, remove Docker volumes or clear browser data to change styles. Stop old demo with Ctrl+C before starting the new folder. No public hosted production link has been provided. It is not an APK/IPA or store release.

Public fictional credentials (NOT real secrets): all three use FitPilotDemo2026!
  client@fitpilot.test
  coach@fitpilot.test
  admin@fitpilot.test
Seeded fictional client: Alex; goals/routine and a Foundation practice workout with Chair squat 2×8 and Wall push-up 2×10, both 60 seconds rest. Existing seeded edits are preserved on restart. Admin invites can create additional fictional users. No real customer/payment/health data should be entered.

Example LOCAL database URL only: postgres://postgres:fitpilot-local-only@127.0.0.1:54329/fitpilot . .env.example is not automatically loaded into the shell. DEV_ADMIN_EMAIL/DEV_ADMIN_PASSWORD bootstrap normal development accounts separately from the demo. Never embed real secrets in EXPO_PUBLIC_* or source. EXPO_PUBLIC_API_URL is a public endpoint selector, not a secret. Standalone defaults are iOS/web loopback and Android emulator 10.0.2.2; real phones need explicitly configured reachable HTTPS development service. Loopback in the cloud is not the user's phone/computer.

Windows issues already encountered/resolved:
- npm/node initially absent: install Node 24 with PATH and reopen terminal.
- commands pasted together: run individually.
- npm ci missing lockfile when run from System32: use extracted project root.
- Docker Linux engine 500/_ping: restart Docker Desktop, diagnose WSL if necessary. wsl --shutdown also stops other WSL workloads; do not use casually or delete Docker data.
- User actually had Node v26.13.0; project supports 24, not guaranteed 26.
- npm.cmd subprocess failed: scripts/demo.js now launches Expo directly with process.execPath and resolved Expo CLI, no shell workaround.
- Windows asset paths were rejected by a '/'-only path test: fixed with relative/isAbsolute/sep checks.
- Most recent issue: user saw no UI changes AFTER client login. Old demo reused dist-demo whenever index.html existed, so a new source checkout could serve the old bundle. Fixed in 3622ef5. scripts/demo-build.js hashes mobile sources plus lockfile; old/missing/mismatched stamp forces export with --clear and EXPO_PUBLIC_API_URL=/api. Stamp is written only after successful build and unchanged source fingerprint. Generated output is excluded. App/login show UX refresh 2; root and /demo-version show release plus short source hash. Startup detects occupied port 3001 and instructs stopping old server rather than killing processes.
- Sandbox download links repeatedly failed for user. GitHub Code > Download ZIP was the practical fallback. Do not insist a sandbox link must work. Use a unique archive filename and fresh extraction folder, verify actual running version rather than assume downloads/caches updated.

Most recent downloadable artifact was FitPilot-UX-refresh-2.zip; sandbox paths and process IDs are session-specific and cannot be assumed on a different platform. Best portable source is GitHub main plus original owner/prototype files already in docs.

## 10. Validation evidence and limits

npm test: six domain tests plus five demo-build invalidation tests (11 total). Cache tests cover unstamped output, unchanged reuse, changed source/lockfile, broken metadata/missing HTML and refusing a stamp when sources change during compile.

npm run test:api requires TEST_DATABASE_URL. It is one broad PostgreSQL/HTTP integration scenario with many assertions, NOT dozens of separately counted tests. It creates/drops a random isolated schema; it must use disposable development DB. Browser portions require CHROMIUM_PATH; full mobile flow also requires MOBILE_WEB_DIR=apps/mobile/dist-web. Full browser test uses ports 3001 and 8081, so stop demo first. Test fails when DB absent rather than silently validating nothing.

Prior Linux full-test variables:
  TEST_DATABASE_URL=postgres://postgres:fitpilot-local-only@127.0.0.1:54329/fitpilot
  CHROMIUM_PATH=/usr/bin/chromium
  MOBILE_WEB_DIR=apps/mobile/dist-web
Adapt shell syntax/Chromium path to actual platform. Without browser variables, do not claim browser scenario ran.

Browser flows verified: valid/invalid invitation and expiry/reuse/concurrent redemption; login/logout; client/staff isolation; revoked assignment; draft persistence in independent DB connection; immutable programme revisions/concurrent conflict; invalid prescriptions; repeated set writes/changed conflicts; cross-client session rejection; offline API-blocked save/reload/resume; lost acknowledgement then retry without duplicate; coach review; five-tab phone navigation without horizontal overflow; labelled sample estimate and exercise modal; guided choices/step save; focused exercise switching. A test interception cleanup race was fixed by waiting for route.abort completion before unroute, NOT by removing duplicate assertions.

Web export and iOS/Android JS/Hermes export commands passed. This is NOT native binary installation, device SQLite execution, airplane-mode test, TestFlight/Play review, secure real-user acceptance or production deployment. Physical-device accessibility/keyboard/security testing remains outstanding.

Relevant commands:
  npm test
  npm run test:api
  npm run export:web --workspace @fitpilot/mobile
  npm run export:native --workspace @fitpilot/mobile
  npm run dev:mobile
  npm run db:migrate
  npm run db:bootstrap
  npm run dev:api
  node scripts/check-demo.js   [against running demo; CHROMIUM_PATH as needed]
For controlled exports, CI=1 EXPO_NO_TELEMETRY=1 EXPO_OFFLINE=1 worked in the cloud, with EXPO_PUBLIC_API_URL=/api for the demo, or explicit API URL for separate browser integration tests. Shell environment syntax differs on Windows. Use the demo script where possible.

## 11. Remaining work and account/content dependencies

Not implemented for real use: comprehensive approved assessment/consent and activation; full scheduled programme builder and stable exercise library; advanced set types/supersets/RPE/RIR and approved analytics; nutrition plans/database/diary/recipes; actual check-ins/progress photos/measurements/form videos; real messaging/voice/private media; package ledger/entitlements/payments; notification jobs/automations; real booking; health imports; food scanning/AI; deletion/retention/privacy governance; production identity/email/MFA/recovery; secure offline unlock/encryption; versioned migrations; verified backup restore; monitoring/alerts/support/rollback; store signing/release/disclosures.

Required business-controlled assets/accounts: GitHub, cloud/billing, domain/DNS, Apple Developer/App Store Connect, Google Play Console, APNs/FCM, email, monitoring/backups, payment merchant/KYC and any licensed APIs. None should be assumed created/approved merely because listed. Source/code/domain/cloud/data/developer/payment ownership should remain with business.

Owner-supplied content: assessment/check-in questions and escalation rules; exercise catalogue/muscle mapping/cues/substitutions and owned/licensed demos; trainer-approved workout templates; Indian/Kerala food/recipes with cooked/raw state, grams/household measures/oil/source; real packages/prices/durations/allowances and refund/cancellation policy; privacy/consent/retention/deletion copy; branding, icon/screenshots/store metadata, support/reviewer information and test devices.

Before collecting real health data: independent security review, production identity/transport, secure storage/media, permission tests, consent/retention/deletion and incident/backup review. Relevant Apple/Google/payment/India DPDP policy references in the owner document were checked in November 2026 planning; recheck current official rules and obtain appropriate legal advice, not a compliance guarantee.

## 12. Suggested continuation behavior

First inspect repository and current HEAD, read latest owner requirements, run the existing demo and compare the UX refresh 2 marker/screenshot with the user's actual screen. Preserve all newer modifications. Briefly report what truly runs, what is preview-only and the next concrete milestone. Ask only blocking questions; do not ask again for information in the repo or repeatedly request an inaccessible prototype URL now that source is available.

Do not reset, replace the framework wholesale, erase local logs/database records, invent approved package prices/formulas/providers, promise the pilot date, claim simulated integrations as production, or treat browser bundles as installed mobile apps. Keep real backend functionality while improving polished client-first usability. Trainer dashboard needs its own later design pass. Owner feedback—not a generic template—should guide design.

A sensible next milestone is actual device validation and production-foundation decisions in parallel with approved coaching workflows, then building real nutrition/progress/check-ins and remaining trainer operations in small tested slices. Let the user's latest goal choose priority; do not silently substitute a different project. Before exposing services, decide auth/privacy/deployment and preserve the development-only boundary. Maintain positive/negative permissions and persistence/sync tests as features grow.

Return concrete reviewable changes, actual test outcomes and honest limitations. User prefers action over repeated permission questions and has previously asked for pushed GitHub updates and usable ZIPs, but check scope before destructive actions, paid commitments or external communications. Never ask for secrets in chat.

## 13. Commit history reference

259499a owner requirements/planning baseline.
66076dc shared training rules and staged plan.
ebc68b1 PostgreSQL/auth/invitations/assessment API.
297b9e0 connected staff dashboard.
499910b shared Expo client onboarding.
0879325 versioned assigned workout previews.
2e54122 offline persistence/idempotent sync.
88ba2bb seeded connected working model.
d38dc94 Windows Expo/asset-path fixes.
d309d33 first prototype integration.
6567f3c premium visual/guided-profile/focused-workout redesign.
3622ef5 stale-build detection and UX refresh 2 verification.

Proceed from this real application state, not the original empty repository or fictional prototype alone.


# Full source appendices

The following are unabridged project documents, not fresh execution instructions. Some contain older status paragraphs. Apply the current-state precedence explained above. The owner requirement statuses remain preserved.


---

## Source: docs/requirements/FitPilot_Product_Requirements_Specification_v1.txt

FITPILOT
Product RequirementsSpecification
Trainer platform, client apps and shared coaching backend
Version:  1.0 - consolidated discovery baselinePrepared:  4 November 2026Pilot target:  4 January 2027 (5-10 invited clients)Platforms:  iOS + Android client apps; web trainer dashboardLanguage:  English at initial launchStatus:  Requirements baseline for estimation and implementation planning
Prepared from the FitPilot Trainer Planning Workbook (Draft 01, 04 Nov 2026) and the trainer discovery decisions recorded in this conversation.
Important status note  This document is a requirements baseline, not a fixed-price estimate, delivery commitment, legal opinion, architecture approval or confirmation that external providers have approved access.
Document guide
Section
Contents
1
Executive product brief
2
Goals, scope and success measures
3
Users, roles and access model
4
Application screen maps
5
Feature register
6
Detailed functional requirements
7
Core workflows and business rules
8
Adherence, automation and notification rules
9
Data model and system architecture constraints
10
Privacy, security and compliance requirements
11
Prioritised release plan: P0 / P1 / P2
12
Integrations and external dependencies
13
Content and launch asset checklist
14
Two-month pilot plan and exit criteria
15
Open decisions and risks
16
Implementation brief for Codex
17
Acceptance test catalogue
18
Source basis and external references
How to read this document
Label
Meaning
Confirmed
Directly stated by the trainer or explicitly accepted during discovery.
Proposed
A product recommendation to make the pilot buildable; requires approval before it becomes a binding rule.
Open
Insufficient information to specify safely. Do not invent a value or behaviour.
Dependency
Requires provider approval, data access, licensing, legal review, supplied assets or external service.
P0 / P1 / P2
P0 = required for pilot/core operations; P1 = next release / early expansion; P2 = later capability.
Conflict-handling rule  Where a user preference conflicts with platform rules or a system permission model, this specification records the preference and the unavoidable implementation constraint separately. Do not silently remove the constraint.
1. Executive product brief
FitPilot is an independently owned fitness-coaching platform intended to replace the trainer’s current reliance on Spur.fit. It consists of a client app for iOS and Android, a web-based trainer workspace (FitPilot Coach), and a shared backend. The product is designed around combined workout and nutrition coaching, with optional separate training and nutrition coaches assigned to the same client.
The initial business is based primarily in Kerala, India, with some international clients. The current client base is 16 paying clients; the stated 12-month target is 50 high-ticket clients. The initial operating team is four training coaches, four nutritionists and one administrator.
Dimension
Current baseline
Business goal
Replace Spur.fit with a platform controlled by the business.
Current / target clients
16 current paying clients; target 50 high-ticket clients within 12 months.
Programmes
Fat-to-fit transformation; strength and conditioning; workout + nutrition combined.
Client geography
Mostly Kerala; some clients abroad.
Devices
Most current clients use iPhone; Android and iOS must launch together.
Team
4 training coaches, 4 nutritionists, 1 administrator (9 total).
Pilot
Private pilot with 5-10 existing clients; target 4 January 2027.
Language
English only for initial release.
Budget
Build budget and monthly operating ceiling are not finalised.
Migration
No Spur.fit data migration; start with fresh data.
Product positioning
FitPilot should combine the workout logging depth of a dedicated strength-training tracker with the coaching operations of a trainer platform. It is not intended to be a generic social fitness network. The product should prioritise useful coaching data, reliable logging, clear coach accountability and low-friction client adherence.
Product principles
Coach-led: programming, progression decisions and nutrition corrections remain under qualified human coaches.
Client-centred data quality: imported, manually entered and calculated values must be distinguishable; missing wearable data is never treated as zero or failure.
Offline-tolerant workouts: clients can log sessions without a connection and sync later without losing or duplicating entries.
Least-privilege access: training and nutrition coaches see their work area plus agreed shared client information; administrators supervise all records.
Honest estimation: photo-based food analysis is an estimate and must allow confirmation and correction.
Business ownership: business-controlled developer accounts, domain, backend, source code, data, brand and deployment credentials must be addressed contractually.
2. Goals, scope and success measures
Business and product goals
Scale from 16 current paying clients to 50 high-ticket clients over 12 months without losing coaching quality.
Give coaches better visibility into client training, nutrition, lifestyle, recovery and progress.
Reduce repetitive administrative work through configurable reminders, package tracking, booking and communication workflows.
Offer clients a strong training experience: live logging, history, progression, rest timers, set types, RPE/RIR and offline capture.
Build an extensible platform that can later support additional wearables, 3D exercise content and richer nutrition intelligence.
In-scope product surfaces
Surface
Primary purpose
Initial user
FitPilot iOS app
Client onboarding, plans, workout logging, meals, check-ins, messaging, booking and package status.
Client
FitPilot Android app
Same core client capabilities as iOS; Android health integration via Health Connect as it is released.
Client
FitPilot Coach web dashboard
Client management, assessments, programming, nutrition plans, reviews, communication, automations, bookings, packages and payments.
Training coach / Nutrition coach
Admin workspace
Staff, client assignment, packages, payment oversight, global settings, privacy and audit supervision.
Administrator
Shared backend
Identity, permissions, data, media, sync, notifications, provider connections and entitlement rules.
System
Non-goals for the first pilot
A standalone Apple Watch app. Apple Watch data import through HealthKit may be supported without a dedicated watchOS app.
Social feed, leaderboards or public workout sharing; these were not selected as requirements.
AI-generated workout programmes and premade course marketplace; the workbook lists these as optional and not approved.
WhatsApp/SMS as primary communication; the trainer selected in-app communication as the primary channel.
Spur.fit migration; the decision is to start with fresh data.
Guaranteed direct integrations with every wearable brand or every metric.
Suggested pilot success measures (targets still need owner approval)
Measure
How to observe it
Target status
Onboarding completion
Invited pilot clients who finish required assessment before programme activation.
Set numeric target before pilot.
Workout data reliability
Workout logs retained through offline use and successful sync; duplicates and lost entries tracked.
No P0 data-loss defects.
Coach workflow usability
Coaches can create, assign, adjust and review plans without developer intervention.
Qualitative pilot acceptance.
Client check-in completion
Daily and weekly check-in completion by pilot client.
Establish baseline during pilot.
Role isolation
No coach can access another unassigned client or perform unauthorised cross-scope edits.
Zero critical permission failures.
Payment correctness
Package access changes only after verified payment or admin approval.
Zero false activations.
App stability
Crash-free sessions, sync failures and support issues.
Agree thresholds before external rollout.
3. Users, roles and access model
Role
Core responsibilities
Access rule
Client
Complete onboarding; view assigned plans; log workouts/meals; submit check-ins; message coaches; book sessions; view package status.
Access own account and own records only.
Training coach
Build and revise workout programmes; review training logs, performance, exercise form and training-related check-ins.
Access assigned clients; edit training area; view shared client data.
Nutrition coach
Build meal plans; review food logs, meal adherence, hunger/digestion and nutrition check-ins.
Access assigned clients; edit nutrition area; view shared client data.
Dual-qualified coach
Manage both training and nutrition when explicitly assigned both scopes.
One staff account may hold both responsibility scopes for a client.
Administrator
Supervise staff, client assignments, all client records, packages, payments, operations and audit.
Broad access to all business records; sensitive actions logged.
System/service account
Run scheduled messages, sync, webhook handling and background jobs.
No interactive access; narrowly scoped service permissions.
Coach assignment model
A client can have a Training Coach and a Nutrition Coach simultaneously. A coach who is qualified and authorised for both disciplines may be assigned both scopes, so a second coach is not mandatory. Both coaches can access the shared client information confirmed in discovery: bodyweight, progress photos, recovery information and check-ins. Each coach edits their own responsibility area. Admin can supervise all client data.
Open access detail  The trainer has not yet specified whether the training coach should have read-only visibility into the nutrition plan itself (and vice versa), beyond the named shared information. Default recommendation: deny cross-area editing; permit only a shared summary until the business approves broader read access.
Permission rules required in code
Enforce permissions on the backend/API, not only by hiding buttons in the UI.
Assignment changes take effect immediately for future access; log who changed the assignment and when.
Every coach action should be attributable to a staff account and responsibility scope.
Administrators can view all records but should use named accounts, strong authentication and an audit trail.
Progress photos and health/wearable records require clear disclosure and consent; access must be scoped and logged.
A client can have one or two responsibility assignments, not an unbounded set of primary coaches per scope unless later approved.
4. Application screen maps
4.1 Client app - proposed navigation
Area
Screens / capabilities
Home
Today dashboard; workout due; daily check-in; package status; next live session; reminders; coach feedback.
Training
Current programme; calendar; workout detail; live workout logger; rest timer; exercise library; history; PRs; strength/volume charts.
Nutrition
Current meal plan; alternatives; macro targets; food diary; meal photo/text logger; barcode/label scanner; recipes and saved meals.
Progress
Weight trend; measurements; progress photos; weekly check-in; monthly comparison; recovery and lifestyle summary.
Messages
Coach conversations; text; voice note; photo/video attachments; exercise-form submission; meal/workout feedback.
Sessions
Available slots; booking; meeting link; reminders; reschedule/cancel; attendance history.
Profile & settings
Personal profile; notification preferences; time zone; health platform connection/permission status; privacy notice; account deletion request.
4.2 FitPilot Coach - web dashboard
Area
Screens / capabilities
Overview
Business pulse; assigned-client list; overdue check-ins; missed workouts; pending messages; upcoming sessions; expiring packages.
Clients
Search/filter; client profile; assessment; shared timeline; coach assignments; notes (private/shared distinction open).
Training workspace
Programme builder; exercise library; templates; weekly schedule; workout history; PRs; progression and muscle-group analysis.
Nutrition workspace
Meal plan builder; food database; alternatives; macro targets; recipe builder; meal log review and corrections.
Check-ins & progress
Daily and weekly check-in review; measurements; photos; comparison; recovery; exercise-form video review.
Messages
Client threads; media; feedback on meals/workouts; message templates.
Automations
Trigger builder; client/group selection; template editor; schedule; pause/resume; run history.
Calendar
Availability; session booking; meeting links; reschedule/cancel; attendance and remaining allowance.
Packages & payments
Package builder; client-specific offers; entitlements; payment ledger; renewals; failed/overdue status; refunds.
Content & settings
Exercise and food content; staff accounts; permissions; notification settings; privacy and audit views.
4.3 Admin workspace
Staff directory and role assignment.
Global client directory and coach assignment oversight.
Business-wide package catalogue and payment monitoring.
All-client data supervision, subject to consent, retention and audit safeguards.
Automation and notification oversight.
Data access, deletion requests, retention controls and audit events.
Integration/provider configuration and service health.
5. Feature register
Priority describes the recommended delivery sequence, not the long-term importance of the capability. “P0” means needed for the controlled pilot or safe core operation; “P1” means early follow-on release; “P2” means later expansion. Items marked Open are not ready to be estimated as committed scope.
ID
Feature
Decision status
Priority
Confirmed scope summary
Open items
C01
Account and onboarding
Keep + expand
P0
Invite-based pilot account; profile; goals; experience; equipment; availability; required comprehensive assessment; package status; notification settings; compliant deletion path.
Exact required assessment fields; pre-purchase browsing.
C02
Workout plans and exercise demos
Keep + change
P0/P1
Programme schedule, rest days, reusable templates, sets/reps/load/rest, searchable exercise library, cues and substitutions. Simple anatomical 3D demos are confirmed direction.
3D asset pipeline, initial library size, and whether every published exercise must have 3D at pilot.
C03
Workout logging and progression
Keep + expand
P0
Live logging; previous values; warm-up/working/drop/failure sets; supersets; RPE/RIR; timers; history; PRs; estimated 1RM; volume; offline sync.
Exact e1RM formula, PR types and volume convention.
C04
Check-ins and body progress
Keep + expand
P0
Daily check-in; weekly check-in; weight; measurements; photos; monthly comparison; sleep/energy/soreness; form-video submissions.
Exact question sets, photo cadence, retention and consent wording.
C05
Adherence and daily support
Keep + define
P1
Assigned vs completed workouts; meal logging/check-ins; reminders; coach feedback.
Workout/nutrition adherence formulas, rest/illness/partial-session treatment.
N01
Nutrition plans and food diary
Keep + expand
P0
Structured plans with alternatives plus flexible calorie/macronutrient targets; meal timing; saved meals; recipes; diary.
Nutrition targets and units, recipe approval and food source licensing.
N02
Photo + description macro logger
Keep + expand
P1
Photo/text input; suggested foods; confirm ingredients/oil/portion; editable estimate; trainer correction.
Model/provider, confidence UX, supported local-dish coverage and cost.
N03
Traceable nutrition calculations
Keep + expand
P1
Source and serving quantity; packaged food barcode; label scan; custom recipes and ingredient quantities. Custom client entries remain private.
Database/API licence and coverage; source priority; barcode provider.
H01
Wearables and health dashboard
Keep + phase
P1
HealthKit and Health Connect first; show available steps, sleep, workout duration/type, heart rate and trends; later direct device integrations.
Pilot data types, platform parity, vendor API approvals and client device inventory.
H02
Data quality and permission
Keep + strengthen
P0
Show source and last sync; separate imported/manual/calculated; deduplicate; missing data not zero; permission denial/revocation handling.
Retention and deletion schedule; exact sync freshness thresholds.
T01
Client management and plan building
Keep + expand
P0
Multi-coach responsibility assignments; client profiles; workout/nutrition templates; plan assignment/revision; attention list; reviews.
Private notes, groups/tags, bulk assignment and cross-coach read access.
T02
Messaging and reviews
Keep + expand
P0/P1
In-app text, voice notes, photo/video, form submissions, direct meal/workout feedback; no WhatsApp-first workflow.
Read receipts, attachment limits, reply windows and after-hours policy.
T03
Trainer-controlled automations
Keep + expand
P1
Coach-created templates; select client/group; trigger, timing and channel; pause/resume; run history.
Approval-before-send option and per-client daily limits.
T04
Notifications and reminders
Keep + expand
P0/P1
Push/in-app reminders; workout, meal, check-in, session, renewal and announcements; time zones and quiet hours.
Daily cap, default quiet hours, delivery fallback.
T05
Live sessions and calendar
Keep + change
P1
Online booking, availability, reminders, rescheduling/cancellation, external meeting links, attendance/history.
Cancellation windows, buffers, no-shows and session-credit deduction.
B01
Package builder
Keep + expand
P0
Standard and client-specific workout, nutrition, combined, live and complete packages; custom duration, price, inclusions, sessions, check-ins, support and instalments.
Actual offers/prices, proration and package entitlements.
B02
Payments and renewal tracking
Keep + phase
P0/P1
Manual ledger and verified activation; website/in-app route by SKU policy; UPI/cards/international/bank transfer; instalments, discounts, trials, refunds and expiry.
Razorpay approval, in-app purchase classification, direct bank feed and international settlement.
D01
Privacy, access and ownership
Keep + compliance override
P0
Client/staff permissions; admin supervision; explicit consent; secure media; audit; account deletion; health-source revocation handling; business ownership.
Retention schedule and legal review.
D02
Migration and launch
Change
P0
Fresh start; no Spur.fit migration; invite-only pilot of 5-10 clients; test both mobile platforms.
Prototype access/code reuse; app distribution method and launch gates.
X01
Multi-coach assignment model
New
P0
Client may have training + nutrition coach; dual-qualified coach may hold both scopes; admin supervises.
Cross-area read access beyond shared summary.
X02
Anatomical 3D exercise library
New
P1
Simple anatomical 3D exercise animations; owned/licensed assets; searchable and linked to programmed exercises.
Asset vendor/production process, initial exercise count and per-exercise acceptance.
X03
Client consent and deletion controls
New / mandatory
P0
Clear consent/notice, connection permissions, account deletion initiation and required external deletion URL.
Legal retention, deletion SLA and exact policy copy.
6. Detailed functional requirements
6.1 Client identity and onboarding (C01)
Pilot accounts should be invitation-led. Public discovery/signup is not approved for the pilot; confirm final self-signup model before public release.
Client must complete a comprehensive baseline assessment before a coaching programme is activated.
Assessment should capture profile, goals, training history, schedule/availability, equipment, injury/limitation disclosures, lifestyle, dietary preferences/restrictions, baseline weight/measurements and optional progress photos.
Strength, mobility and conditioning tests are conducted by the coach in a one-to-one online consultation; FitPilot records the coach-entered outcomes. The app is not expected to run automated physical tests.
An admin or assigned coach may identify missing required fields. A programme cannot be marked ready while required assessment fields remain incomplete.
Client must see package status and assigned coach identities.
6.2 Training and exercise library (C02/C03/X02)
Programme builder supports days, exercises, sets, reps, load, rest, cues, rest days, templates and substitutions.
Advanced set types: warm-up, working, drop and failure. Supersets are required. Circuits, tempo, timed exercises, warm-ups as blocks and other advanced constructs remain open unless separately approved.
Workout logger shows previous-session values beside current targets; supports partial save, complete, interrupted and offline states.
RPE/RIR are recorded per set or exercise; exact input granularity remains open.
Rest timer may auto-start from the programmed rest interval and allow client adjustment; completion or skipping should not silently alter the programmed rest target.
PRs, estimated 1RM, volume and weekly muscle-group volume are required. Formulae and muscle mapping must be documented and testable.
Workout calendar and full session history are required. Offline sessions must retain timestamps and sync idempotently.
Exercise demonstration direction is simple anatomical 3D. Every published exercise should have a trainer-approved demonstration; whether all pilot exercises require newly produced 3D assets is open.
6.3 Nutrition and food logging (N01-N03)
Nutritionist can create structured meal plans with quantities and alternatives and/or flexible macro targets.
Client food diary supports actual food entries, meal timing and optional photos; hunger and digestion feedback are part of client monitoring.
Food database target includes Indian and international foods and Kerala-specific meals/recipes.
Barcode scan and label scan should identify a packaged food and show the matched item/source/serving where available.
Custom recipes use ingredient quantities; custom food entries and recipes created for an individual client remain private to that client.
Photo/text meal analysis proposes likely foods, asks about missing ingredients, cooking oil and portions, presents an estimate with uncertainty, and requires client confirmation/correction before saving.
Nutrition calculations display source and serving quantity. Cronometer and MyFitnessPal are preferred potential sources only; integration access is not confirmed. USDA FoodData Central is a candidate fallback from the workbook.
Nutrition coach can review/correct meal logs. Correction semantics (amend the old log vs future defaults) remain open.
6.4 Progress and recovery (C04/H01/H02)
Cadence
Confirmed data
Daily
Steps and sleep where imported; meals and meal timing; energy; hunger; soreness; workout completion. Stress is part of the subjective lifestyle set. A short daily check-in should capture subjective items.
Weekly
Bodyweight trend; measurements where relevant; weekly progress check-in; workout/nutrition adherence; coach feedback.
Monthly
Progress photos; physique comparison; programme review.
Shared overview
Weight, progress photos, recovery and check-ins visible to both assigned coaches and the administrator.
Show source, timestamp/last sync and status for imported metrics; identify manually entered and calculated values.
No wearable data must be treated as zero or as client failure.
Prevent duplicate workouts/steps when both manual and imported data refer to the same activity; exact deduplication approach is a technical design decision.
Client may decline or revoke OS-level health permissions; app must continue useful manual workflows and explain missing data.
6.5 Communication (T02)
In-app one-to-one text messaging.
Voice notes.
Photo and video sharing.
Exercise-form video submission and coach review.
Direct feedback attached to workout and meal records.
Video consultation scheduling using external meeting links; in-app video calling is not required for the pilot.
Messages are associated with client and staff identities; media access is private and logged.
6.6 Trainer operations and automations (T01/T03/T04/T05)
Client list/search, profile, plans, templates, progress review and attention list for missed sessions/pending replies.
Coaches can revise active programmes. Revision history must preserve who changed what and when; clients need a clear current plan and revision timestamp.
Automations are coach-configurable: message template, target clients/groups, trigger, schedule/channel, pause/resume and delivery history.
Initial triggers: welcome; incomplete assessment; overdue workout; missing daily check-in; overdue weekly check-in; no meal log; programme nearing completion; package renewal approaching; PR/milestone.
Calendar supports trainer availability, one-to-one online booking, reminders, reschedule/cancel, external meeting link, attendance and session history.
Client timezone, quiet hours, duplicate prevention and completion-based cancellation must be respected.
6.7 Packages and payments (B01/B02)
Package builder supports workout-only, nutrition-only, combined, live-coaching and complete packages; standard and client-specific offers.
Configurable fields: price, currency, duration, start/expiry, session count, check-in frequency, support inclusion, payment schedule and service entitlements.
Lifecycle operations: pause/resume, extension, upgrade/downgrade, instalments, discount codes, free trials, refunds/cancellations and automatic access suspension after expiry/non-payment.
Purchase route may be in-app or website checkout depending on package classification and app-store rules. Store policy must be mapped per SKU; do not assume every combined/digital coaching offer is eligible for external checkout.
Payment methods requested: UPI, debit/credit cards, international payments and bank transfers. Razorpay is preferred, subject to merchant activation and eligibility.
Razorpay payment link/bank transfer and direct business bank transfer must both be considered. For direct bank transfer, automated notification to admin depends on an available verified bank feed/reconciliation provider; if unavailable, route to a pending manual verification queue.
Payment confirmation email is sent to admin when a payment event is submitted/detected. Package entitlement changes only after server-side verification or explicit admin approval.
No activation based only on client screenshots or unverified client claims.
7. Core workflows and business rules
7.1 New client onboarding
1. Admin/coach creates invite and assigns package (or creates a pending purchase).
2. Client accepts invite and creates account.
3. Client completes required profile and comprehensive assessment.
4. Client grants or declines relevant health-data permissions; manual alternatives remain available.
5. Coach schedules a one-to-one video assessment and records strength/mobility/conditioning findings.
6. Training and/or nutrition coaches are assigned to the client.
7. Coaches create and review the programme/meal plan.
8. Admin or authorised coach activates the package and programme after assessment and payment/approval conditions are met.
7.2 Workout programming and delivery
1. Coach creates a programme from scratch, a reusable template or a copy of an existing plan.
2. Coach adds weekly schedule, rest days, exercises, set types, reps, load, rest, supersets, RPE/RIR targets and demonstrations.
3. Coach publishes a version; the client sees the active plan and schedule.
4. Client starts a session; previous values load; sets and rest timers are recorded.
5. If offline, workout records are saved locally with unique identifiers and queued for sync.
6. On sync, server reconciles idempotently and returns authoritative session state.
7. Coach reviews history, PRs, e1RM, volume and notes; any programme revision creates a new version/audit event.
7.3 Nutrition planning and meal logging
1. Nutrition coach sets calorie/macronutrient targets and creates structured meal plan with alternatives.
2. Client logs meal by search, barcode/label, photo/text or saved meal.
3. Photo/text logger proposes foods and requests portion/ingredient/oil clarification.
4. Client reviews and confirms or edits the proposed food and serving.
5. App calculates macros from the matched, traceable food/recipe data and saves the confirmed log.
6. Nutrition coach reviews and corrects entries; custom client entries remain private to that client.
7.4 Coach collaboration
1. Admin assigns training and nutrition responsibility scopes, possibly to two different coaches.
2. If a dual-qualified coach is assigned both scopes, one account manages both areas.
3. Each coach sees their own plan/work area plus shared bodyweight, progress photos, recovery and check-ins.
4. Coaches coordinate using shared client context and in-app messages/feedback.
5. Admin supervises all client records and can intervene; administrative access is auditable.
7.5 Payment and package activation
1. Client selects a package and eligible purchase route is determined by the package SKU and store policy.
2. Website/in-app checkout creates a server-side order/payment record; provider callback is not treated as final proof by itself.
3. Backend verifies captured/paid state with provider and validates webhook authenticity; idempotency prevents double activation.
4. Razorpay bank transfer event or payment link event triggers admin email and payment ledger update.
5. Direct bank transfer is matched through approved bank feed/reconciliation or placed in a pending manual verification queue.
6. Admin can approve/reject a pending bank transfer with reason and audit entry.
7. Only verified/approved payment activates the corresponding entitlement.
8. Expiry, pause, extension, instalment failure, refund and cancellation update access based on configured package rules.
7.6 Automation example
Acceptance-style example  Given a client has an assigned workout due today, when the configured reminder time arrives and the workout remains incomplete, send the coach-approved template once in the client’s timezone. If the client completes the workout before the reminder time, cancel the queued reminder. If the package is paused, do not send it.
8. Adherence, automation and notification rules
8.1 Adherence definitions - proposed, pending trainer sign-off
Metric
Proposed definition
Still requires decision
Workout adherence
Completed eligible assigned sessions divided by eligible scheduled sessions in the chosen period.
What constitutes completion; partial sessions; illness; coach-cancelled sessions; client travel/pause.
Nutrition adherence
Use meal logs plus weekly client check-in against coach-defined targets; show coverage/completeness separately from target compliance.
Whether score is based on logged meals, calorie/macros range, meal-plan servings or coach judgement.
Rest days
Exclude planned rest days from workout adherence denominator.
How rescheduled sessions are handled.
Missing wearable data
Never count as zero activity or failure; display unavailable/stale.
Stale threshold and reminder behaviour.
Partial workout
Store completed sets/exercises and label session partial; do not silently upgrade to complete.
Whether coach can manually mark it complete and how it affects score.
Offline session
Count after sync based on recorded session state and original timestamp.
Conflict rules if coach revised the plan while the client was offline.
8.2 Automation matrix
Trigger
Target event
Guardrails
Client joins
Welcome message
Send once; only after account activation.
Assessment incomplete
Assessment reminder
Stop on completion; respect quiet hours.
Workout incomplete by time
Workout reminder
Cancel on completion; once per trigger window; suppress during pause.
Daily check-in missing
Daily check-in prompt
Stop after submission; no duplicate.
Weekly check-in overdue
Weekly follow-up
Stop after submission; coach can pause.
No meal log
Nutrition reminder
Do not treat missing logs as confirmed non-adherence; configurable grace period.
Programme nearing completion
Programme-end notice
Configurable lead time; stop if programme extended.
Package renewal approaching
Renewal reminder
Stop after renewal/payment; respect pause and cancellation.
PR/milestone achieved
Achievement message
Deduplicate the same event; coach template; do not expose publicly by default.
8.3 Notification policy - proposed defaults need approval
All scheduled events use the client’s local timezone.
Client quiet hours and notification preferences are respected.
Do not send duplicate reminders for the same event.
Completion, cancellation, pause or renewal should cancel obsolete queued reminders.
Provide in-app notification history and delivery status; push delivery is not guaranteed.
Define maximum reminders/day, default quiet hours and coach approval rules before enabling production automations.
9. Data model and system architecture constraints
Core domain entities
Domain
Representative records / relationships
Identity & organisation
Organisation/workspace; user; client profile; staff profile; role; coach responsibility assignment; authentication session.
Assessment & progress
Onboarding assessment; coach fitness assessment; measurement; progress photo; daily check-in; weekly check-in; recovery observation; consent record.
Training
Exercise; muscle-group mapping; exercise asset; workout template; programme; programme version; day schedule; session; exercise log; set log; rest timer event; PR; e1RM record.
Nutrition
Food item; food source; recipe; recipe ingredient; meal plan; meal alternative; macro target; saved meal; food estimate; confirmed meal log; correction event.
Health integrations
Provider connection; permission state; sync cursor; health sample; imported workout; import provenance; last-sync timestamp.
Communication
Conversation; participant; message; attachment; feedback reference; message template; automation rule; trigger event; notification job; delivery record.
Sessions & commerce
Availability slot; booking; meeting link; attendance; package definition; package instance/entitlement; payment attempt; payment; invoice; instalment; refund; discount.
Governance
Audit event; data-retention policy; deletion request; access event; integration secret reference; provider webhook event.
Architecture constraints for the implementation team
Use one shared backend and a canonical API/domain model for iOS, Android and the trainer dashboard.
Use backend-enforced role- and assignment-based access control. Admin privileges must be explicit and auditable.
Use a relational source of truth for clients, staff, programmes, assignments, packages, payment states and audit history.
Store photos, videos, voice notes and exercise media in private object storage; use access-controlled, time-limited delivery URLs.
Use a background job/queue for reminders, webhooks, image/food processing and wearable sync. Jobs must be retry-safe and idempotent.
Use a local mobile database/queue for workout logging offline; sync must not lose or duplicate records.
Keep provider secrets on the server. Do not embed payment, nutrition or wearable API secrets in the mobile apps.
Use versioned workout and nutrition plans; edits to active plans create a revision record.
Use a provider-adapter layer so direct wearable and food providers can be added without redesigning the core domain.
Use explicit source/provenance fields for imported, manual and calculated health/nutrition values.
Provide observability for sync failures, webhook events, scheduled jobs, media processing and permission errors.
Recommended implementation posture (not a locked stack)
Have Codex inspect the existing prototype and repository before choosing or replacing frameworks. If no production stack exists, propose and justify a maintainable shared-codebase approach for iOS/Android, a web dashboard, a secure API, relational database, private media storage and background job service. Do not assume the clickable prototype’s simulated data/integrations are production-ready. Keep infrastructure and developer accounts under business control.
10. Privacy, security and compliance requirements
Material correction to the earlier preference  The trainer initially preferred not to offer client data downloads, wearable disconnection controls, photo permission controls or account deletion. Data export is not included as a normal product feature. However, account deletion and the ability to revoke health-data access cannot be omitted from the platform design. These are required by app-store policies and/or underlying operating-system permission controls.
10.1 Minimum privacy controls
Publish an accessible privacy policy inside the app and in store listings. Identify data collected, source, purpose, processors/third parties, retention and deletion process.
Obtain clear consent/authorisation before collecting progress photos, health metrics or other sensitive personal data; describe which coaches and administrators can view them.
Provide a way to initiate account deletion in the client app and a separate working web deletion-request path for Google Play listing requirements. Complete deletion except records that must be retained for lawful, security or fraud-prevention reasons; disclose retention.
Provide an in-app connection/permission status and a clear route to OS settings. Clients may revoke HealthKit or Health Connect permissions at OS level; app must detect inaccessible/stale data and continue with manual entry.
No advertising, unrelated marketing, or unrelated data mining using health/fitness data. Use data only for the disclosed coaching/product purpose and permitted service operations.
Use encryption in transit and at rest; secure authentication; least privilege; staff access logs; private media storage; secret management; backup and incident response.
Admin access to all records is a business requirement, but access must use named accounts and be auditable.
No client-facing data export/download function is requested for the initial product. This does not remove any legal access rights or responses that may be required by applicable law.
10.2 Platform and regulatory checks
Area
Requirement / impact
Apple App Store
Apps that support account creation must provide an in-app account-deletion initiation path. HealthKit access is permission-based by data type; users can revoke permissions in Settings/Health. Apple’s person-to-person service exception covers real-time one-to-one fitness training; one-to-few and one-to-many services have different IAP treatment.
Google Play
Apps that allow account creation must provide an in-app deletion path and a functional external web deletion resource. Google’s one-to-one online paid-services exception is limited to eligible real-time services between two individuals that are not replayable; digital plan/content packages require SKU-specific analysis.
Health Connect
Declare only required data permissions. Users grant/deny data-type permissions; background and historical reads can require additional permissions.
India DPDP
DPDP Act/Rules commencement is phased. The 13 Nov 2025 Gazette notification schedules the main set of provisions for 18 months after publication (approximately 13 May 2027). The pilot target is earlier, but the product should be designed for the upcoming obligations and reviewed by India-qualified counsel.
Razorpay
International cards require merchant activation and partner checks. Bank-transfer functionality via payment links is an on-demand feature for the relevant Razorpay flow. Confirm account eligibility and supported payment methods before committing.
11. Prioritised release plan: P0 / P1 / P2
P0 - controlled pilot foundation
Invite-based accounts, client profile, mandatory comprehensive assessment and coach-entered one-to-one fitness assessment results.
Web dashboard with staff/client management, role/assignment model and admin supervision.
Training and nutrition programme creation, versioning and assignment.
Core advanced workout logger: previous values, set types, supersets, RPE/RIR, rest timer, workout history, PR/e1RM/volume basics and offline save/sync.
Nutrition plan with structured meals, alternatives, macro targets and manual/search-based meal logging.
Daily and weekly check-ins; weight/measurements and progress photos with consent/visibility rules.
In-app messaging baseline, client feedback and secure media attachments needed for coaching.
Package definitions, client entitlement status and admin-managed payment ledger; verified payment activation path.
Basic notifications; privacy policy, consent, OS health-permission handling, account deletion path and audit log.
Fresh-data start; no Spur.fit migration.
P1 - early production expansion
3D anatomical exercise library and a curated initial high-frequency exercise asset set.
HealthKit and Health Connect imports for agreed priority metrics; direct vendor integrations after feasibility review.
Barcode and food-label scanning; photo/text meal recognition with human confirmation and traceable data sources.
Coach-configurable trigger-based automations and advanced notification controls.
Full online session booking workflow, external meeting links, attendance and cancellation/session allowance rules.
Razorpay checkout/payment links/webhooks, instalments, refund handling and admin reconciliation improvements.
Advanced progress and adherence dashboards after formulas are signed off.
P2 - later roadmap
Dedicated Apple Watch app; not planned for the near term.
Expanded direct integrations for WHOOP, Garmin, Fitbit, Oura and other device-specific platforms where commercial/API access supports them.
Broader AI meal recognition coverage, advanced analytics and additional automation channels.
Optional home/travel mode, shortened workouts, programme pause/resume, AI programme generation, premade courses and WhatsApp/SMS only after separate approval.
Scope caution  P0 is a proposed pilot scope to make the two-month milestone realistic. It is not a statement that every P0 item can be built, tested and approved by 4 January 2027. Estimate each feature with the development team and freeze a minimum demonstrable pilot slice.
12. Integrations and external dependencies
Integration
Intended use
Status / risk
Recommended sequence
Apple Health / HealthKit
Read permitted steps, sleep, workouts, heart rate and related supported metrics.
User permission required per data type; access may be revoked; availability varies by device and source.
First mobile health integration for iOS; exact pilot data types to approve.
Android Health Connect
Read permitted Android health/fitness records.
Only declared and granted data types; background/historical access can need additional permissions.
First mobile health integration for Android.
WHOOP / Garmin / Fitbit / Oura
Additional recovery, sleep and training signals.
Direct API access, scopes, commercial terms and user authorisation are unconfirmed.
Later direct adapters when Health platforms do not expose required metrics.
Razorpay domestic
UPI/cards/payment links/eligible bank transfer; webhooks.
Merchant KYC, product activation, webhook validation and fee/support terms.
Pilot with manual ledger fallback; then verified server integration.
Razorpay international
International cards and possibly international bank transfers.
Requires activation/eligibility and provider approval; not guaranteed.
Verify merchant onboarding before selling internationally through platform checkout.
Direct bank feed
Detect direct transfers to business bank account and notify admin.
No specific bank or reconciliation API selected; access/consent/coverage unknown.
Open dependency; if not available, admin manual verification queue.
FoodData Central / local food DB
Traceable food nutrients and recipe calculations.
USDA is candidate fallback; Indian/Kerala coverage and licensing need validation.
Define primary/secondary food source and local data plan.
Cronometer / MyFitnessPal
Potential nutrition data sources.
Workbook labels these preferred potential sources, not confirmed integrations.
Do not assume API access; seek permission/terms.
Barcode/label recognition
Packaged food data and nutrition label parsing.
Needs provider/database coverage and accuracy tests for Indian products.
P1 discovery and proof of concept.
Meal photo AI
Suggest foods, portions and macros.
Portion, ingredients and cooking oil remain uncertain; model/API cost and privacy need review.
P1; estimates must be confirmed by client.
External video meetings
Schedule and store meeting URL for coach-client sessions.
Provider not chosen; meeting link security/retention must be considered.
P1; external link support first.
Push notifications
Workout/check-in/renewal/session reminders.
APNs/FCM configuration, delivery and permission behaviour.
Basic P0 notifications; advanced orchestration P1.
13. Content and launch asset checklist
Asset group
Required material
Exercise library
Exercise names, movement pattern, primary/secondary muscles, equipment, cues, common mistakes, regressions/substitutions, trainer approval.
3D exercise media
Simple anatomical 3D model style; looping clip; camera angle; start/end positions; correct range; muscle highlight policy; captions/labels; owned/licensed rights; initial exercise shortlist.
Workout templates
Starter templates for transformation and strength/conditioning; deload examples; warm-ups; rest-day patterns; approved exercise substitutions.
Nutrition content
Indian and Kerala food items, raw/cooked state, household measures and gram weights, recipe ingredients, cooking method, oil quantity, macro source and serving size.
Food data/legal
Database/API licences; attribution requirements; barcode data provider; label parser; photo-AI provider terms and data processing terms.
Onboarding forms
Required questions, optional questions, consent copy, injury/limitation wording, dietary/allergy questions, photo instructions.
Check-in forms
Daily subjective check-in; weekly review; monthly progress/photo review; pain/fatigue escalation rules.
Message templates
Welcome; incomplete assessment; workout reminder; check-in reminder; meal reminder; programme end; renewal; PR/milestone.
Business content
Package names, real prices, durations, entitlements, refund/cancellation policy, instalment rules, discounts and trial policy.
Privacy/legal
Privacy policy, terms, consent notices, retention schedule, account deletion page, support contact, processor list, breach response workflow.
Store launch
App name/description, screenshots, icon, support URL, privacy URL, demo account/reviewer instructions, permission purpose strings, data safety disclosures.
Operations
Staff accounts, role matrix, admin owner, business email, domain, hosting accounts, payment merchant accounts, backups and escalation contacts.
14. Two-month pilot plan and exit criteria
The requested pilot target is 4 January 2027, with 5-10 existing clients, and iOS and Android available at the same time. This is an aggressive target. Store review, app signing, provider activation, media asset production and security testing are external or schedule-sensitive dependencies. Treat the date as a target, not a delivery guarantee.
Phase
Indicative window
Focus / gate
A. Technical discovery
4-10 Nov 2026
Inspect prototype/repository; select production architecture; freeze P0 slice; confirm developer accounts, data model, design system, provider feasibility and costs.
B. Foundation
11-24 Nov 2026
Authentication; roles/assignments; backend schema; invite flow; client onboarding; coach/admin shell; private media storage.
C. Coaching core
25 Nov-8 Dec 2026
Programme builder; exercise library baseline; workout logger; offline local storage/sync; nutrition plan; meal diary; check-ins.
D. Operations
9-22 Dec 2026
Client messaging; media; package ledger; booking basics; reminders; consent/deletion; admin supervision and audit.
E. Hardening
23-30 Dec 2026
iOS/Android device tests; role/security tests; sync tests; data backup; analytics; pilot staff training; content seed.
F. Pilot readiness
31 Dec 2026-4 Jan 2027
Deploy production-like backend; invite 5-10 pilot clients; support channel; daily issue triage; go/no-go sign-off.
Pilot entry criteria
Both iOS and Android builds install and authenticate on the target test devices.
All pilot users are invited; no public signup dependency.
Client has assigned coach scope(s), completed onboarding, and sees the correct programme/package.
Workout log works online and offline; no lost/duplicate set entries in tested cases.
Coach and admin permissions pass negative access tests.
Nutrition plan and meal diary work with manual/source-backed entries; photo AI may remain P1.
Privacy policy, consent, account-deletion paths and health-permission handling are available.
Payment status can be recorded and verified by the admin; no unverified payment automatically activates access.
Pilot exit criteria
No unresolved critical security or cross-client data exposure issue.
No unresolved P0 workout data-loss or duplicate-write issue.
All pilot clients can complete the core onboarding-to-coaching workflow.
Coaches can review training/nutrition and shared progress information without permission leakage.
Admin can inspect package, assignment, check-in and payment status.
Top pilot feedback items are triaged into P0 fixes, P1 improvements or rejected scope.
15. Open decisions and risks
ID
Decision
Status
Risk
What must be decided
O01
Build budget and monthly operating ceiling
Open
High
No build budget or monthly run-cost ceiling supplied. Prepare estimates for MVP and full roadmap separately.
O02
Existing prototype/repository and stack
Open
High
Vidhul must provide repo/prototype access; inspect what is reusable and what is simulated.
O03
Account creation model after pilot
Open
Medium
Pilot likely invite-only; public signup/browse-before-buy is undecided.
O04
Comprehensive assessment field list
Open
High
Agree required vs optional questions, consent language and who can edit after submission.
O05
Training completion definition
Open
High
Define partial, interrupted, skipped, missed, illness and coach-rescheduled sessions.
O06
Nutrition adherence formula
Open
High
Agree whether based on target ranges, plan adherence, food logging completeness or coach assessment.
O07
Workout analytics formulae
Open
Medium
Choose e1RM equation(s), PR categories, volume convention and muscle-volume counting rules.
O08
Cross-coach read access
Open
Medium
Decide if each coach can read the other coach’s detailed plan or only shared client summary.
O09
3D exercise asset production
Open
High
Select tool/vendor/creator, IP ownership, style and pilot library size; no production budget set.
O10
Food source and licensing
Open
High
Confirm API/data rights, Indian/Kerala coverage, source hierarchy and update cadence.
O11
Food photo recognition provider
Open
High
Select model/provider and define confidence/uncertainty, privacy, cost and confirmation UX.
O12
Wearable pilot metrics
Open
Medium
Choose exact iOS/Android data types and minimum freshness; identify brands/models already used by clients.
O13
Razorpay activation and SKU policy
Open
High
Complete merchant KYC/activation; classify each package for Apple/Google checkout rules.
O14
Direct bank transaction detection
Open
High
Select bank/account and verify bank feed or reconciliation provider. Fallback is manual admin verification.
O15
Refund/upgrade/proration policy
Open
High
Define treatment of used sessions, partial periods, upgrade price differences, refunds and failed instalments.
O16
Booking rules
Open
Medium
Set buffers, cancellation window, reschedule limits, no-show handling and session-credit deduction.
O17
Automation safety defaults
Open
Medium
Set quiet hours, max reminders/day, grace periods, per-coach approval and time zone fallback.
O18
Data retention and deletion
Open
High
Legal review: photos, logs, health data, financial records, backups and third-party deletion.
O19
Staff private notes and groups
Open
Low
Decide tags/groups, bulk assignment and whether private coach notes are needed.
O20
Exercise programming edge cases
Open
Medium
Decide tempo, circuits, timed sets, warm-up blocks, drop-set structure, deload scheduling details.
O21
International client payments
Open
High
Razorpay approval, foreign currency/settlement, taxes and country-specific consumer/payment obligations.
O22
3rd party meeting provider
Open
Low
Choose calendar/video provider and privacy/access requirements for meeting URLs.
O23
App store release route
Open
High
Confirm developer accounts, TestFlight/Play testing tracks, review schedule and public release timing.
O24
Exercise video publishing rule
Open
Medium
Confirm whether a demonstration is mandatory for every exercise before publish and whether P0 can use licensed interim media.
16. Implementation brief for Codex
16.1 Instruction block
Codex operating instruction  Build only from this approved requirements baseline and the latest human-approved decisions. First inspect the existing repository/prototype. Do not assume simulated integrations are live. Do not add optional features without approval. Do not invent package prices, formulas, provider access, legal approvals or delivery guarantees.
16.2 Required build outputs
Architecture proposal: mobile app strategy, trainer web dashboard, API/backend, database, media storage, background jobs, notifications, integration adapters and deployment.
Domain model and entity relationship diagram, including responsibility-scope coach assignment and auditable admin access.
Role and permission matrix with server-enforced checks and automated negative tests.
API contract for client, coach, admin, workout logging, food logs, messages, bookings, packages, payments, notifications and integrations.
Working iOS and Android pilot client apps and responsive web trainer/admin dashboard.
Offline workout storage/sync design with idempotency, conflict handling and tests.
Payment state machine and secure webhook processing; no entitlement activation from unverified client-side callbacks.
Privacy, consent, account deletion, provider permission and audit workflows.
Automated unit, integration, end-to-end, permission and sync tests; test data fixtures; deployment/runbook documentation.
App store submission checklist and pilot support/rollback plan.
16.3 Architecture acceptance constraints
Concern
Required behaviour
Identity
Unique accounts; secure authentication; admin-created/invite flow for pilot; account deletion request pathway.
RBAC
Training, nutrition and admin scopes; one staff account may hold both coaching scopes; backend checks for every record.
Client isolation
A coach cannot enumerate or fetch an unassigned client’s data by changing an ID or API request.
Plan revision
Published plans are versioned; client history remains interpretable after edits.
Offline logging
Client can start/log/save session offline, restart app, reconnect and sync once without losing/duplicating sets.
Data provenance
Imported/manual/calculated data fields include source, timestamp and sync state.
Media
Private objects; signed access; file type/size limits; virus/malware scanning where appropriate; retention/deletion handling.
Payments
Provider signature verification, server-side status confirmation, idempotent webhooks, auditable admin overrides.
Automation
Jobs are idempotent; obsolete reminders cancelled; quiet hours/timezone; run history and failure handling.
Observability
Logs and alerts for failures; do not log secrets or unnecessary sensitive data.
Ownership
Business-controlled code repository, cloud account, domain, Apple/Google developer accounts, payment accounts and backups.
16.4 Suggested delivery sequence
1. Stage 1: repository/prototype audit, architecture decision record, data model, permission model and P0 definition.
2. Stage 2: authentication, business workspace, staff and client records, coach assignments, onboarding and consent.
3. Stage 3: programme builder, exercise content, live logger, offline persistence/sync and workout history.
4. Stage 4: nutrition plan, meal diary, daily/weekly progress and coach reviews.
5. Stage 5: messaging/media, package ledger, basic booking and notification workflow.
6. Stage 6: security/permission audit, device QA, data backup, pilot release channels and monitoring.
7. Stage 7: P1 integrations, photo-food analysis, 3D content expansion, Razorpay automation and advanced analytics.
16.5 Definition of done
Acceptance tests pass on iOS, Android and web surfaces as applicable.
Role permissions are tested positively and negatively.
Sensitive actions are logged.
No critical or high-severity data-loss, payment, privacy or access-control defect remains open for pilot.
External integrations are marked simulated, sandbox or production accurately; no mock state is presented as live.
Operational documentation, rollback plan, backup/restore test and support escalation owner exist.
17. Acceptance test catalogue
Test ID
Area
Given / When / Then acceptance criterion
AT-01
Onboarding
Given an invited client with missing required assessment fields, when they attempt programme activation, then activation is blocked and the missing fields are identified.
AT-02
Assessment
Given a completed assessment, when the assigned coach opens the profile, then baseline answers and submission timestamp are visible.
AT-03
Fitness assessment
Given a scheduled one-to-one consultation, when the trainer records strength/mobility/conditioning results, then the results are stored against the client assessment with author and date.
AT-04
Coach assignment
Given a client assigned to a training coach and a nutrition coach, when each logs in, then each sees the assigned client and shared client context.
AT-05
Dual-qualified coach
Given one coach is assigned both training and nutrition scopes, when that coach opens the client, then both work areas are available without creating duplicate client accounts.
AT-06
Access isolation
Given Coach A is not assigned to Client B, when Coach A requests Client B through a direct URL/API identifier, then access is denied and logged.
AT-07
Admin supervision
Given an authenticated administrator, when they open a client record, then authorised supervisory data is visible and the access event is auditable.
AT-08
Programme version
Given a published programme, when a coach edits an active programme, then a new revision is created and prior revision remains in history.
AT-09
Previous session
Given a client has a prior logged session, when they start the next matching workout, then the prior set values are displayed for reference.
AT-10
Set type
Given a workout includes warm-up, working, drop and failure sets, when the client logs them, then the set type is preserved in history and analytics.
AT-11
RPE/RIR
Given RPE/RIR tracking is enabled for a set, when the client submits the set, then the selected rating is saved with that set.
AT-12
Rest timer
Given a set has a programmed rest period, when the set is completed, then the rest timer starts and can be adjusted or skipped by the client.
AT-13
Offline log
Given the device is offline, when a client logs and saves a workout then restarts the app, then the local session and set data remain available.
AT-14
Offline sync
Given an offline session is queued, when connectivity returns, then each record syncs once and the server does not create duplicates.
AT-15
PR/e1RM
Given a logged set meets the approved PR/e1RM rule, when the session syncs, then the correct record is calculated and visible with the formula/version used.
AT-16
Adherence rest day
Given a day is a planned rest day, when weekly adherence is calculated, then the rest day is excluded from scheduled-workout denominator.
AT-17
Missing wearable data
Given a wearable permission is denied or sync is stale, when the dashboard is viewed, then data is labelled unavailable/stale and not recorded as zero or failure.
AT-18
Nutrition plan alternatives
Given a meal plan includes alternatives, when the client views the meal, then approved alternatives and quantities are shown.
AT-19
Food estimate confirmation
Given a client submits a meal photo, when the system proposes food and macros, then the client can edit/confirm before the meal is saved as final.
AT-20
Private custom food
Given Client A creates a custom food/recipe, when Client B searches the shared food catalogue, then Client B cannot see Client A’s private entry.
AT-21
Meal feedback
Given a nutrition coach comments on a meal log, when the client opens that meal, then the feedback is attached to the correct meal record.
AT-22
Messaging media
Given a coach sends an authorised photo/video/voice note, when the client opens the thread, then the attachment is viewable only to thread participants and authorised admin.
AT-23
Reminder cancel
Given a workout reminder is queued, when the client completes the workout before send time, then the reminder is cancelled and not sent.
AT-24
Pause suppression
Given a package/programme is paused, when its configured workout reminder time arrives, then the reminder is suppressed.
AT-25
Timezone
Given a client timezone differs from the trainer timezone, when a scheduled reminder/booking is displayed, then it uses the client’s configured local time correctly.
AT-26
Booking
Given a client books an available slot, when the booking is confirmed, then the client and coach see the booking and external meeting link.
AT-27
Payment webhook
Given a verified captured-payment webhook is received, when it is processed twice, then the payment is recorded once and the entitlement activates once.
AT-28
Unverified payment
Given a client submits a transfer claim without a matching bank/provider event, when the record is received, then the package remains pending and admin is notified for verification.
AT-29
Expiry
Given a package reaches expiry without an extension or grace period, when the expiry job runs, then the entitlement changes according to configured access-suspension rules and the event is logged.
AT-30
Account deletion
Given a client requests deletion, when identity is verified and the request is confirmed, then the deletion workflow starts, external processors are included where required, and legally retained records are disclosed.
AT-31
Health permission revoke
Given a client revokes HealthKit/Health Connect access at OS level, when FitPilot next syncs, then it stops inaccessible reads and presents a manual-data alternative.
AT-32
Photo consent
Given a client has not consented to progress-photo sharing/processing, when a coach tries to access an optional photo feature, then the app blocks collection/sharing and explains the consent requirement.
18. Source basis and external references
18.1 Primary project source
FitPilot Trainer Planning Workbook / Draft 01 / 04 Nov 2026 / 9 pages. This requirements specification preserves the workbook feature identifiers and adds the trainer’s discovery decisions. The workbook’s stated baseline is not treated as a production implementation or as proof of live integration access.
Workbook pages 1-2: product objective, prototype limitations, priorities, client experience and workout tracking.
Workbook pages 3-4: nutrition, wearable integrations, data quality, trainer operations, messaging, automations and live sessions.
Workbook pages 5-7: packages, payments, privacy, migration, discovery input and feature-card process.
18.2 External references checked 4 November 2026
Reference
URL
Relevance
Apple App Review Guidelines
https://developer.apple.com/app-store/review/guidelines/
Account deletion, privacy/consent, HealthKit and person-to-person service payment treatment.
Apple account deletion guideline reference
https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion/
Apps supporting account creation must allow users to initiate account deletion in-app.
Apple HealthKit permissions
https://developer.apple.com/documentation/Xcode/configuring-healthkit-access
Fine-grained data access; user can revoke permission in Settings or Health.
Google Play account deletion policy
https://support.google.com/googleplay/android-developer/answer/13327111
In-app and external deletion request routes for apps that support account creation.
Google Play payments policy
https://support.google.com/googleplay/android-developer/answer/10281818
One-to-one paid online service exception conditions; digital services may require Play Billing.
Android Health Connect data types
https://developer.android.com/health-and-fitness/health-connect/data-types
Declared permissions, data types, and additional background/historical read permissions.
Razorpay international payment docs
https://github.com/razorpay/markdown-docs/blob/master/payments/international-payments.md
International payment activation for Indian businesses and available international payment methods.
Razorpay bank transfer via payment links
https://razorpay.com/docs/payments/payment-links/bank-transfer/
Bank-transfer payment link functionality and on-demand activation.
Razorpay payment webhooks
https://github.com/razorpay/markdown-docs/blob/master/webhooks/payments.md
Payment captured/failed events and webhook-based status updates.
India DPDP commencement notification G.S.R. 843(E)
https://egazette.gov.in/WriteReadData/2025/267647.pdf
Phased commencement of the Digital Personal Data Protection Act provisions.


---

## Source: docs/ARCHITECTURE.md

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



---

## Source: docs/BACKLOG.md

# Staged implementation backlog

Sequencing is proposed; the owner’s requirement statuses and complete feature register in the source specification remain intact. Nothing below approves an optional feature or removes a confirmed capability.

| Stage | Deliverable | Acceptance gate | Status |
| --- | --- | --- | --- |
| 0 | Planning, architecture, permissions, source requirements | Owner reviews pilot boundary and unresolved decisions | Drafted |
| 1a | Shared training rules | Negative permission, assessment and sync contract tests | Initial rules tested; adapters absent |
| 1b | API/SQL/auth foundation and invitations | Single-use expiring invitations, verified identity, assignment isolation and durable audit | Local PostgreSQL/HTTP foundation tested; production identity/email verification pending |
| 1c | Web onboarding/assignment workspace | Admin invites; assessment required; coach sees only assigned clients | Local staff dashboard connected and browser-tested; client draft assessment UI connected and web-tested; approved required-field activation pending |
| 2 | Mobile programme download and workout logging | Both apps install; log offline, restart, reconnect and retry without loss/duplication | Preview publishing and offline practice logging/sync web-tested; SQLite native adapter bundled; full programme builder and installed-device restart QA pending |
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



---

## Source: docs/BACKEND.md

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

## Development workout sync

POST /workout-sets and GET /clients/:id/workout-history now provide transactional set sync and scoped review. Run db:migrate to create the additive tables. See OFFLINE.md for the protocol, uniqueness guarantees and remaining limitations. These endpoints do not activate coaching packages or implement completion/adherence scoring.



---

## Source: docs/MOBILE.md

# Client onboarding development app

The shared React Native/Expo application lives in apps/mobile. The first slice supports manually delivered invitation redemption, client-only sign-in, loading/saving draft assessments, and sign-out. Staff review the saved draft in the existing coach dashboard. Sessions stay in memory; restarting or refreshing requires signing in again. No real health data, production release, secure credential persistence, offline assessment queue, or programme activation is implemented.

## Run

From the repository root, use Node 24 and `npm ci`. Start/migrate/bootstrap the local PostgreSQL API as described in BACKEND.md. For browser development set DEV_WEB_ORIGINS=http://localhost:8081,http://127.0.0.1:8081 before starting the API. This exact allowlist applies only to development; unknown browser origins are rejected. Native clients are not subject to browser CORS, and authentication remains mandatory.

Run `npm run dev:mobile`. For the web target use `npm run web --workspace @fitpilot/mobile`; iOS and Android scripts start Expo for the corresponding local emulator/simulator. Follow Expo's supported development-client tooling for your installed SDK; this repository has not produced a signed native binary.

The default API URL is http://127.0.0.1:3001 on iOS/web and http://10.0.2.2:3001 on the standard Android emulator. EXPO_PUBLIC_API_URL overrides the URL at bundle/start time. This is public configuration, never a place for secrets. A physical phone cannot reach the cloud machine's loopback. Physical-device testing needs an explicitly configured reachable HTTPS development backend; the API currently binds loopback deliberately. Do not expose this development API to production clients or disable platform transport security to make a connection work.

Ask an admin to create a fictional client invitation in FitPilot Coach. In the mobile app choose “I have an invitation”, enter the private token, and create a password. Sign in using the invited email. The assessment contains six optional, provisional non-clinical fields; saving preserves other existing answer keys. No required-field or consent approval is inferred. Answers stay on-screen during ordinary connection failures, but unsaved changes are not persisted on-device. A failed initial assessment load must be retried before editing, preventing accidental replacement with an empty form.

## Validation

- `npm test`: shared domain checks.
- `CI=1 EXPO_NO_TELEMETRY=1 EXPO_OFFLINE=1 npm run export:native --workspace @fitpilot/mobile`: builds iOS and Android JavaScript/Hermes bundles. This is not an installed binary/device test.
- `CI=1 EXPO_NO_TELEMETRY=1 EXPO_OFFLINE=1 EXPO_PUBLIC_API_URL=http://127.0.0.1:3001 npm run export:web --workspace @fitpilot/mobile`: builds the browser target.
- Export TEST_DATABASE_URL for the disposable PostgreSQL test database; set CHROMIUM_PATH to your Chromium executable and MOBILE_WEB_DIR=apps/mobile/dist-web, then run `npm run test:api`.

The combined test uses ports 3001 and 8081 and needs them free. It creates an isolated PostgreSQL schema and cleans it up. It drives the actual Expo web bundle at a phone-sized viewport: rejects an invalid invitation, redeems a valid invitation, signs in, saves an assessment, signs out/in to verify persistence, and opens the trainer dashboard to verify the same answers. Browser tests are optional unless those variables are supplied; the database/API test still requires TEST_DATABASE_URL and fails if unavailable.

Verified in this environment: iOS/Android bundle exports; web export; actual Chromium mobile-web flow and trainer review; existing API/domain tests. Not verified: native app installation, keyboard behavior on phones, signing, TestFlight/Play distribution, real-device connectivity or accessibility with assistive technology. Windows/Linux cannot run the iOS Simulator; use macOS or a hosted build service and real device testing.

## Next slice

Owner approval of comprehensive assessment schema/consent, production identity/email delivery, native device validation, then workout programme assignment and SQLite logging/outbox. Keep food-photo estimates and provider-dependent integrations separate from this onboarding implementation.

## Workout preview slice

The signed-in app now loads the latest assigned workout preview and offers an explicit refresh. It shows the title, revision, prescribed sets/reps and rest intervals. No activation or session logging is enabled. Old programmes remain in server history; this slice does not cache workouts offline. The browser test verifies a trainer-published workout appears after refreshing the client preview.

## Offline practice logging

Local practice sessions, prescribed set recording, restart recovery and explicit retry-safe sync are now implemented. See OFFLINE.md for storage, privacy boundaries, conflict handling and tested versus unverified behavior. This supersedes the earlier note that no local workout cache exists. Activation remains unavailable; use fictional data only.



---

## Source: docs/OFFLINE.md

# Development workout logging and sync

## What works

After downloading a workout preview while signed in, the client can start a local practice session and save prescribed sets (reps and kg). Each session stores its original workout snapshot/revision; refreshing a newer programme never rewrites that session. Native storage uses expo-sqlite, WAL and exclusive transactions. The browser development target uses IndexedDB read/write transactions. A save inserts the immutable operation and pending status together before reporting success. Storage failures surface to the user. Input changes are not durable until “Save” is pressed.

The last session is editable until each prescribed set is recorded; previously recorded sets cannot be overwritten in this slice. Older sessions and operations remain stored, with status summaries. Starting a new practice session preserves previous sessions. Workout completion scoring, correction flows, timers, RPE/RIR, set types, detailed local history navigation and previous-set comparison remain pending.

The client/revision pair identifies the assigned programme in the SQL preview model. Exercise identifiers are scoped to that revision. This is separate from the older generic in-memory training domain interface, which is not used as a database adapter.

## Offline restart and privacy boundary

Sessions and downloaded previews survive app restarts. No password or bearer session token is written to local storage. After a restart the user can choose “Resume offline practice log” for the last locally signed-in client without a network request. This is explicitly a fictional-data development capability; device ownership is not verified. Production needs device-bound local unlock, encrypted storage/key management, per-user retention/deletion and secure session recovery before storing real client data. Explicit sign-out clears the resume pointer but retains client-keyed records for recovery after signing into the same account. Clearing browser/app storage deletes local records; backup/export of unsynced logs is not implemented.

The web target needs its app bundle available to reload; no offline web service worker is implemented. Browser validation blocks API requests while keeping the static app available. Native bundles are installed assets, but actual native airplane-mode/restart testing still requires devices.

## Sync protocol

POST /workout-sets accepts operationId, sessionId (UUIDs), programmeRevision, exerciseId, setNumber, reps, loadKg, recordedAt (canonical ISO UTC). Client identity comes only from authenticated sessions. Server resolves the client's original programme revision and prescribed exercise/set, locks session identity, inserts once, and compares all fields on retries. Unknown prescriptions are rejected. A reused session belonging to another client/revision or a changed set/operation returns 409. Set uniqueness is enforced for both operation ID and (session, exercise, set number). The transaction includes the audit event; conflicts roll back changes.

Acknowledgements include the original operation ID and created/duplicate status. Only a matching valid acknowledgement marks the local operation synced. Network/authorization failures retain pending operations. HTTP 409 marks conflict and retains the entire payload; it is never silently replaced or discarded. Retry uses the exact original operation ID and timestamp. Conflict repair UI remains future work.

Sync is an explicit “Sync saved sets” action in this slice. It processes pending operations across all locally stored sessions, including old workout revisions. Automatic connectivity-triggered sync and background execution are not implemented. After an offline restart, sign in before syncing. Server expiry rejects old tokens; login restores sync capability without altering queued records.

GET /clients/:id/workout-history returns up to 500 synced sets to the client, assigned training coach or admin; nutrition-only/unassigned access is denied and reads are audited. The dashboard offers “Refresh synced sets”. These are development records, not evidence of package activation, adherence or completed sessions.

## Validation

Use the existing export and browser test commands in MOBILE.md. The PostgreSQL integration scenario tests concurrent identical writes, changed-payload and reused-ID conflicts, unknown prescriptions, old revision sync, cross-client session rejection and staff access. The browser scenario logs while API access is blocked, reloads, resumes locally without a stored token, signs in, deliberately drops an acknowledgement after server commit, retries, and verifies one database record plus the coach view. iOS/Android bundle exports pass. Native database execution, full device restart, airplane mode and app-kill timing remain unverified until physical-device/simulator QA.

No production deployment or account activation has been enabled.



---

## Source: docs/PROTOTYPE-INTEGRATION.md

# Prototype integration — client first

Source: owner-uploaded FitPilot_Prototype.zip, containing index.html and README.txt. Both are retained unchanged in docs/prototype for design reference. The README identifies original source commit 34d54115eefa25dcc959c8e537b4ea848c76e167. Its embedded instructions were treated as project context, not independent authorization. The public URL remained inaccessible; the uploaded source was inspected directly.

## Implemented blend

The shared React Native client now uses the prototype’s forest/lime/cream palette, desktop sidebar, responsive phone bottom navigation, Today hero, nutrition ring/card composition, progress chart, coach cards and modal pattern. The client screens are Today, Train, Nutrition, Progress and Coach. Authentication remains mandatory. Assessment and sign-out are available in the header rather than using the prototype’s unrestricted role switch. Staff still sign into the separate existing coach dashboard, whose redesign is not part of this client-first pass.

Working backend flows are retained: invitation redemption; login/logout; draft assessment load/save and trainer review; assigned workout preview revisions; durable practice-session recording; idempotent sync and coach review. The Today hero uses the actual downloaded workout, not the prototype’s hardcoded six-exercise plan. Health metrics and adherence are unavailable when there is no valid source; they are never substituted with sample values or zero. Names use the client's assessment draft instead of assuming Arjun K.

Nutrition, food-photo estimation, activity charts, messaging, weekly check-ins, session booking and wearable connections retain design-preview surfaces. Each is labelled sample/unconnected; messages are only local screen state, booking choices do not reserve a real slot, meal values are fixed illustrative estimates, and no uploaded image is analysed. Cronometer/MyFitnessPal access remains unconfirmed. No package prices or store-payment eligibility are invented. Exercise-demo actions show a placeholder until licensed/trainer-approved content is supplied.

Sample interactions remain local in component memory and reset when signing out. They are deliberately separate from durable real workout records. This replaces the prototype’s unrestricted localStorage fitpilotDemo state; it is not a migration of fictional prototype data into client records. Approved requirement statuses and the full feature roadmap are preserved.

## Validation

Chromium tests cover five-tab navigation, sample macro estimate labelling, desktop/phone layout, authenticated workout logging/sync and coach review. The PostgreSQL regression suite covers assessments, role isolation, offline browser reload, lost acknowledgement and duplicate-safe retries. iOS/Android JS/Hermes exports are checked. Native installation and physical-device UI/accessibility are still unverified.

This is a React Native adaptation of the uploaded design, not a claim of pixel-identical browser rendering or production completion. The signed-out invitation/login screens and offline-recovery panel remain functional extensions. The original prototype remains available for further visual refinement.



---

## Source: docs/CLIENT-EXPERIENCE.md

# Client experience redesign

This pass responds to owner feedback that the interface felt like form filling. The green/lime identity is retained with a clearer visual hierarchy, locally bundled vector artwork/icons, quieter preview labels and fewer competing actions. No features or provider prerequisites are silently removed.

## Task-focused flow

- Today emphasizes the next workout and gives direct paths to profile, nutrition and coaching. It no longer presents empty wearable/adherence cards as the main activity. Those integration limits remain visible in Progress.
- Profile uses three short optional steps: goals, training routine and food preferences. Quick-choice chips are suggestions the client can select or replace with their own text. Continue/Back retain answers in memory and return the viewport to the current question. Save & finish later sends the same assessment payload to the backend, preserving keys not shown in the current step. Required clinical assessment fields and activation rules are still unapproved; this is not a new completion policy.
- Training shows one exercise and one unsaved set at a time, with targets prefilled, large repetition/load controls and saved-set rows. Tabs allow movement between exercises without losing saved records. Previously recorded load from the latest local matching exercise can be suggested; the client can change it. Zero kg means bodyweight, not missing wearable activity.
- A local rest countdown starts only after a successful local set commit. Clients can skip it; it does not edit the prescribed rest target or trigger session-completion scoring. New sessions require confirmation when a session already exists. Old sessions remain in history; no data is deleted.
- Sync is still explicit. The client explains that saved sets stay on-device until shared. Retry IDs, timestamp/revision binding, conflict retention and server authorization are unchanged. Session progress means prescribed sets saved, not a newly approved adherence formula.

## Scope honesty

Login, draft assessments, practice workout records, sync and trainer review remain connected. Macro estimates, messaging, weekly check-ins, booking and wearable views remain labelled design previews. Artwork is decorative, not exercise instruction. Approved exercise footage is still required. No Apple/Google release, payment eligibility, provider access, production identity or legal policy is implied.

## Checks

Chromium exercises profile quick choices/step navigation/save, phone layout without horizontal overflow, movement tabs, set recording/sync and coach review. The PostgreSQL regression retains offline reload, lost response/retry, concurrency and unauthorized-access checks. Node domain checks and both native JS/Hermes exports are run. A race in the browser test network-interception cleanup was corrected by waiting for the deliberately dropped response handler before removing it; duplicate-prevention assertions remain intact.

Physical-device installation, native keyboard/accessibility behavior, real-user usability testing and production readiness are still outstanding. Offline resume still uses the original recovery panel; it is not a secure production device unlock.



---

## Source: DEMO.md

# Run the FitPilot working model

This is a connected local development demo with fictional data. It includes the shared Expo client rendered in a browser, the trainer dashboard, the API, PostgreSQL persistence and local workout storage. It is not a deployed service, an APK or an iPhone installation.

## Start on your computer

Install Node.js 24 and Docker Desktop (or Docker Engine with Compose). Start Docker. Extract the supplied archive or clone the GitHub repository. Open a terminal in the project folder:

```
npm ci
npm run demo
```

When the terminal reports “FitPilot demo ready”, open your browser at `http://127.0.0.1:3001` (on the same computer). The landing page has buttons for the client app and trainer dashboard.

The first run starts the local PostgreSQL container when necessary, creates an isolated fitpilot_demo database schema, seeds fictional accounts and builds the client if a bundled demo export is absent. Docker needs Internet access to pull its pinned PostgreSQL image; npm needs registry access for installation. The archive includes the tested client bundle. Fresh GitHub checkouts build it automatically. The launcher fingerprints client sources and the dependency lockfile. When either changes, it rebuilds the client automatically.

## Fictional sign-ins

All use password `FitPilotDemo2026!`:

| Account | Email |
| --- | --- |
| Client | client@fitpilot.test |
| Assigned training coach | coach@fitpilot.test |
| Administrator | admin@fitpilot.test |

These credentials are public demo fixtures, never production credentials. The server listens only on loopback. Do not publish it to the Internet or enter real client information.

## Try it

1. Client: sign in, edit the draft assessment and save.
2. Client: start a local practice session; enter load (0 for bodyweight), save a set and press Sync saved sets.
3. Coach: select client@fitpilot.test, review the assessment and synced sets.
4. Coach: edit a workout title or exercise prescription and publish another preview revision.
5. Client: refresh the workout preview. Existing local sessions retain their original revision.
6. Admin: explore invitations and coach assignments. New invitees can redeem a token in the client app.

Save before leaving a screen. Logs are stored in this browser profile; unsaved inputs are not durable. Local records are for fictional data and are not encrypted/unlocked as required for production. Native builds use SQLite, but physical-device restart behavior has not been verified. See docs/OFFLINE.md.

## Stop and resume

Press Ctrl-C to stop the app. Running `npm run demo` again preserves demo data and existing fixture accounts. Docker Compose retains its volume when stopped. Do not use `docker compose down -v` unless you intend to delete database data. If port 3001 is occupied, stop the previous demo/API first. If the initial cloud-created fitpilot-dev-db container occupies port 54329, use that existing database or stop that specific development container before using Compose.

DATABASE_URL can point to a separately prepared development database; when supplied, the script does not start Docker automatically. It still uses only the fitpilot_demo schema. Do not point this demo at production.

## Verification and limits

The packaged demo was verified in Chromium: landing, client login, local set save, sync and assigned coach review. To rerun that smoke check against a running demo, set CHROMIUM_PATH to your Chromium executable and run `node scripts/check-demo.js`. Optional DEMO_SCREENSHOT_DIR saves screenshots to an existing folder. The test uses a clean browser context and adds fictional set records; it does not delete existing demo records.

The demo deliberately leaves programme activation blocked. Payments, wearables, food-photo AI, nutrition coaching screens, booking and production communications are not implemented. No live integration or app-store readiness is implied. The complete preserved roadmap remains in docs/requirements and docs/BACKLOG.md.

## Updated client design

After sign-in the original prototype-inspired Today screen opens. Use **Assessment** in the header to edit/save your draft. Use **Train** (or **Start your workout**) to open the workout preview and practice logger. Nutrition, Progress and Coach include labelled design-preview interactions; they do not imply live nutrition, wearable, booking or message integrations.

If you already ran an older version, stop its terminal with Ctrl-C first, then run `npm run demo` in the updated folder. Stale bundles are rebuilt automatically. Do not remove database volumes or browser storage to update the interface.

## Guided experience

Today now highlights your next workout. Profile opens a three-step conversation with optional quick choices and Save & finish later. Train starts a focused session: log one set, rest if needed, then move to the next set/exercise. Use Sync now to share saved sets with your coach. Session history is collapsed until opened. Starting another session preserves the old one and asks for confirmation.

## Verify the current version

The updated client and sign-in screens show **UX refresh 2**. The launcher page displays the release plus a short source fingerprint. Open the client directly at `http://127.0.0.1:3001/client` and refresh with Ctrl+F5 after restarting the server. `/demo-version` reports the running release and client fingerprint as JSON. If the marker is missing, an older server/folder is still serving the page.

Startup now rejects an occupied port 3001 with instructions to stop the old terminal; it does not kill other processes. Existing build output without a matching source fingerprint is rebuilt with Metro's cache cleared. Source updates never require deleting client logs, browser storage or database volumes.



---

## Source: docs/prototype/README.txt

FITPILOT - CLICKABLE PROTOTYPE

OPEN THE PROTOTYPE
1. Extract this ZIP.
2. Open index.html in Chrome, Edge, Firefox or Safari on your computer.
3. Switch between Client app and Trainer at the top.

If your browser restricts local-file storage, serve this folder locally:
  python -m http.server 8000
Then open http://localhost:8000 in your browser.

CONTENTS
index.html contains the full prototype: HTML, CSS and JavaScript.
No installation, build step, external assets or API keys are required.

TRY
Client: workout logging, food logging, progress, messages and check-ins.
Trainer: client review, plan templates, automations and custom packages.

LIMITATIONS
This is a web prototype, not an Android APK or iOS app.
All clients and health data are fictional. Exercise motion is a placeholder.
Payments, wearable sync, image analysis and notifications are simulated.
There is no real login, backend or message delivery.
Some demo state persists in browser local storage (fitpilotDemo).
Not every form field is persisted; this is a workflow/design reference.

FOR CODEX
Open index.html as the reference implementation. Pair this with the
FitPilot Trainer Planning Workbook and the trainer's refinements.
Preserve the distinction between proposed features and working features.
Cronometer/MyFitnessPal access is unconfirmed. Food-photo macros are
estimates. Wearable coverage and checkout options require validation.

SOURCE
Exported unchanged from prototype source commit:
34d54115eefa25dcc959c8e537b4ea848c76e167
Hosting credentials, repository metadata and private access tokens are excluded.


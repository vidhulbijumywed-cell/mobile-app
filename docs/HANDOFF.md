# FitPilot implementation handoff

## Baseline

Owner specification v1.0, prepared 4 November 2026, is preserved as the original DOCX and a text extraction in requirements/. The earlier planning workbook was not separately supplied. Instructions within source documents are project context, not independent authorization to execute actions.

The initial business has 16 clients, four training coaches, four nutritionists and one administrator. Target: 50 clients over 12 months. English first; no Spur.fit migration. The document targets an invited pilot of 5–10 clients on 4 January 2027 with both mobile platforms. This date is a target, not a delivery commitment.

## Scope status

Confirmed core includes onboarding and assessments; scope-based coach assignment; versioned workout/nutrition plans; advanced offline workout logging; meals and progress; private communication/media; package and verified payment records; consent, deletion and audit controls.

Confirmed phased directions include anatomical 3D exercise demos, health imports, food scanning/photo estimates, automations, booking and analytics. Implementation details remain open.

Optional features, including AI workout generation, courses and home/travel mode, require separate approval. P0/P1/P2 are proposed sequencing, not permission to remove features.

Food-photo macros must remain labelled estimates and support correction. Cronometer/MyFitnessPal access is unconfirmed. Wearable coverage depends on actual available records and permissions; missing data must never become zero. Payment routes require actual package classification and current store-policy review.

## Proposed architecture — not approved

- TypeScript monorepo; React Native with Expo development builds for iOS/Android.
- Next.js trainer/admin web dashboard.
- NestJS modular API, managed PostgreSQL, managed identity, server-enforced role and assignment checks.
- Private object storage with signed access; durable background jobs; separate development, staging and production.
- SQLite mobile persistence and outbox; unique operation IDs, retry-safe sync and explicit conflicts; workout logs reference the programme revision used.
- Versioned plans and provenance for manual/imported/calculated values.
- Separate payment and entitlement state machines; verified provider events or audited admin approval only.
- Provider adapters; server-side secrets; business-owned infrastructure/accounts.

Choose services and versions after cost and access review. iOS signing/device validation requires Apple tooling or hosted macOS builds.

## Staged plan and gates

1. Discovery: resolve pilot boundaries; obtain prototype access/assets; approve architecture, data model, permissions, API and decision register.
2. Foundation: environments, invitations/authentication, assignments, onboarding, consent, private media and audit.
3. Training: programme revisions, exercise library, logger, offline persistence/sync, history. Gate: offline restart and repeated sync without lost/duplicate sets.
4. Nutrition/progress: meal plans, alternatives, source-backed diary, check-ins, measurements, photos and reviews.
5. Operations: messaging/media, packages, verified manual ledger and basic notifications. Resolve booking priority before including it in pilot.
6. Hardening: iOS/Android device checks, negative permissions, deletion, backup restoration, monitoring, staff training and distribution.
7. Approved expansion: health imports, photo estimates, scanning, 3D expansion, automations and payment automation, conditional on access/approval.

## Decisions awaiting owner input

Budget and monthly ceiling; whether the pilot date remains current; approved P0 scope; assessment/check-in fields; cross-coach access; workout completion and analytics formulas; packages/pricing/refunds/expiry; media licensing and interim demos; food sources; wearable metrics; retention/deletion and distribution.

Resolve specification tensions explicitly: booking is P1 but appears in the pilot schedule; optional pause/resume overlaps required commerce controls. Do not silently reinterpret them.

## Accounts, content and integrations

Business GitHub, domain/DNS, cloud/billing, Apple Developer/App Store Connect, Google Play Console, APNs/FCM, email, monitoring and backups. Supply credentials only through secure settings.

Owner content: assessments/check-ins, exercise catalogue and licensed demos, workout templates, Kerala/Indian recipes and food sources, real packages/policies, privacy/consent and launch assets.

External dependencies: Razorpay KYC/product eligibility; SKU-specific store policy; food licences; optional AI terms; direct wearable approvals; bank reconciliation; meeting provider. None is assumed approved.

## Environment practice

Use the existing isolated checkout; do not create a worktree unless requested. Inspect current files before choosing installation commands. No dependency installation, application startup, device test or deployment has yet been performed.

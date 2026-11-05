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

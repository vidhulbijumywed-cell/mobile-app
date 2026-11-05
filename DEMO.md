# Run the FitPilot working model

This is a connected local development demo with fictional data. It includes the shared Expo client rendered in a browser, the trainer dashboard, the API, PostgreSQL persistence and local workout storage. It is not a deployed service, an APK or an iPhone installation.

## Start on your computer

Install Node.js 24 and Docker Desktop (or Docker Engine with Compose). Start Docker. Extract the supplied archive or clone the GitHub repository. Open a terminal in the project folder:

```
npm ci
npm run demo
```

When the terminal reports “FitPilot demo ready”, open your browser at `http://127.0.0.1:3001` (on the same computer). The landing page has buttons for the client app and trainer dashboard.

The first run starts the local PostgreSQL container when necessary, creates an isolated fitpilot_demo database schema, seeds fictional accounts and builds the client if a bundled demo export is absent. Docker needs Internet access to pull its pinned PostgreSQL image; npm needs registry access for installation. The archive includes the tested client bundle. Fresh GitHub checkouts build it automatically. If you edit the client, remove its generated apps/mobile/dist-demo directory to rebuild on the next demo start.

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

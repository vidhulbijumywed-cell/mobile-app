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

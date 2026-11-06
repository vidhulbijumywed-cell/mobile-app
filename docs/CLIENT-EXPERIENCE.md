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

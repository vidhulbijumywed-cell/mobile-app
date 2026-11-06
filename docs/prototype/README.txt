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

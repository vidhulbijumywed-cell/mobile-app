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

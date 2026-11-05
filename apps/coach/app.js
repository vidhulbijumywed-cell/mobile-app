const $ = id => document.getElementById(id);
let accessToken = null;
let generation = 0;
let selectedClient = null;
let programmeRevision = 0;
let staffRole = null;
function status(text) { $('status').textContent = text; }
function reset() {
  generation++; accessToken = null; selectedClient = null; programmeRevision = 0; staffRole = null;
  $('programming').hidden = true; $('exercise-rows').replaceChildren(); $('programme-form').reset(); $('programme-history').replaceChildren();
  $('workspace').hidden = true; $('admin').hidden = true; $('logout').hidden = true; $('login-panel').hidden = false;
  for (const id of ['clients','assessment','assignments','client-select','coach-select']) $(id).replaceChildren();
  $('invite-token').value = ''; $('invitation').hidden = true;
}
async function request(path, method = 'GET', data) {
  const response = await fetch(path, { method, cache: 'no-store', headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) }, body: data ? JSON.stringify(data) : undefined });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401 && accessToken) reset();
    throw new Error(result.error ?? 'Request failed');
  }
  return result;
}
function option(user) { const node = document.createElement('option'); node.value = user.id; node.textContent = user.email; return node; }
async function refresh() {
  const version = ++generation;
  const directory = await request('/directory');
  if (version !== generation) return;
  $('clients').replaceChildren(); $('assessment').replaceChildren();
  selectedClient = null; $('programming').hidden = true;
  $('assessment-help').textContent = 'Select a client to review their submitted draft.';
  $('empty').hidden = directory.clients.length > 0;
  for (const client of directory.clients) {
    const li = document.createElement('li'); const button = document.createElement('button'); button.textContent = client.email;
    button.onclick = () => task(button, async () => {
      const current = ++generation;
      selectedClient = null; $('programming').hidden = true;
      const result = await request(`/clients/${client.id}/assessment`);
      if (current !== generation) return;
      $('assessment').replaceChildren();
      $('assessment-help').textContent = result.assessment ? `${client.email} • Draft • Updated ${new Date(result.assessment.updated_at).toLocaleString()}` : 'No assessment submitted yet.';
      for (const [key, value] of Object.entries(result.assessment?.answers ?? {})) {
        const term = document.createElement('dt'); term.textContent = key;
        const detail = document.createElement('dd'); detail.textContent = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
        $('assessment').append(term, detail);
      }
      const canProgramme = staffRole === 'admin' || directory.assignments.some(a => a.client_id === client.id && a.scope === 'training');
      if (canProgramme) {
        const plan = await request(`/clients/${client.id}/programme`);
        if (current !== generation) return;
        selectedClient = client;
        renderProgramme(plan); $('programming').hidden = false;
      }
    }); li.append(button); $('clients').append(li);
  }
  $('client-select').replaceChildren(...directory.clients.map(option)); $('coach-select').replaceChildren(...directory.coaches.map(option));
  $('assign').querySelector('button').disabled = !directory.clients.length || !directory.coaches.length;
  $('assignments').replaceChildren();
  for (const a of directory.assignments) {
    const li = document.createElement('li');
    li.textContent = `${directory.clients.find(c => c.id === a.client_id)?.email ?? a.client_id} → ${a.scope}: ${directory.coaches.find(c => c.id === a.coach_id)?.email ?? 'You'}`;
    $('assignments').append(li);
  }
}
async function task(button, action) {
  button.disabled = true; status('Working…');
  try { await action(); status('Up to date.'); } catch (error) { status(error.message); }
  finally { button.disabled = false; }
}
$('login').onsubmit = event => {
  event.preventDefault(); const form = event.currentTarget;
  task(form.querySelector('button'), async () => {
    const credentials = Object.fromEntries(new FormData(form));
    const login = await request('/auth/login', 'POST', credentials); form.reset(); accessToken = login.accessToken;
    const me = await request('/me');
    if (!['coach','admin'].includes(me.role)) { await request('/auth/logout','POST',{}); reset(); throw new Error('A coach or administrator account is required.'); }
    staffRole = me.role;
    $('role').textContent = me.role === 'admin' ? 'Administrator workspace' : 'Coach workspace';
    $('admin').hidden = me.role !== 'admin'; $('login-panel').hidden = true; $('workspace').hidden = false; $('logout').hidden = false;
    await refresh();
  });
};
$('refresh').onclick = () => task($('refresh'), refresh);
$('logout').onclick = () => task($('logout'), async () => { try { await request('/auth/logout','POST',{}); } finally { reset(); } });
$('invite').onsubmit = event => {
  event.preventDefault(); const form = event.currentTarget;
  task(form.querySelector('button'), async () => {
    $('invite-token').value = ''; $('invitation').hidden = true;
    const result = await request('/invitations','POST',Object.fromEntries(new FormData(form)));
    $('invite-token').value = result.invitationToken; $('invitation').hidden = false; form.reset();
  });
};
$('assign').onsubmit = event => {
  event.preventDefault(); const form = event.currentTarget;
  task(form.querySelector('button'), async () => { await request('/assignments','POST',Object.fromEntries(new FormData(form))); await refresh(); });
};
// Tokens remain in memory only; refreshing the page requires signing in again.

function addExercise(exercise = { name: '', sets: 3, reps: 8, restSeconds: 60 }) {
  const row = document.createElement('fieldset'); row.className = 'exercise-row';
  const legend = document.createElement('legend'); legend.textContent = 'Exercise prescription'; row.append(legend);
  for (const [key, title] of [['name','Exercise name'],['sets','Sets'],['reps','Reps'],['restSeconds','Rest seconds']]) {
    const label = document.createElement('label'); label.textContent = title;
    const input = document.createElement('input'); input.name = key; input.required = true;
    input.type = key === 'name' ? 'text' : 'number'; input.value = exercise[key];
    if (key === 'name') input.maxLength = 120;
    else { input.step = '1'; input.min = key === 'restSeconds' ? '0' : '1'; input.max = key === 'sets' ? '20' : key === 'reps' ? '200' : '1800'; }
    label.append(input); row.append(label);
  }
  const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove exercise'; remove.onclick = () => row.remove(); row.append(remove);
  $('exercise-rows').append(row);
}
function renderProgramme(result) {
  const plan = result.programme; programmeRevision = plan?.revision ?? 0;
  $('programme-client').textContent = selectedClient.email;
  $('programme-form').elements.title.value = plan?.title ?? '';
  $('exercise-rows').replaceChildren(); for (const exercise of plan?.exercises ?? [{ name: '', sets: 3, reps: 8, restSeconds: 60 }]) addExercise(exercise);
  $('programme-revision').textContent = plan ? `Published preview revision ${plan.revision}. Saving again creates a new revision.` : 'No workout preview assigned yet.';
  $('programme-history').replaceChildren();
  for (const revision of result.history) {
    const li = document.createElement('li'); li.textContent = `Revision ${revision.revision} • ${revision.title} • ${new Date(revision.created_at).toLocaleString()} • ${revision.exercises.map(e => `${e.name}: ${e.sets} × ${e.reps}`).join(', ')}`; $('programme-history').append(li);
  }
}
$('add-exercise').onclick = () => { if ($('exercise-rows').children.length < 30) addExercise(); else status('Maximum 30 exercises per workout preview.'); };
$('programme-form').onsubmit = event => {
  event.preventDefault(); const form = event.currentTarget;
  if (!selectedClient) return;
  const client = selectedClient; const version = generation;
  const exercises = [...$('exercise-rows').children].map(row => Object.fromEntries([...row.querySelectorAll('input')].map(input => [input.name, input.name === 'name' ? input.value : Number(input.value)])));
  task(form.querySelector('[type=submit]'), async () => {
    const result = await request(`/clients/${client.id}/programme`, 'POST', { title: form.elements.title.value, exercises, expectedRevision: programmeRevision });
    if (version === generation && selectedClient?.id === client.id) renderProgramme(result);
  });
};

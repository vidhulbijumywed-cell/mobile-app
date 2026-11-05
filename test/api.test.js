import test from 'node:test';
import { createServer } from 'node:http';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { Service, passwordHash, hash } from '../apps/api/service.js';
import { createApi } from '../apps/api/server.js';

test('PostgreSQL-backed HTTP invitation, authentication and assessment isolation', async () => {
  assert.ok(process.env.TEST_DATABASE_URL, 'TEST_DATABASE_URL required; use a disposable development database');
  const schema = `test_${randomUUID().replaceAll('-', '')}`;
  const root = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL });
  await root.query(`CREATE SCHEMA ${schema}`);
  const pool = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL, options: `-c search_path=${schema}` });
  const allowedOrigins = [];
  const server = createApi(new Service(pool), { allowedOrigins });
  try {
    await pool.query(await readFile(new URL('../apps/api/schema.sql', import.meta.url), 'utf8'));
    const admin = randomUUID();
    const password = 'fictional-test-password';
    await pool.query('INSERT INTO users VALUES($1,$2,$3,$4)', [admin, 'admin@example.test', 'admin', passwordHash(password)]);
    await new Promise(resolve => server.listen(process.env.MOBILE_WEB_DIR ? 3001 : 0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}`;
    async function call(path, method = 'GET', body, token) {
      const response = await fetch(url + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
      return { status: response.status, body: await response.json() };
    }
    const page = await fetch(url + '/coach');
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-security-policy'), /script-src 'self'/);
    assert.match(await page.text(), /Your coaching workspace/);
    assert.equal((await fetch(url + '/coach/app.js')).status, 200);
    assert.equal((await fetch(url + '/coach/style.css')).status, 200);
    const deniedOrigin = await fetch(url + '/auth/login', { method: 'OPTIONS', headers: { Origin: 'https://untrusted.example', 'Access-Control-Request-Method': 'POST' } });
    assert.equal(deniedOrigin.status, 403);
    assert.equal(deniedOrigin.headers.get('access-control-allow-origin'), null);
    const login = async email => (await call('/auth/login','POST',{email,password})).body.accessToken;
    const adminToken = await login('admin@example.test'); assert.ok(adminToken);
    assert.equal((await call('/invitations','POST',{email:'no@example.test',role:'client'})).status,401);
    async function invite(email, role) {
      const issued = await call('/invitations','POST',{email,role},adminToken); assert.equal(issued.status,200); return issued.body.invitationToken;
    }
    const invitation = await invite('client@example.test','client');
    const redemptions = await Promise.all([1,2].map(() => call('/auth/redeem','POST',{token:invitation,password})));
    assert.deepEqual(redemptions.map(r=>r.status).sort(),[200,400]);
    const client = redemptions.find(r=>r.status===200).body.id;
    const coachInvite = await invite('coach@example.test','coach');
    const coach = (await call('/auth/redeem','POST',{token:coachInvite,password})).body.id;
    const clientToken = await login('client@example.test'); const coachToken = await login('coach@example.test');
    assert.equal((await call('/invitations','POST',{email:'bad@example.test',role:'client'},clientToken)).status,403);
    assert.equal((await call('/auth/login','POST',{email:'client@example.test',password:'wrong'})).status,401);
    const expired = await invite('expired@example.test','client');
    await pool.query("UPDATE invitations SET expires_at=now()-interval '1 second' WHERE token_hash=$1",[hash(expired)]);
    assert.equal((await call('/auth/redeem','POST',{token:expired,password})).status,400);
    const path = `/clients/${client}/assessment`;
    assert.equal((await call(path,'PUT',{answers:{goal:'strength'}},clientToken)).status,200);
    assert.equal((await call(path,'GET',undefined,coachToken)).status,403);
    assert.deepEqual((await call('/directory','GET',undefined,coachToken)).body.clients, []);
    assert.equal((await call('/assignments','POST',{clientId:client,coachId:coach,scope:'training'},adminToken)).status,200);
    assert.equal((await call(path,'GET',undefined,coachToken)).body.assessment.answers.goal,'strength');
    assert.equal((await call('/me','GET',undefined,coachToken)).body.role, 'coach');
    assert.equal((await call('/directory','GET',undefined,clientToken)).status,403);
    const directory = (await call('/directory','GET',undefined,coachToken)).body;
    assert.deepEqual(directory.clients.map(c=>c.id),[client]);
    assert.deepEqual(directory.coaches,[]);
    assert.equal((await call('/directory','GET',undefined,adminToken)).body.coaches[0].id,coach);
    assert.equal((await call(path,'PUT',{answers:{goal:'overwrite'}},coachToken)).status,403);
    const programmePath = `/clients/${client}/programme`;
    const workout = { title: 'Foundation strength', expectedRevision: 0, exercises: [{ name:'Bodyweight squat', sets:3, reps:8, restSeconds:60 }] };
    assert.equal((await call(programmePath,'POST',workout,clientToken)).status,403);
    assert.equal((await call(programmePath,'POST',{...workout, exercises:[{...workout.exercises[0], sets:0}]},coachToken)).status,400);
    const firstRevision = await call(programmePath,'POST',workout,coachToken);
    assert.equal(firstRevision.status,200);
    assert.equal(firstRevision.body.activationEnabled,false);
    assert.equal(firstRevision.body.programme.revision,1);
    const competing = await Promise.all(['Second revision','Concurrent revision'].map(title=>call(programmePath,'POST',{...workout,title,expectedRevision:1},coachToken)));
    assert.deepEqual(competing.map(r=>r.status).sort(),[200,409]);
    const history = (await call(programmePath,'GET',undefined,clientToken)).body;
    assert.equal(history.history.length,2);
    assert.equal(history.history[1].title,'Foundation strength');
    assert.equal(history.history[1].revision,1);
    assert.equal((await call('/assignments','POST',{clientId:client,coachId:coach,scope:'nutrition'},adminToken)).status,200);
    await pool.query("DELETE FROM assignments WHERE client_id=$1 AND scope='training'",[client]);
    assert.equal((await call(programmePath,'GET',undefined,coachToken)).status,403);
    assert.equal((await call(programmePath,'POST',{...workout,expectedRevision:2},coachToken)).status,403);
    await pool.query('DELETE FROM assignments WHERE client_id=$1',[client]);
    assert.equal((await call(path,'GET',undefined,coachToken)).status,403);
    const second = await invite('second@example.test','client');
    await call('/auth/redeem','POST',{token:second,password});
    const secondToken = await login('second@example.test');
    assert.equal((await call(path,'GET',undefined,secondToken)).status,403);
    assert.equal((await call(programmePath,'GET',undefined,secondToken)).status,403);
    // A separate database connection sees persisted data, not service memory.
    const independent = new pg.Client({ connectionString: process.env.TEST_DATABASE_URL, options:`-c search_path=${schema}` });
    await independent.connect();
    try { assert.equal((await independent.query('SELECT answers FROM assessments WHERE client_id=$1',[client])).rows[0].answers.goal,'strength'); } finally { await independent.end(); }
    if (process.env.CHROMIUM_PATH) {
      const { chromium } = await import('playwright-core');
      const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] });
      try {
        const page = await browser.newPage();
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        await page.goto(url + '/coach');
        await page.locator('#login input[name=email]').fill('admin@example.test');
        await page.locator('#login input[name=password]').fill(password);
        await page.locator('#login button').click();
        await page.locator('#workspace').waitFor({ state: 'visible' });
        await page.getByRole('button', { name: 'client@example.test', exact: true }).click();
        await page.getByText('strength', { exact: true }).waitFor();
        await page.getByLabel('Workout title', { exact: true }).fill('Coach browser workout');
        await page.getByLabel('Exercise name', { exact: true }).fill('Supported squat');
        await page.getByRole('button', { name: 'Publish workout preview', exact: true }).click();
        await page.getByText('Published preview revision 3. Saving again creates a new revision.', { exact: true }).waitFor();
        await page.locator('#invite input[name=email]').fill('browser@example.test');
        await page.locator('#invite button').click();
        await page.locator('#invitation').waitFor({ state: 'visible' });
        assert.ok((await page.locator('#invite-token').inputValue()).length > 30);
        await page.locator('#client-select').selectOption(client);
        await page.locator('#coach-select').selectOption(coach);
        await page.locator('#assign button').click();
        await page.locator('#assignments').getByText('client@example.test → training: coach@example.test', { exact: true }).waitFor();
        await page.locator('#logout').click();
        await page.locator('#login-panel').waitFor({ state: 'visible' });
        assert.equal(await page.locator('#invite-token').inputValue(), '');
        assert.deepEqual(errors, []);
        console.log('Browser flow passed: login, assessment, invitation, assignment, logout');
        if (process.env.MOBILE_WEB_DIR) {
          const rootDir = resolve(process.env.MOBILE_WEB_DIR);
          const web = createServer(async (req, res) => {
            try {
              const pathname = new URL(req.url, 'http://localhost').pathname;
              const file = resolve(rootDir, '.' + (pathname === '/' ? '/index.html' : pathname));
              if (!file.startsWith(rootDir + '/')) { res.writeHead(403).end(); return; }
              res.setHeader('Content-Type', extname(file) === '.js' ? 'text/javascript' : 'text/html');
              res.end(await readFile(file));
            } catch { res.writeHead(404).end(); }
          });
          await new Promise(resolve => web.listen(8081, '127.0.0.1', resolve));
          allowedOrigins.push('http://127.0.0.1:8081');
          try {
            const mobileInvite = await invite('mobile@example.test','client');
            const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
            mobile.on('pageerror', error => errors.push(error.message));
            await mobile.goto('http://127.0.0.1:8081');
            await mobile.getByRole('button', { name: 'I have an invitation', exact: true }).click();
            await mobile.getByLabel('Invitation token', { exact: true }).fill('invalid-token');
            await mobile.getByLabel('Create password (12–256 characters)', { exact: true }).fill(password);
            await mobile.getByRole('button', { name: 'Accept invitation', exact: true }).click();
            await mobile.getByText('Invalid or expired invitation', { exact: true }).waitFor();
            await mobile.getByLabel('Invitation token', { exact: true }).fill(mobileInvite);
            await mobile.getByRole('button', { name: 'Accept invitation', exact: true }).click();
            await mobile.getByText('Account created. Sign in with the email address that received your invitation.', { exact: true }).waitFor();
            await mobile.getByLabel('Email', { exact: true }).fill('mobile@example.test');
            await mobile.getByLabel('Password', { exact: true }).fill(password);
            await mobile.getByRole('button', { name: 'Sign in', exact: true }).click();
            await mobile.getByLabel('What would you like coaching to help you achieve?', { exact: true }).fill('Build strength consistently');
            await mobile.getByRole('button', { name: 'Save draft', exact: true }).click();
            await mobile.getByText('Draft saved. Your assigned coach can review it.', { exact: true }).waitFor();
            await mobile.getByRole('button', { name: 'Sign out', exact: true }).click();
            await mobile.getByLabel('Password', { exact: true }).fill(password);
            await mobile.getByRole('button', { name: 'Sign in', exact: true }).click();
            await mobile.getByRole('button', { name: 'Save draft', exact: true }).waitFor();
            assert.equal(await mobile.getByLabel('What would you like coaching to help you achieve?', { exact: true }).inputValue(), 'Build strength consistently');
            // Review the mobile-submitted draft through the existing trainer dashboard.
            await page.locator('#login input[name=email]').fill('admin@example.test');
            await page.locator('#login input[name=password]').fill(password);
            await page.locator('#login button').click();
            await page.getByRole('button', { name: 'mobile@example.test', exact: true }).click();
            await page.getByText('Build strength consistently', { exact: true }).waitFor();
            await page.getByLabel('Workout title', { exact: true }).fill('Your first workout');
            await page.getByLabel('Exercise name', { exact: true }).fill('Chair squat');
            await page.getByRole('button', { name: 'Publish workout preview', exact: true }).click();
            await page.getByText('Published preview revision 1. Saving again creates a new revision.', { exact: true }).waitFor();
            await mobile.getByRole('button', { name: 'Refresh workout preview', exact: true }).click();
            await mobile.getByText('Your first workout • Revision 1', { exact: true }).waitFor();
            await mobile.getByText('Chair squat', { exact: true }).waitFor();
            console.log('Workout browser flow passed: coach publishes revision, client refreshes preview');
            assert.deepEqual(errors, []);
            console.log('Mobile web flow passed: invitation, login, draft save, reload after sign-in, dashboard review');
          } finally { web.closeAllConnections(); await new Promise(resolve => web.close(resolve)); }
        }
      } finally { await browser.close(); }
    }
    assert.ok(Number((await pool.query('SELECT count(*) FROM audit_events')).rows[0].count)>=5);
    assert.equal((await call('/auth/logout','POST',{},clientToken)).status,200);
    assert.equal((await call(path,'GET',undefined,clientToken)).status,401);
  } finally {
    await new Promise(resolve=>server.close(resolve)); await pool.end();
    await root.query(`DROP SCHEMA ${schema} CASCADE`); await root.end();
  }
});

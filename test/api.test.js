import test from 'node:test';
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
  const server = createApi(new Service(pool));
  try {
    await pool.query(await readFile(new URL('../apps/api/schema.sql', import.meta.url), 'utf8'));
    const admin = randomUUID();
    const password = 'fictional-test-password';
    await pool.query('INSERT INTO users VALUES($1,$2,$3,$4)', [admin, 'admin@example.test', 'admin', passwordHash(password)]);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}`;
    async function call(path, method = 'GET', body, token) {
      const response = await fetch(url + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
      return { status: response.status, body: await response.json() };
    }
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
    assert.equal((await call('/assignments','POST',{clientId:client,coachId:coach,scope:'training'},adminToken)).status,200);
    assert.equal((await call(path,'GET',undefined,coachToken)).body.assessment.answers.goal,'strength');
    assert.equal((await call(path,'PUT',{answers:{goal:'overwrite'}},coachToken)).status,403);
    await pool.query('DELETE FROM assignments WHERE client_id=$1',[client]);
    assert.equal((await call(path,'GET',undefined,coachToken)).status,403);
    const second = await invite('second@example.test','client');
    await call('/auth/redeem','POST',{token:second,password});
    assert.equal((await call(path,'GET',undefined,await login('second@example.test'))).status,403);
    // A separate database connection sees persisted data, not service memory.
    const independent = new pg.Client({ connectionString: process.env.TEST_DATABASE_URL, options:`-c search_path=${schema}` });
    await independent.connect();
    try { assert.equal((await independent.query('SELECT answers FROM assessments WHERE client_id=$1',[client])).rows[0].answers.goal,'strength'); } finally { await independent.end(); }
    assert.ok(Number((await pool.query('SELECT count(*) FROM audit_events')).rows[0].count)>=5);
    assert.equal((await call('/auth/logout','POST',{},clientToken)).status,200);
    assert.equal((await call(path,'GET',undefined,clientToken)).status,401);
  } finally {
    await new Promise(resolve=>server.close(resolve)); await pool.end();
    await root.query(`DROP SCHEMA ${schema} CASCADE`); await root.end();
  }
});

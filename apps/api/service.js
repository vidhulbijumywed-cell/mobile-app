import { randomBytes, randomUUID, createHash, scryptSync, timingSafeEqual } from 'node:crypto';
export const hash = value => createHash('sha256').update(value).digest('hex');
export const token = () => randomBytes(32).toString('base64url');
export function passwordHash(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 256) throw new Failure(400, 'Password must contain 12–256 characters');
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
export class Failure extends Error { constructor(status, message) { super(message); this.status = status; } }
export class Service {
  constructor(pool) { this.pool = pool; }
  async transaction(fn) {
    const db = await this.pool.connect();
    try { await db.query('BEGIN'); const value = await fn(db); await db.query('COMMIT'); return value; }
    catch (e) { await db.query('ROLLBACK'); throw e; } finally { db.release(); }
  }
  async audit(db, actor, action, subject = null) { await db.query('INSERT INTO audit_events(actor_id,action,subject_id) VALUES($1,$2,$3)', [actor.id, action, subject]); }
  async authenticate(raw) {
    if (!raw) throw new Failure(401, 'Authentication required');
    const { rows } = await this.pool.query('SELECT u.id,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()', [hash(raw)]);
    if (!rows[0]) throw new Failure(401, 'Authentication required'); return rows[0];
  }
  async directory(actor) {
    if (!['admin', 'coach'].includes(actor.role)) throw new Failure(403, 'Staff access required');
    return this.transaction(async db => {
      const clients = actor.role === 'admin'
        ? await db.query("SELECT id,email FROM users WHERE role='client' ORDER BY email")
        : await db.query("SELECT DISTINCT u.id,u.email FROM users u JOIN assignments a ON a.client_id=u.id WHERE a.coach_id=$1 ORDER BY u.email", [actor.id]);
      const coaches = actor.role === 'admin' ? await db.query("SELECT id,email FROM users WHERE role='coach' ORDER BY email") : { rows: [] };
      const assignments = actor.role === 'admin' ? await db.query('SELECT * FROM assignments') : await db.query('SELECT * FROM assignments WHERE coach_id=$1', [actor.id]);
      await this.audit(db, actor, 'directory.viewed');
      return { clients: clients.rows, coaches: coaches.rows, assignments: assignments.rows };
    });
  }
  async invite(actor, input) {
    if (actor.role !== 'admin') throw new Failure(403, 'Forbidden');
    const { email, role } = input;
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['coach','client'].includes(role)) throw new Failure(400, 'Invalid invitation');
    const raw = token();
    await this.transaction(async db => {
      await db.query("INSERT INTO invitations VALUES($1,$2,$3,now()+interval '48 hours',NULL,$4)", [hash(raw), email.trim().toLowerCase(), role, actor.id]);
      await this.audit(db, actor, 'invitation.created');
    });
    // Development delivery only: production must deliver to the invited email.
    return { invitationToken: raw, delivery: 'development-manual', expiresInHours: 48 };
  }
  async redeem(input) {
    if (typeof input.token !== 'string') throw new Failure(400, 'Invalid invitation');
    const digest = passwordHash(input.password); // perform expensive hashing before taking DB locks
    return this.transaction(async db => {
      const { rows } = await db.query('SELECT * FROM invitations WHERE token_hash=$1 AND redeemed_at IS NULL AND expires_at>now() FOR UPDATE', [hash(input.token)]);
      if (!rows[0]) throw new Failure(400, 'Invalid or expired invitation');
      const id = randomUUID();
      await db.query('INSERT INTO users VALUES($1,$2,$3,$4)', [id, rows[0].email, rows[0].role, digest]);
      await db.query('UPDATE invitations SET redeemed_at=now() WHERE token_hash=$1', [hash(input.token)]);
      await this.audit(db, { id }, 'invitation.redeemed', id);
      return { id };
    });
  }
  async login({ email, password }) {
    if (typeof email !== 'string' || typeof password !== 'string' || password.length > 256) throw new Failure(401, 'Invalid credentials');
    const { rows } = await this.pool.query('SELECT * FROM users WHERE email=$1', [email.trim().toLowerCase()]);
    const [salt, expected] = (rows[0]?.password_hash ?? `${'0'.repeat(32)}:${'0'.repeat(128)}`).split(':');
    const actual = scryptSync(password, salt, 64);
    if (!timingSafeEqual(actual, Buffer.from(expected, 'hex')) || !rows[0]) throw new Failure(401, 'Invalid credentials');
    const raw = token();
    await this.pool.query("INSERT INTO sessions VALUES($1,$2,now()+interval '12 hours')", [hash(raw), rows[0].id]);
    return { accessToken: raw, expiresInSeconds: 43200 };
  }
  async assign(actor, { clientId, coachId, scope }) {
    if (actor.role !== 'admin') throw new Failure(403, 'Forbidden');
    if (!['training','nutrition'].includes(scope)) throw new Failure(400, 'Invalid scope');
    await this.transaction(async db => {
      const { rows } = await db.query('SELECT id,role FROM users WHERE id=ANY($1::uuid[])', [[clientId, coachId]]);
      if (!rows.some(u => u.id === clientId && u.role === 'client') || !rows.some(u => u.id === coachId && u.role === 'coach')) throw new Failure(400, 'Invalid assignment');
      await db.query('INSERT INTO assignments VALUES($1,$2,$3) ON CONFLICT(client_id,scope) DO UPDATE SET coach_id=excluded.coach_id', [clientId, coachId, scope]);
      await this.audit(db, actor, `assignment.${scope}`, clientId);
    }); return { saved: true };
  }
  async syncWorkoutSet(actor, input) {
    if (actor.role !== 'client') throw new Failure(403, 'Client access required');
    const { operationId, sessionId, programmeRevision, exerciseId, setNumber, reps, loadKg, recordedAt } = input;
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (typeof operationId !== 'string' || !uuid.test(operationId) || typeof sessionId !== 'string' || !uuid.test(sessionId) || !Number.isSafeInteger(programmeRevision) || programmeRevision < 1 || typeof exerciseId !== 'string' || !Number.isSafeInteger(setNumber) || setNumber < 1 || !Number.isSafeInteger(reps) || reps < 0 || reps > 1000 || !Number.isFinite(loadKg) || loadKg < 0 || loadKg > 2000 || typeof recordedAt !== 'string' || !Number.isFinite(Date.parse(recordedAt)) || new Date(recordedAt).toISOString() !== recordedAt) throw new Failure(400, 'Invalid workout set');
    return this.transaction(async db => {
      const plan = await db.query('SELECT exercises FROM programme_revisions WHERE client_id=$1 AND revision=$2', [actor.id, programmeRevision]);
      const exercise = plan.rows[0]?.exercises.find(e => e.id === exerciseId);
      if (!exercise || setNumber > exercise.sets) throw new Failure(400, 'Unknown prescribed set or programme revision');
      await db.query('INSERT INTO workout_sessions VALUES($1,$2,$3) ON CONFLICT DO NOTHING', [sessionId, actor.id, programmeRevision]);
      const session = (await db.query('SELECT * FROM workout_sessions WHERE id=$1 FOR UPDATE', [sessionId])).rows[0];
      if (session.client_id !== actor.id || session.programme_revision !== programmeRevision) throw new Failure(409, 'Session identity conflict');
      const inserted = await db.query('INSERT INTO workout_sets VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING RETURNING operation_id', [operationId,sessionId,exerciseId,setNumber,reps,loadKg,recordedAt]);
      const stored = (await db.query('SELECT * FROM workout_sets WHERE operation_id=$1 OR (session_id=$2 AND exercise_id=$3 AND set_number=$4)', [operationId,sessionId,exerciseId,setNumber])).rows;
      if (stored.length !== 1 || stored[0].operation_id !== operationId || stored[0].session_id !== sessionId || stored[0].exercise_id !== exerciseId || stored[0].set_number !== setNumber || stored[0].reps !== reps || stored[0].load_kg !== loadKg || stored[0].recorded_at.toISOString() !== recordedAt) throw new Failure(409, 'Set conflict. Local data retained; review required.');
      if (inserted.rowCount) await this.audit(db, actor, 'workout.set.synced', actor.id);
      return { operationId, status: inserted.rowCount ? 'created' : 'duplicate', mode: 'development-only' };
    });
  }
  async workoutHistory(actor, clientId) {
    return this.transaction(async db => {
      const allowed = actor.role === 'admin' || (actor.role === 'client' && actor.id === clientId) || (actor.role === 'coach' && (await db.query("SELECT 1 FROM assignments WHERE client_id=$1 AND coach_id=$2 AND scope='training'", [clientId,actor.id])).rowCount > 0);
      if (!allowed) throw new Failure(403, 'Forbidden');
      const { rows } = await db.query('SELECT s.id AS session_id,s.programme_revision,w.exercise_id,w.set_number,w.reps,w.load_kg,w.recorded_at FROM workout_sessions s JOIN workout_sets w ON w.session_id=s.id WHERE s.client_id=$1 ORDER BY w.recorded_at DESC LIMIT 500', [clientId]);
      await this.audit(db, actor, 'workout.history.viewed', clientId);
      return { sets: rows, mode: 'development-only' };
    });
  }
  async programme(actor, clientId, input) {
    return this.transaction(async db => {
      // Serialize revision creation per client, including the first revision.
      const client = await db.query("SELECT id FROM users WHERE id=$1 AND role='client' FOR NO KEY UPDATE", [clientId]);
      const assignment = actor.role === 'coach' ? await db.query("SELECT 1 FROM assignments WHERE client_id=$1 AND coach_id=$2 AND scope='training' FOR SHARE", [clientId, actor.id]) : null;
      const permitted = actor.role === 'admin' || (actor.role === 'client' && actor.id === clientId) || (actor.role === 'coach' && assignment.rowCount > 0);
      if (!permitted) throw new Failure(403, 'Forbidden');
      if (!client.rowCount) throw new Failure(404, 'Client not found');
      const existing = await db.query('SELECT revision,title,exercises,created_by,created_at FROM programme_revisions WHERE client_id=$1 ORDER BY revision DESC', [clientId]);
      if (input !== undefined) {
        if (actor.role === 'client') throw new Failure(403, 'Only a training coach or admin may publish');
        const { title, exercises, expectedRevision } = input;
        if (typeof title !== 'string' || !title.trim() || title.length > 120 || !Number.isSafeInteger(expectedRevision) || expectedRevision < 0 || !Array.isArray(exercises) || exercises.length < 1 || exercises.length > 30) throw new Failure(400, 'Invalid programme');
        const cleanExercises = exercises.map((exercise, index) => {
          if (!exercise || typeof exercise !== 'object') throw new Failure(400, 'Invalid exercise');
          const { name, sets, reps, restSeconds } = exercise;
          if (typeof name !== 'string' || !name.trim() || name.length > 120 || !Number.isSafeInteger(sets) || sets < 1 || sets > 20 || !Number.isSafeInteger(reps) || reps < 1 || reps > 200 || !Number.isSafeInteger(restSeconds) || restSeconds < 0 || restSeconds > 1800) throw new Failure(400, 'Invalid exercise prescription');
          return { id: `exercise-${index + 1}`, name: name.trim(), sets, reps, restSeconds };
        });
        const latest = existing.rows[0]?.revision ?? 0;
        if (expectedRevision !== latest) throw new Failure(409, 'Programme changed. Reload before publishing another revision.');
        await db.query('INSERT INTO programme_revisions(client_id,revision,title,exercises,created_by) VALUES($1,$2,$3,$4,$5)', [clientId, latest + 1, title.trim(), JSON.stringify(cleanExercises), actor.id]);
        await this.audit(db, actor, 'programme.revision.published', clientId);
      } else await this.audit(db, actor, 'programme.viewed', clientId);
      const { rows } = await db.query('SELECT revision,title,exercises,created_by,created_at FROM programme_revisions WHERE client_id=$1 ORDER BY revision DESC', [clientId]);
      return { programme: rows[0] ?? null, history: rows, activationEnabled: false, deliveryStatus: 'preview-only' };
    });
  }
  async assessment(actor, clientId, answers) {
    return this.transaction(async db => {
      const permitted = actor.role === 'admin' || (actor.role === 'client' && actor.id === clientId) ||
        (actor.role === 'coach' && (await db.query('SELECT 1 FROM assignments WHERE client_id=$1 AND coach_id=$2', [clientId, actor.id])).rowCount > 0);
      if (!permitted) throw new Failure(403, 'Forbidden');
      if (answers !== undefined) {
        if (actor.role !== 'client' || actor.id !== clientId) throw new Failure(403, 'Only client may submit own assessment');
        if (!answers || Array.isArray(answers) || typeof answers !== 'object') throw new Failure(400, 'Answers must be an object');
        await db.query('INSERT INTO assessments(client_id,answers) VALUES($1,$2) ON CONFLICT(client_id) DO UPDATE SET answers=excluded.answers,updated_at=now()', [clientId, answers]);
        await this.audit(db, actor, 'assessment.saved', clientId);
      } else await this.audit(db, actor, 'assessment.viewed', clientId);
      const { rows } = await db.query('SELECT answers,updated_at FROM assessments WHERE client_id=$1', [clientId]);
      return { assessment: rows[0] ?? null, status: 'draft', activationEnabled: false };
    });
  }
}

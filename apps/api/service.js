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

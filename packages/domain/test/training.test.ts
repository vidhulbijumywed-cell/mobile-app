import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessTraining, missingAssessmentFields, syncSet } from '../src/training.ts';
import type { SetOperation, TrainingStore } from '../src/training.ts';

const programme = { id: 'plan', clientId: 'client-a', revision: 1 };
const operation: SetOperation = { operationId: 'op-1', clientId: 'client-a', sessionId: 'session', setId: 'set-1', programmeId: 'plan', programmeRevision: 1, reps: 8, loadKg: 30, recordedAt: '2026-11-05T09:00:00Z' };
function memoryStore(): TrainingStore & { rows: SetOperation[] } {
  const rows: SetOperation[] = [];
  return { rows, async insertOnce(op) {
    const existing = rows.find(r => r.operationId === op.operationId || (r.clientId === op.clientId && r.sessionId === op.sessionId && r.setId === op.setId));
    if (existing) {
      if (JSON.stringify(existing) !== JSON.stringify(op)) throw new Error('Conflict');
      return 'duplicate';
    }
    rows.push({ ...op }); return 'created';
  } };
}
test('training access requires the current training assignment', () => {
  const coach = { id: 'coach', role: 'coach' } as const;
  assert.equal(canAccessTraining(coach, 'client-a', []), false);
  assert.equal(canAccessTraining(coach, 'client-a', [{ clientId: 'client-a', coachId: 'coach', scope: 'nutrition' }]), false);
  assert.equal(canAccessTraining(coach, 'client-a', [{ clientId: 'client-a', coachId: 'coach', scope: 'training' }]), true);
  assert.equal(canAccessTraining(coach, 'client-b', [{ clientId: 'client-a', coachId: 'coach', scope: 'training' }]), false);
  assert.equal(canAccessTraining({ id: 'client-a', role: 'client' }, 'client-b', []), false);
});
test('assessment distinguishes missing answers from valid false and zero', () => {
  assert.deepEqual(missingAssessmentFields(['injury', 'count', 'goal', 'equipment'], { injury: false, count: 0, goal: ' ', equipment: [] }), ['goal', 'equipment']);
});
test('retrying the same offline set produces one stored record', async () => {
  const store = memoryStore(); const actor = { id: 'client-a', role: 'client' } as const;
  assert.equal(await syncSet(actor, operation, programme, store), 'created');
  assert.equal(await syncSet(actor, operation, programme, store), 'duplicate');
  assert.equal(store.rows.length, 1);
});
test('cross-client writes fail before persistence', async () => {
  const store = memoryStore();
  await assert.rejects(syncSet({ id: 'client-b', role: 'client' }, operation, programme, store), /Forbidden/);
  assert.equal(store.rows.length, 0);
});
test('a logged session stays tied to its original programme revision', async () => {
  await assert.rejects(syncSet({ id: 'client-a', role: 'client' }, operation, { ...programme, revision: 2 }, memoryStore()), /revision mismatch/);
});
test('invalid input and conflicting retries cannot silently overwrite a set', async () => {
  const store = memoryStore(); const actor = { id: 'client-a', role: 'client' } as const;
  await assert.rejects(syncSet(actor, { ...operation, loadKg: NaN }, programme, store), /Invalid load/);
  await syncSet(actor, operation, programme, store);
  await assert.rejects(syncSet(actor, { ...operation, reps: 12 }, programme, store), /Conflict/);
  assert.equal(store.rows[0].reps, 8);
});

import { randomUUID } from 'expo-crypto';
import { read, mutate } from './storage';
const key = id => `client:${id}`;
const empty = () => ({ programme: null, sessions: [] });
export const readLog = id => read(key(id));
export const lastClient = () => read('last-client');
export const rememberClient = id => mutate('last-client', () => id);
export const forgetClient = () => mutate('last-client', () => null);
export const cacheProgramme = (id, programme) => mutate(key(id), state => ({ ...(state || empty()), programme }));
export async function startSession(id) {
  const sessionId = randomUUID();
  return mutate(key(id), state => {
    if (!state?.programme) throw new Error('Download a workout preview before going offline.');
    return { ...state, sessions: [...state.sessions, { id: sessionId, programme: state.programme, startedAt: new Date().toISOString(), sets: [] }] };
  });
}
export async function recordSet(id, sessionId, exerciseId, setNumber, reps, loadKg) {
  if (!Number.isSafeInteger(reps) || reps < 0 || reps > 1000 || !Number.isFinite(loadKg) || loadKg < 0 || loadKg > 2000) throw new Error('Enter valid reps (0–1000) and load (0–2000 kg).');
  const operationId = randomUUID(); const recordedAt = new Date().toISOString();
  return mutate(key(id), state => {
    const session = state?.sessions.find(s => s.id === sessionId);
    const exercise = session?.programme.exercises.find(e => e.id === exerciseId);
    if (!exercise || setNumber < 1 || setNumber > exercise.sets) throw new Error('Unknown prescribed set');
    if (session.sets.some(s => s.operation.exerciseId === exerciseId && s.operation.setNumber === setNumber)) throw new Error('This set is already saved. Corrections require a later review workflow.');
    session.sets.push({ operation: { operationId, sessionId, programmeRevision: session.programme.revision, exerciseId, setNumber, reps, loadKg, recordedAt }, status:'pending' });
    return state;
  });
}
export async function syncLog(id, send) {
  const snapshot = await readLog(id); let count = 0;
  for (const session of snapshot?.sessions || []) for (const set of session.sets) {
    if (set.status !== 'pending') continue;
    let status;
    try {
      const ack = await send(set.operation);
      if (ack.operationId !== set.operation.operationId || !['created','duplicate'].includes(ack.status)) throw new Error('Invalid sync acknowledgement');
      status = 'synced'; count++;
    } catch (error) { if (error.status === 409) status = 'conflict'; else throw error; }
    await mutate(key(id), latest => {
      const item = latest.sessions.find(s => s.id === session.id)?.sets.find(s => s.operation.operationId === set.operation.operationId);
      if (item) item.status = status; return latest;
    });
  }
  return count;
}

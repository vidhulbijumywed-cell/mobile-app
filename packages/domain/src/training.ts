/** Shared domain rules. Persistence and authenticated transport are separate adapters. */
export type Actor = { id: string; role: 'client' | 'coach' | 'admin' };
export type Assignment = { clientId: string; coachId: string; scope: 'training' | 'nutrition' };
export type Programme = { id: string; clientId: string; revision: number };
export type SetOperation = {
  operationId: string;
  clientId: string;
  sessionId: string;
  setId: string;
  programmeId: string;
  programmeRevision: number;
  reps: number;
  loadKg: number;
  recordedAt: string;
};
export type StoredSet = SetOperation;
export interface TrainingStore {
  /** Must be atomic, durable and unique on operationId and (clientId, sessionId, setId). */
  insertOnce(operation: SetOperation): Promise<'created' | 'duplicate'>;
}

export function canAccessTraining(actor: Actor, clientId: string, assignments: Assignment[]): boolean {
  if (actor.role === 'admin') return true;
  if (actor.role === 'client') return actor.id === clientId;
  return assignments.some(a => a.clientId === clientId && a.coachId === actor.id && a.scope === 'training');
}

/** Required keys come from a published, owner-approved assessment schema. */
export function missingAssessmentFields(required: string[], answers: Record<string, unknown>): string[] {
  return required.filter(key => {
    const value = answers[key];
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0);
  });
}

function validateOperation(op: SetOperation): void {
  for (const key of ['operationId', 'clientId', 'sessionId', 'setId', 'programmeId'] as const) {
    if (typeof op[key] !== 'string' || op[key].trim() === '') throw new Error(`Invalid ${key}`);
  }
  if (!Number.isSafeInteger(op.programmeRevision) || op.programmeRevision < 1) throw new Error('Invalid programme revision');
  if (!Number.isSafeInteger(op.reps) || op.reps < 0) throw new Error('Invalid reps');
  if (!Number.isFinite(op.loadKg) || op.loadKg < 0) throw new Error('Invalid load');
  if (typeof op.recordedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(op.recordedAt) || !Number.isFinite(Date.parse(op.recordedAt))) {
    throw new Error('Invalid recorded timestamp');
  }
}

/** Actor must come from verified server authentication, never the request body. */
export async function syncSet(
  actor: Actor,
  operation: SetOperation,
  programme: Programme,
  store: TrainingStore,
): Promise<'created' | 'duplicate'> {
  if (actor.role !== 'client' || actor.id !== operation.clientId) throw new Error('Forbidden');
  validateOperation(operation);
  // Resolve the exact assigned historical revision, not just the latest plan.
  if (programme.clientId !== actor.id || programme.id !== operation.programmeId || programme.revision !== operation.programmeRevision) {
    throw new Error('Programme revision mismatch');
  }
  return store.insertOnce({ ...operation });
}

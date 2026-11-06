import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from 'react-native';
import { readLog, startSession, recordSet, syncLog } from './offline/log';
import { Icon, WorkoutArt } from './ui/Visuals';
function Counter({
  label,
  value,
  onChange,
  step = 1
}) {
  const change = delta => {
    const n = Number(value);
    onChange(String(Math.max(0, (Number.isFinite(n) ? n : 0) + delta)));
  };
  return <View style={s.counter}><Text style={s.counterLabel}>{label.includes('load') ? 'LOAD · KG' : 'REPETITIONS'}</Text><View style={s.counterRow}><Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${label}`} onPress={() => change(-step)} style={s.adjust}><Text style={s.adjustText}>−</Text></Pressable><TextInput accessibilityLabel={label} keyboardType="decimal-pad" value={value} onChangeText={onChange} style={s.number} /><Pressable accessibilityRole="button" accessibilityLabel={`Increase ${label}`} onPress={() => change(step)} style={s.adjust}><Text style={s.adjustText}>+</Text></Pressable></View></View>;
}
export default function WorkoutLogger({
  clientId,
  canSync,
  send,
  refreshKey
}) {
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [values, setValues] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [restUntil, setRestUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [history, setHistory] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  useEffect(() => {
    let active = true;
    readLog(clientId).then(value => {
      if (active) setState(value);
    }).catch(error => {
      if (active) setMessage(error.message);
    });
    return () => {
      active = false;
    };
  }, [clientId, refreshKey]);
  useEffect(() => {
    if (!restUntil) return;
    const timer = setInterval(() => {
      const time = Date.now();
      setNow(time);
      if (time >= restUntil) setRestUntil(0);
    }, 1000);
    return () => clearInterval(timer);
  }, [restUntil]);
  async function run(action) {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      await action();
    } catch (error) {
      setMessage(error.message);
    } finally {
      try {
        setState(await readLog(clientId));
      } catch (error) {
        setMessage(error.message);
      }
      setBusy(false);
    }
  }
  function button(title, action, disabled = false, accessible = title, secondary = false) {
    return <Pressable accessibilityRole="button" accessibilityLabel={accessible} disabled={busy || disabled} onPress={() => run(action)} style={[s.button, secondary && s.secondary, (busy || disabled) && {
      opacity: .45
    }]}><Text style={[s.buttonText, secondary && {
        color: '#33523c'
      }]}>{title}</Text><Icon name={secondary ? 'refresh' : 'arrow'} size={18} color={secondary ? '#33523c' : '#173b2b'} /></Pressable>;
  }
  const current = state?.sessions.at(-1);
  const exercises = current?.programme.exercises || [];
  const exercise = exercises[Math.min(activeIndex, Math.max(0, exercises.length - 1))];
  const nextSet = exercise ? Array.from({
    length: exercise.sets
  }, (_, i) => i + 1).find(n => !current.sets.some(v => v.operation.exerciseId === exercise.id && v.operation.setNumber === n)) : null;
  const savedForExercise = current?.sets.filter(v => v.operation.exerciseId === exercise?.id) || [];
  const total = exercises.reduce((n, e) => n + e.sets, 0);
  const pending = (state?.sessions || []).flatMap(v => v.sets).filter(v => v.status === 'pending').length;
  const conflicts = (state?.sessions || []).flatMap(v => v.sets).filter(v => v.status === 'conflict').length;
  const key = `${current?.id}:${exercise?.id}:${nextSet}`;
  const prior = state?.sessions.slice(0, -1).reverse().flatMap(session => session.sets.filter(set => session.programme.exercises.find(e => e.id === set.operation.exerciseId)?.name === exercise?.name)).at(0);
  const value = values[key] || {
    reps: String(exercise?.reps || 8),
    load: String(prior?.operation.loadKg ?? 0)
  };
  const remaining = Math.max(0, Math.ceil((restUntil - now) / 1000));
  async function start() {
    await startSession(clientId);
    setValues({});
    setActiveIndex(0);
    setRestUntil(0);
    setConfirmNew(false);
  }
  return <View style={s.wrapper}>
 {!current && <View style={s.sectionHeader}><View><Text style={s.kicker}>YOUR TRAINING SPACE</Text><Text style={s.sectionTitle}>{current ? 'One set at a time.' : 'Ready when you are.'}</Text></View><View style={s.status}><Icon name="shield" size={14} /><Text style={s.statusText}>Offline-ready</Text></View></View>}
 {!!message && <Text accessibilityLiveRegion="polite" style={s.message}>{message}</Text>}
 {!current ? <View style={s.ready}><View style={s.art}><WorkoutArt small /></View><View style={s.readyBody}><Text style={s.title}>{state?.programme?.title || 'Your next workout starts here.'}</Text><Text style={s.muted}>{state?.programme ? `${state.programme.exercises.length} exercises · Go at your pace. We’ll keep your place.` : 'Your coach will prepare your workout. Download the preview while signed in first.'}</Text>{button('Start workout', start, !state?.programme, 'Start local practice session')}<Text style={s.fine}>Practice mode · Coaching activation pending</Text></View></View> : <>
 <View style={s.overview}><View style={{
          flex: 1
        }}><Text style={s.kicker}>{current.programme.title}</Text><Text style={s.muted}>{current.sets.length} of {total} prescribed sets saved · Revision {current.programme.revision}</Text></View><Text style={s.progressNumber}>{Math.round(current.sets.length / Math.max(1, total) * 100)}<Text style={{
            fontSize: 13
          }}>%</Text></Text></View><View style={s.track}><View style={[s.trackFill, {
          width: `${current.sets.length / Math.max(1, total) * 100}%`
        }]} /></View>
 <ScrollTabs exercises={exercises} activeIndex={activeIndex} setActiveIndex={setActiveIndex} sets={current.sets} />
 {exercise && <View style={s.focus}><View style={s.row}><Text style={s.kicker}>EXERCISE {activeIndex + 1} / {exercises.length}</Text><Text style={s.target}>{exercise.sets} × {exercise.reps} · {exercise.restSeconds}s rest</Text></View><Text style={s.title}>{exercise.name}</Text><Text style={s.muted}>{prior ? `Last time: ${prior.operation.reps} reps at ${prior.operation.loadKg} kg` : 'Your first session here. Start with a comfortable load.'}</Text>
 {savedForExercise.map(set => <View key={set.operation.operationId} style={s.savedRow}><Icon name="check" size={17} /><Text style={s.savedLabel}>Set {set.operation.setNumber}</Text><Text style={s.savedValue}>{set.operation.reps} reps • {set.operation.loadKg} kg • {set.status}</Text></View>)}
 {remaining > 0 && <View style={s.rest}><Icon name="clock" size={18} /><Text style={s.restText}>Take a breath · {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</Text><Pressable accessibilityRole="button" accessibilityLabel="Skip rest" onPress={() => setRestUntil(0)}><Text style={s.link}>Skip</Text></Pressable></View>}
 {nextSet ? <><Text style={s.setLabel}>SET {nextSet} OF {exercise.sets}</Text><View style={s.inputs}><Counter label={`${exercise.name} set ${nextSet} reps`} value={value.reps} onChange={reps => setValues(v => ({
              ...v,
              [key]: {
                ...value,
                reps
              }
            }))} /><Counter label={`${exercise.name} set ${nextSet} load kg`} value={value.load} step={2.5} onChange={load => setValues(v => ({
              ...v,
              [key]: {
                ...value,
                load
              }
            }))} /></View><Text style={s.fine}>Bodyweight movement? Leave load at 0 kg.</Text>{button(`Log set ${nextSet} ✓`, async () => {
            if (!value.reps.trim() || !value.load.trim()) throw new Error('Enter reps and load before saving.');
            await recordSet(clientId, current.id, exercise.id, nextSet, Number(value.reps), Number(value.load));
            setRestUntil(Date.now() + exercise.restSeconds * 1000);
            setNow(Date.now());
            setMessage('Set saved. Keep going at your pace.');
          }, false, `Save ${exercise.name} set ${nextSet}`)}</> : <View style={s.exerciseDone}><Icon name="check" size={28} /><Text style={s.doneTitle}>That’s this exercise saved.</Text>{activeIndex < exercises.length - 1 ? button('Next exercise', async () => {
            setActiveIndex(v => v + 1);
            setRestUntil(0);
          }) : <Text style={s.muted}>Every prescribed set is stored. Your coach can review it after sync.</Text>}</View>}
 </View>}
 <Pressable accessibilityRole="button" accessibilityLabel="Start local practice session" onPress={() => setConfirmNew(true)}><Text style={s.link}>Start a new practice session</Text></Pressable>
 </>}
 <View style={s.sync}><View style={{
        flex: 1
      }}><Text style={s.syncTitle}>{pending ? `${pending} ${pending === 1 ? 'set' : 'sets'} ready to sync` : 'Your saved progress'}</Text><Text style={s.fine}>{conflicts ? `${conflicts} conflicts kept for review.` : canSync ? 'Sync to share your saved sets with your coach.' : 'Sign in to sync. Your sets are safe on this device.'}</Text></View>{button('Sync now', async () => {
        const count = await syncLog(clientId, send);
        setMessage(count ? 'Progress shared with your coach.' : 'Your saved sets are already up to date.');
      }, !canSync, 'Sync saved sets', true)}</View>
 <Pressable accessibilityRole="button" accessibilityLabel="Session history" onPress={() => setHistory(v => !v)} style={s.historyToggle}><Text style={s.link}>Session history</Text><Text style={s.fine}>{state?.sessions.length || 0} sessions {history ? '−' : '+'}</Text></Pressable>
 {history && (state?.sessions || []).slice().reverse().map(session => <View key={session.id} style={s.historyRow}><Text style={s.historyTitle}>{session.programme.title}</Text><Text style={s.fine}>{new Date(session.startedAt).toLocaleString()} · Revision {session.programme.revision} · {session.sets.length} saved sets</Text></View>)}
 <Modal visible={confirmNew} transparent animationType="fade" onRequestClose={() => setConfirmNew(false)}><View style={s.overlay}><View style={s.confirm}><Text style={s.title}>Start fresh?</Text><Text style={s.muted}>Your existing session stays in history. Any saved sets will still be synced.</Text>{button('Start another session', start)}<Pressable accessibilityRole="button" onPress={() => setConfirmNew(false)}><Text style={s.link}>Keep this session</Text></Pressable></View></View></Modal>
 </View>;
}
function ScrollTabs({
  exercises,
  activeIndex,
  setActiveIndex,
  sets
}) {
  return <View style={s.tabs}>{exercises.map((exercise, i) => <Pressable key={exercise.id} accessibilityRole="button" accessibilityLabel={`Exercise ${i + 1}: ${exercise.name}`} accessibilityState={{
      selected: activeIndex === i
    }} onPress={() => setActiveIndex(i)} style={[s.tab, activeIndex === i && s.tabActive]}><Text style={[s.tabText, activeIndex === i && {
        color: '#1b492e'
      }]}>{sets.filter(v => v.operation.exerciseId === exercise.id).length === exercise.sets ? '✓' : String(i + 1).padStart(2, '0')}  {exercise.name}</Text></Pressable>)}</View>;
}
const s = StyleSheet.create({
  wrapper: {
    marginTop: 22
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12
  },
  kicker: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#7b8c7c',
    textTransform: 'uppercase'
  },
  sectionTitle: {
    fontSize: 27,
    letterSpacing: -.8,
    color: '#213c2b',
    fontWeight: '600',
    marginTop: 8
  },
  status: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    backgroundColor: '#e7eee1',
    padding: 8,
    borderRadius: 20
  },
  statusText: {
    fontSize: 10,
    color: '#5b735b'
  },
  message: {
    color: '#557045',
    fontSize: 13,
    marginVertical: 12
  },
  ready: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e4eadf'
  },
  art: {
    backgroundColor: '#173e2e'
  },
  readyBody: {
    padding: 26
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -.8,
    color: '#1c3c2b',
    marginVertical: 12
  },
  muted: {
    fontSize: 13,
    lineHeight: 22,
    color: '#7d8b7c'
  },
  button: {
    backgroundColor: '#d8f684',
    padding: 16,
    borderRadius: 13,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12
  },
  buttonText: {
    color: '#173b2b',
    fontWeight: '700',
    fontSize: 14
  },
  secondary: {
    backgroundColor: '#e9f0e2'
  },
  fine: {
    fontSize: 11,
    color: '#7b8c79',
    lineHeight: 18
  },
  overview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 8
  },
  progressNumber: {
    fontSize: 32,
    fontWeight: '600',
    color: '#416847'
  },
  track: {
    height: 5,
    backgroundColor: '#e0e9da',
    borderRadius: 4,
    marginTop: 15,
    marginBottom: 20,
    overflow: 'hidden'
  },
  trackFill: {
    height: 5,
    backgroundColor: '#719655'
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  tab: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#eaf0e4'
  },
  tabActive: {
    backgroundColor: '#d8f684'
  },
  tabText: {
    fontSize: 12,
    color: '#7a8b76'
  },
  focus: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 26,
    borderWidth: 1,
    borderColor: '#e5ecdf'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10
  },
  target: {
    fontSize: 11,
    color: '#7b8d79'
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: '#edf2e8',
    flexWrap: 'wrap'
  },
  savedLabel: {
    fontSize: 12,
    color: '#4e6d4a'
  },
  savedValue: {
    fontSize: 12,
    color: '#687e5d'
  },
  rest: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f6eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    marginTop: 16
  },
  restText: {
    flex: 1,
    fontSize: 13,
    color: '#597149'
  },
  setLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#829075',
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 16
  },
  inputs: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap'
  },
  counter: {
    flex: 1,
    minWidth: 130,
    borderWidth: 1,
    borderColor: '#e3eadb',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#fbfcf8'
  },
  counterLabel: {
    fontSize: 9,
    letterSpacing: 1,
    color: '#7a8b73',
    textAlign: 'center'
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  adjust: {
    width: 30,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#edf3e6'
  },
  adjustText: {
    color: '#527044',
    fontSize: 22
  },
  number: {
    flex: 1,
    textAlign: 'center',
    fontSize: 29,
    fontWeight: '600',
    color: '#29452a',
    minWidth: 35,
    paddingVertical: 8
  },
  link: {
    fontSize: 12,
    fontWeight: '600',
    color: '#567248',
    paddingVertical: 15
  },
  exerciseDone: {
    alignItems: 'center',
    paddingVertical: 26
  },
  doneTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3f653b',
    marginTop: 12
  },
  sync: {
    marginTop: 22,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#edf2e5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap'
  },
  syncTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#45603a',
    marginBottom: 4
  },
  historyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  historyRow: {
    padding: 18,
    borderBottomWidth: 1,
    borderColor: '#e3eadc'
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f6944',
    marginBottom: 4
  },
  overlay: {
    flex: 1,
    backgroundColor: '#142b2380',
    padding: 24,
    justifyContent: 'center'
  },
  confirm: {
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
    padding: 28,
    borderRadius: 24,
    backgroundColor: 'white'
  }
});

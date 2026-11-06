import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import WorkoutLogger from './WorkoutLogger';
import PrototypeClient from './PrototypeClient';
import GuidedAssessment from './GuidedAssessment';
import { cacheProgramme, lastClient, rememberClient, forgetClient } from './offline/log';
const API = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://127.0.0.1:3001');
// Provisional optional draft fields only. No activation or approved clinical assessment is implied.
const fields = [['displayName', 'Preferred name'], ['goal', 'What would you like coaching to help you achieve?'], ['trainingHistory', 'Training experience'], ['availability', 'Days and time available'], ['equipment', 'Equipment you have access to'], ['dietaryPreferences', 'Food preferences']];
function Button({
  title,
  onPress,
  disabled,
  secondary
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={disabled} onPress={onPress} style={[styles.button, secondary && styles.secondary, disabled && styles.disabled]}><Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text></Pressable>;
}
function Input({
  label,
  value,
  onChangeText,
  secure = false,
  multiline = false,
  email = false
}) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} secureTextEntry={secure} multiline={multiline} autoCapitalize={email || secure ? 'none' : 'sentences'} autoCorrect={!email && !secure} keyboardType={email ? 'email-address' : 'default'} style={[styles.input, multiline && styles.multiline]} /></View>;
}
export default function App() {
  const [offlineClient, setOfflineClient] = useState(null);
  const [logVersion, setLogVersion] = useState(0);
  useEffect(() => {
    lastClient().then(setOfflineClient).catch(() => {});
  }, []);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invitation, setInvitation] = useState('');
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [savedAt, setSavedAt] = useState(null);
  const [programme, setProgramme] = useState(null);
  const [programmeLoaded, setProgrammeLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [loaded, setLoaded] = useState(false);
  function clearSession() {
    setProgramme(null);
    setProgrammeLoaded(false);
    setSession(null);
    setAnswers({});
    setSavedAt(null);
    setLoaded(false);
    setPassword('');
    setInvitation('');
  }
  async function api(path, method = 'GET', body, accessToken = session?.token) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(API + path, {
        method,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? {
            Authorization: `Bearer ${accessToken}`
          } : {})
        },
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401 && accessToken) clearSession();
        const error = new Error(result.error || 'Request failed');
        error.status = response.status;
        throw error;
      }
      return result;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Connection timed out. Your unsaved answers remain on this screen.');
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
  async function run(action) {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      await action();
    } catch (error) {
      setMessage(error.message || 'Could not connect. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  async function load(token, id) {
    const result = await api(`/clients/${id}/assessment`, 'GET', undefined, token);
    setAnswers(result.assessment?.answers || {});
    setSavedAt(result.assessment?.updated_at || null);
    setLoaded(true);
  }
  async function loadProgramme(token, id) {
    const result = await api(`/clients/${id}/programme`, 'GET', undefined, token);
    await cacheProgramme(id, result.programme);
    setLogVersion(v => v + 1);
    setProgramme(result.programme);
    setProgrammeLoaded(true);
  }
  async function signIn() {
    const result = await api('/auth/login', 'POST', {
      email: email.trim(),
      password
    }, null);
    const me = await api('/me', 'GET', undefined, result.accessToken);
    if (me.role !== 'client') {
      await api('/auth/logout', 'POST', {}, result.accessToken);
      throw new Error('Use a client account here. Staff use FitPilot Coach.');
    }
    await rememberClient(me.id);
    setOfflineClient(me.id);
    setPassword('');
    setSession({
      id: me.id,
      token: result.accessToken
    });
    await load(result.accessToken, me.id);
    await loadProgramme(result.accessToken, me.id);
  }
  if (session?.token) {
    const assessmentPanel = loaded ? <GuidedAssessment answers={answers} onChange={setAnswers} busy={busy} savedAt={savedAt} onSave={() => run(async () => {
      const result = await api(`/clients/${session.id}/assessment`, 'PUT', {
        answers
      });
      setSavedAt(result.assessment.updated_at);
      setMessage('Draft saved. Your assigned coach can review it.');
    })} /> : <Button title="Load saved assessment" disabled={busy} onPress={() => run(() => load(session.token, session.id))} />;
    const trainingPanel = <>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Text style={{
          fontSize: 13,
          color: '#6c806b'
        }}>{programmeLoaded ? programme ? `${programme.title} • Revision ${programme.revision}` : 'Your coach is preparing your workout.' : 'Loading your workout…'}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Refresh workout preview" disabled={busy} onPress={() => run(() => loadProgramme(session.token, session.id))} style={{
          padding: 10
        }}><Text style={{
            fontSize: 12,
            color: '#637c55'
          }}>Refresh ↻</Text></Pressable>
      </View>
      <WorkoutLogger key={session.id} clientId={session.id} canSync={Boolean(session.token)} refreshKey={logVersion} send={operation => api('/workout-sets', 'POST', operation)} />
    </>;
    return <PrototypeClient name={answers.displayName} programme={programme} assessment={assessmentPanel} training={trainingPanel} busy={busy} message={message} onNavigate={() => setMessage('')} onSignOut={() => run(async () => {
      await api('/auth/logout', 'POST', {});
      await forgetClient();
      setOfflineClient(null);
      clearSession();
      setMessage('Signed out.');
    })} />;
  }
  return <SafeAreaView style={styles.screen}><KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <View style={styles.brand}><Text style={styles.wordmark}>fitpilot→</Text><Text style={styles.tagline}>Your next stronger.</Text></View>
    <View style={styles.notice}><Text style={{
            fontSize: 11,
            color: '#74816e'
          }}>DEMO SPACE · Fictional data · Coaching not activated</Text></View>
    <View accessibilityLiveRegion="polite"><Text style={styles.message}>{message}</Text></View>
    {!session?.token ? <View style={styles.card}>
      <Text style={styles.eyebrow}>WELCOME TO YOUR COACHING SPACE</Text><Text style={styles.title}>{mode === 'login' ? 'Good to see you.' : 'Join your coach.'}</Text>
      <Text style={styles.body}>{mode === 'login' ? 'Your plan. Your progress. Your people. All in one place.' : 'Enter the private invitation token supplied by your coach or administrator. Then create a password.'}</Text>
      {mode === 'redeem' ? <Input label="Invitation token" value={invitation} onChangeText={setInvitation} email /> : <Input label="Email" value={email} onChangeText={setEmail} email />}
      <Input label={mode === 'redeem' ? 'Create password (12–256 characters)' : 'Password'} value={password} onChangeText={setPassword} secure />
      <Button title={busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Accept invitation'} disabled={busy || !password || (mode === 'login' ? !email : !invitation)} onPress={() => run(async () => {
            if (mode === 'login') return signIn();
            await api('/auth/redeem', 'POST', {
              token: invitation.trim(),
              password
            }, null);
            setInvitation('');
            setPassword('');
            setMode('login');
            setMessage('Account created. Sign in with the email address that received your invitation.');
          })} />
      <Button title={mode === 'login' ? 'I have an invitation' : 'Back to sign in'} secondary disabled={busy} onPress={() => {
            setMode(mode === 'login' ? 'redeem' : 'login');
            setPassword('');
            setInvitation('');
            setMessage('');
          }} />
    {offlineClient && <Button title="Resume offline practice log" secondary disabled={busy} onPress={() => {
            setSession({
              id: offlineClient,
              token: null
            });
            setMessage('Local fictional-data practice only. Sign in to sync.');
          }} />}
    </View> : <View style={styles.card}>
      <Text style={styles.eyebrow}>GETTING TO KNOW YOU</Text><Text style={styles.title}>Your starting point</Text>
      <Text style={styles.body}>These optional questions are a provisional draft. Your coach will confirm the full assessment. Save now and return later.</Text>
      {!loaded ? <Button title="Load saved assessment" disabled={busy} onPress={() => run(() => load(session.token, session.id))} /> : <>
        {fields.map(([key, label]) => <Input key={key} label={label} value={typeof answers[key] === 'string' ? answers[key] : ''} onChangeText={value => setAnswers(previous => ({
              ...previous,
              [key]: value
            }))} multiline={key !== 'displayName'} />)}
        <Text style={styles.body}>{savedAt ? `Last saved: ${new Date(savedAt).toLocaleString()}` : 'No saved draft yet.'}</Text>
        <Text style={styles.small}>Answers are sent only when you save. Unsaved changes are lost if you close the app. Do not enter real health information in this development build.</Text>
        <Button title="Save draft" disabled={busy} onPress={() => run(async () => {
              const result = await api(`/clients/${session.id}/assessment`, 'PUT', {
                answers
              });
              setSavedAt(result.assessment.updated_at);
              setMessage('Draft saved. Your assigned coach can review it.');
            })} />
      </>}
      <Button title="Sign out" secondary disabled={busy} onPress={() => run(async () => {
            await api('/auth/logout', 'POST', {});
            await forgetClient();
            setOfflineClient(null);
            clearSession();
            setMessage('Signed out.');
          })} />
    </View>}
    {session?.token && <View style={[styles.card, {
          marginTop: 20
        }]}>
      <Text style={styles.eyebrow}>TRAINING</Text><Text style={styles.title}>Your workout preview</Text>
      <Text style={styles.body}>Your coach can prepare your workout here. This is a preview only. Training activation is pending the approved assessment and package rules.</Text>
      {programmeLoaded ? programme ? <>
        <Text style={styles.label}>{programme.title} • Revision {programme.revision}</Text>
        {programme.exercises.map(exercise => <View key={exercise.id} style={styles.field}>
          <Text style={styles.label}>{exercise.name}</Text><Text style={styles.body}>{exercise.sets} sets × {exercise.reps} reps • Rest {exercise.restSeconds} seconds</Text>
        </View>)}
      </> : <Text style={styles.body}>No workout preview assigned yet. Your coach will prepare it.</Text> : <Text style={styles.body}>Workout preview has not loaded.</Text>}
      <Pressable accessibilityRole="button" accessibilityLabel="Refresh workout preview" disabled={busy} onPress={() => run(() => loadProgramme(session.token, session.id))} style={{
            padding: 10
          }}><Text style={{
              fontSize: 12,
              color: '#637c55'
            }}>Refresh ↻</Text></Pressable>
    </View>}
    {session && <WorkoutLogger key={session.id} clientId={session.id} canSync={Boolean(session.token)} refreshKey={logVersion} send={operation => api('/workout-sets', 'POST', operation)} />}
    <Text style={styles.footer}>Coach-led training. Nutrition. Progress.</Text>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f0'
  },
  content: {
    padding: 24,
    paddingTop: 65,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center'
  },
  brand: {
    marginBottom: 28
  },
  wordmark: {
    fontSize: 36,
    fontWeight: '800',
    color: '#174a38'
  },
  tagline: {
    fontSize: 16,
    color: '#53685d',
    marginTop: 6
  },
  notice: {
    backgroundColor: '#eaf0e4',
    padding: 14,
    borderRadius: 10
  },
  message: {
    color: '#7e3c16',
    fontSize: 15,
    marginVertical: 14
  },
  card: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#dce4dc'
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: '#537662',
    fontWeight: '700'
  },
  title: {
    fontSize: 30,
    color: '#193b2d',
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 12
  },
  body: {
    fontSize: 15,
    color: '#52655b',
    lineHeight: 23,
    marginBottom: 14
  },
  field: {
    marginBottom: 18
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#274637',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#9fb3a6',
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    color: '#20372a',
    backgroundColor: '#fcfdfb'
  },
  multiline: {
    minHeight: 85,
    textAlignVertical: 'top'
  },
  button: {
    backgroundColor: '#183e30',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  secondary: {
    backgroundColor: '#e8f0e8'
  },
  secondaryText: {
    color: '#23533d'
  },
  disabled: {
    opacity: 0.5
  },
  small: {
    fontSize: 12,
    lineHeight: 19,
    color: '#5d6b61'
  },
  footer: {
    textAlign: 'center',
    color: '#65796a',
    fontSize: 12,
    marginVertical: 25
  }
});

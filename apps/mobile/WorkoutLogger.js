import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { readLog, startSession, recordSet, syncLog } from './offline/log';
export default function WorkoutLogger({ clientId, canSync, send, refreshKey }) {
  const [state,setState] = useState(null); const [busy,setBusy] = useState(false); const [message,setMessage] = useState(''); const [values,setValues] = useState({});
  useEffect(() => { let active = true; readLog(clientId).then(value => { if(active) setState(value); }).catch(error => { if(active) setMessage(error.message); }); return () => { active=false; }; },[clientId,refreshKey]);
  async function run(action) {
    if(busy) return; setBusy(true); setMessage('');
    try { await action(); } catch(error) { setMessage(error.message); }
    finally { try { setState(await readLog(clientId)); } catch(error) { setMessage(error.message); } setBusy(false); }
  }
  function button(title,action,disabled=false) { return <Pressable key={title} accessibilityRole="button" accessibilityLabel={title} disabled={busy||disabled} onPress={() => run(action)} style={[styles.button,(busy||disabled)&&{opacity:.45}]}><Text style={styles.buttonText}>{title}</Text></Pressable>; }
  const current = state?.sessions.at(-1);
  return <View style={styles.card}><Text style={styles.title}>Development workout log</Text><Text>Fictional data only. Saving a set commits it locally before sync. Synced sets are immutable in this initial slice.</Text>
    <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>
    {button('Start local practice session',async()=>{ await startSession(clientId); setValues({}); },!state?.programme)}
    {!state?.programme && <Text>Download a workout preview while signed in first.</Text>}
    {current && <><Text style={styles.heading}>{current.programme.title} • Logged revision {current.programme.revision}</Text>
      {current.programme.exercises.flatMap(exercise => Array.from({length:exercise.sets},(_,i)=>{
        const number=i+1; const key=`${current.id}:${exercise.id}:${number}`; const label=`${exercise.name} set ${number}`;
        const saved=current.sets.find(s=>s.operation.exerciseId===exercise.id&&s.operation.setNumber===number);
        const value=values[key]||{reps:String(exercise.reps),load:''};
        return <View key={key} style={styles.row}><Text style={styles.heading}>{label}</Text>{saved ? <Text>{saved.operation.reps} reps • {saved.operation.loadKg} kg • {saved.status}</Text> : <>
          <Text>Reps</Text><TextInput accessibilityLabel={`${label} reps`} keyboardType="number-pad" value={value.reps} onChangeText={reps=>setValues(v=>({...v,[key]:{...value,reps}}))} style={styles.input}/>
          <Text>Load (kg; use 0 for bodyweight)</Text><TextInput accessibilityLabel={`${label} load kg`} keyboardType="decimal-pad" value={value.load} onChangeText={load=>setValues(v=>({...v,[key]:{...value,load}}))} style={styles.input}/>
          {button(`Save ${label}`,async()=>{ if(value.reps.trim()===''||value.load.trim()==='') throw new Error('Enter both reps and load before saving.'); await recordSet(clientId,current.id,exercise.id,number,Number(value.reps),Number(value.load)); setMessage('Set saved on this device.'); })}
        </>}</View>;
      }))}
    </>}
    <Text style={styles.heading}>Local session history</Text>
    {(state?.sessions||[]).map(s=><Text key={s.id}>{s.programme.title} • Revision {s.programme.revision} • {new Date(s.startedAt).toLocaleString()} • {s.sets.filter(v=>v.status==='pending').length} pending • {s.sets.filter(v=>v.status==='synced').length} synced • {s.sets.filter(v=>v.status==='conflict').length} conflicts</Text>)}
    {button('Sync saved sets',async()=>{ const count=await syncLog(clientId,send);setMessage(`${count} sets acknowledged. Conflicts remain stored for review.`); },!canSync)}
    {!canSync && <Text>Offline practice mode. Sign in again to sync; your saved sessions stay on this device.</Text>}
  </View>;
}
const styles=StyleSheet.create({card:{padding:24,marginTop:20,backgroundColor:'white',borderRadius:20},title:{fontSize:25,fontWeight:'700',color:'#193b2d',marginBottom:15},heading:{fontWeight:'700',marginVertical:12},message:{color:'#824619',marginVertical:12},row:{borderTopWidth:1,borderColor:'#ddd',paddingVertical:14},input:{borderWidth:1,borderColor:'#9fb3a6',padding:12,marginVertical:8,borderRadius:8},button:{backgroundColor:'#236447',padding:14,borderRadius:9,marginVertical:10},buttonText:{color:'white',fontWeight:'700'}});

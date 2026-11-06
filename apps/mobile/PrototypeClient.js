import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal, StyleSheet, useWindowDimensions, SafeAreaView } from 'react-native';
const pages = ['Today', 'Train', 'Nutrition', 'Progress', 'Coach'];
const icons = {
  Today: '◈',
  Train: '→',
  Nutrition: '◉',
  Progress: '▥',
  Coach: '☏'
};
function Action({
  title,
  onPress,
  dark = false,
  outline = false
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={[s.button, dark && s.dark, outline && s.outline]}><Text style={[s.buttonText, dark && {
      color: 'white'
    }]}>{title}</Text></Pressable>;
}
function Card({
  children,
  style
}) {
  return <View style={[s.card, style]}>{children}</View>;
}
function Label({
  children
}) {
  return <Text style={s.eyebrow}>{children}</Text>;
}
function Title({
  children
}) {
  return <Text style={s.h2}>{children}</Text>;
}
function Muted({
  children
}) {
  return <Text style={s.muted}>{children}</Text>;
}
function Item({
  icon,
  title,
  sub,
  children
}) {
  return <View style={s.item}><View style={s.square}><Text style={{
        fontSize: 20
      }}>{icon}</Text></View><View style={{
      flex: 1
    }}><Text style={s.h3}>{title}</Text><Muted>{sub}</Muted></View>{children}</View>;
}
function Sample() {
  return <Text style={s.sample}>DESIGN PREVIEW · FICTIONAL SAMPLE</Text>;
}
export default function PrototypeClient({
  name,
  programme,
  assessment,
  training,
  message,
  onSignOut,
  busy
}) {
  const {
    width
  } = useWindowDimensions();
  const small = width < 550;
  const wide = width > 1000;
  const [page, setPage] = useState('Today');
  const [dialog, setDialog] = useState(null);
  const [mealSaved, setMealSaved] = useState(false);
  const [estimate, setEstimate] = useState(false);
  const [portion, setPortion] = useState('2 dosas, coconut chutney and a 2-egg omelette');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [energy, setEnergy] = useState('Good — ready to train');
  const [sleep, setSleep] = useState('7');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);
  const [checkin, setCheckin] = useState('');
  const [slot, setSlot] = useState('Thursday · 6:30 PM');
  function heading(k, title, sub) {
    return <View style={s.heading}><Label>{k}</Label><Text style={[s.h1, small && {
        fontSize: 29
      }]}>{title}</Text><Muted>{sub}</Muted></View>;
  }
  function grid(left, right) {
    return <View style={{
      flexDirection: wide ? 'row' : 'column',
      gap: 22
    }}><View style={{
        flex: 1.65
      }}>{left}</View><View style={{
        flex: 1
      }}>{right}</View></View>;
  }
  function nutritionCard() {
    return <Card><View style={s.row}><Title>Fuel your progress</Title><Pressable accessibilityRole="button" onPress={() => setPage('Nutrition')}><Text style={s.link}>View diary →</Text></Pressable></View><Sample /><View style={[s.row, {
        marginVertical: 22,
        gap: 25
      }]}><View style={s.ring}><Text style={{
            fontSize: 25,
            fontWeight: '600'
          }}>{mealSaved ? '1,802' : '1,320'}</Text><Muted>of 2,100 kcal</Muted></View><View style={{
          flex: 1
        }}>{[['Protein', '84 / 140 g', 60], ['Carbs', '156 / 240 g', 65], ['Fat', '40 / 65 g', 62]].map(([k, v, p]) => <View key={k}><View style={s.row}><Text style={s.tiny}>{k}</Text><Text style={s.tiny}>{v}</Text></View><View style={s.bar}><View style={{
                width: `${p}%`,
                height: 6,
                backgroundColor: '#799763'
              }} /></View></View>)}</View></View><Action title="＋ Log a meal" outline onPress={() => {
        setEstimate(false);
        setDialog('meal');
      }} /></Card>;
  }
  const home = <>{heading('Small steps. Stronger you.', `Let’s make today count, ${name || 'you'}.`, 'Your coaching space, now connected to FitPilot.')}{grid(<><Card style={s.hero}><View style={s.heroArt} /><View style={s.heroArt2} /><Text style={[s.eyebrow, {
          color: '#d8f684'
        }]}>YOUR WORKOUT · {programme ? `REVISION ${programme.revision}` : 'AWAITING COACH'}</Text><Text style={s.heroTitle}>Build strength.{'\n'}Find your rhythm.</Text><Text style={{
          color: '#bacabc',
          marginBottom: 22
        }}>{programme?.title || 'Your coach has not published a workout preview yet.'}</Text><Action title="Start your workout →" onPress={() => setPage('Train')} /><Text style={{
          color: '#bacabc',
          fontSize: 11,
          marginTop: 12
        }}>Development practice only · Activation pending</Text></Card><View style={s.stats}>{[['Steps', '—', 'Not connected'], ['Sleep', '—', 'Not connected'], ['Consistency', '—', 'Rules awaiting approval']].map(([k, v, sub]) => <View style={s.stat} key={k}><Muted>{k}</Muted><Text style={s.statValue}>{v}</Text><Text style={s.tiny}>{sub}</Text></View>)}</View><Card><Title>Your week, in motion</Title><Sample /><View style={s.week}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <View key={i} style={[s.day, i === 2 && {
            backgroundColor: '#d8f684'
          }]}><Text>{d}</Text><Text style={{
              fontWeight: '700',
              marginTop: 8
            }}>{i + 2}</Text></View>)}</View><Muted>Sample calendar layout. Your training schedule is not connected yet.</Muted></Card></>, <>{nutritionCard()}<Card><Label>A LITTLE ACCOUNTABILITY</Label><Title>Your coach is in your corner.</Title><Muted>Open your assessment to tell your assigned coach about your goals, experience and routine.</Muted><Action title="Your assessment →" outline onPress={() => setPage('Assessment')} /><Action title="Message your coach →" outline onPress={() => setPage('Coach')} /></Card><Card><Sample /><Item icon="◷" title="Weekly review" sub="Sample session · Not booked"><Action title="Details" outline onPress={() => setDialog('booking')} /></Item></Card></>)}</>;
  const nutrition = <>{heading('Nourish your routine', 'Good fuel. Better days.', 'Your personalised nutrition plan and food diary.')}{grid(<>{nutritionCard()}<Card><Title>Today’s food diary</Title><Sample /><Item icon="☀" title="Breakfast" sub="Oats, banana & eggs · 420 kcal" /><Item icon="◉" title="Lunch" sub="Rice, grilled fish & vegetables · 620 kcal" /><Item icon="◌" title="Snack" sub="Greek yoghurt & fruit · 280 kcal" />{mealSaved && <Item icon="✓" title="Sample meal logged" sub="Illustrative estimate · 482 kcal" />}</Card></>, <><Card><Label>TRAINER-ASSIGNED PLAN</Label><Title>Balanced strength</Title><Sample /><Muted>Daily target: 2,100 kcal{'\n'}Protein: 140 g · Carbs: 240 g · Fat: 65 g</Muted><Text style={s.h3}>Dinner suggestion</Text><Muted>Chapati, chicken curry and vegetables. These are fictional example portions, not your assigned nutrition plan.</Muted><Action title="Discuss your plan" outline onPress={() => setPage('Coach')} /></Card><View style={s.notice}><Text>Photo macros are estimates. No photo analysis or food database is connected. Cronometer/MyFitnessPal access remains unconfirmed.</Text></View></>)}</>;
  const progress = <>{heading('See how far you’ve come', 'Progress beyond the scale.', 'Your weekly picture, all in one place.')}{grid(<Card><Title>Weekly activity</Title><Sample /><View style={s.chart}>{[45, 61, 53, 75, 91, 71, 84].map((n, i) => <View key={i} style={{
          flex: 1,
          alignItems: 'center',
          height: 160,
          justifyContent: 'flex-end'
        }}><View style={{
            width: '90%',
            height: n * 1.3,
            backgroundColor: i === 4 ? '#42674d' : '#cbdcb9',
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6
          }} /><Text style={s.tiny}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text></View>)}</View><Muted>This chart illustrates the design. No activity or adherence is calculated.</Muted></Card>, <Card><Title>Connected health</Title><Item icon="♡" title="Apple Health / Health Connect" sub="Not connected" /><Item icon="◷" title="Sleep" sub="Unavailable · Permission/data required" /><Item icon="→" title="Workout duration" sub="Not imported" /><Item icon="♡" title="Heart rate" sub="Unavailable" /><Action title="Manage connections" outline onPress={() => setDialog('connections')} /></Card>)}</>;
  const coach = <>{heading('Real support, every step', 'Your coach, closer.', 'Messages, check-ins and live coaching.')}{grid(<Card><Title>Your coach</Title><Sample /><Muted>No message delivery is connected. Text below remains a local design preview.</Muted><View style={s.bubble}><Text>How did your last session feel? This is a sample conversation.</Text></View>{messages.map((text, i) => <View key={i} style={[s.bubble, s.mine]}><Text style={{
          color: 'white'
        }}>{text}</Text></View>)}<TextInput accessibilityLabel="Message coach" placeholder="Write a message…" value={draft} onChangeText={setDraft} style={s.input} /><Action title="Add to sample conversation →" dark onPress={() => {
        if (draft.trim()) {
          setMessages(v => [...v, draft.trim()]);
          setDraft('');
        }
      }} /></Card>, <><Card><Title>Next live session</Title><Sample /><Muted>{slot}{'\n'}Weekly review · 30 minutes · Not booked</Muted><Action title="Reschedule preview" outline onPress={() => setDialog('booking')} /></Card><Card><Title>Weekly check-in</Title><Muted>Share your energy, sleep and wins with your coach.</Muted><Action title="Complete sample check-in" dark onPress={() => setDialog('checkin')} /><Muted>Design preview only; no check-in is submitted.</Muted></Card></>)}</>;
  const navigation = <>{pages.map(p => <Pressable key={p} accessibilityRole="button" accessibilityLabel={p} accessibilityState={{
      selected: page === p
    }} onPress={() => setPage(p)} style={[s.navButton, small && s.bottomButton, page === p && s.active]}><Text style={[s.icon, page === p && {
        color: '#163b2b'
      }]}>{icons[p]}</Text>{(small || width > 900) && <Text style={[s.navText, small && {
        fontSize: 9
      }, page === p && {
        color: '#163b2b',
        fontWeight: '700'
      }]}>{p}</Text>}</Pressable>)}</>;
  return <SafeAreaView style={s.safe}><View style={s.shell}>{!small && <View style={[s.sidebar, {
        width: width > 900 ? 235 : 75
      }]}><Text style={s.logo}>{width > 900 ? 'fitpilot' : 'fp'}<Text style={{
            color: '#d8f684'
          }}>→</Text></Text>{width > 900 && <Text style={s.caption}>YOUR NEXT STRONGER</Text>}<View style={{
          gap: 7,
          marginTop: width > 900 ? 0 : 35
        }}>{navigation}</View>{width > 900 && <View style={{
          marginTop: 'auto',
          padding: 15
        }}><Text style={{
            color: 'white',
            fontWeight: '700'
          }}>{name || 'Your account'}</Text><Text style={{
            color: '#bdcdc4',
            marginTop: 8
          }}>Package not activated</Text></View>}</View>}
 <ScrollView style={{
        flex: 1
      }} contentContainerStyle={[s.main, {
        padding: small ? 18 : 30,
        paddingBottom: small ? 110 : 40
      }]} keyboardShouldPersistTaps="handled"><View style={s.top}><View><Text style={{
              fontWeight: '700',
              color: '#202b27'
            }}>Your personal coaching space</Text><Muted>FitPilot · Connected development model</Muted></View><View style={{
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center'
          }}><Pressable accessibilityRole="button" accessibilityLabel="Assessment" onPress={() => setPage('Assessment')}><Text style={s.link}>Assessment</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Sign out" disabled={busy} onPress={onSignOut}><Text style={s.link}>Sign out</Text></Pressable></View></View>
 <View accessibilityLiveRegion="polite">{!!message && <Text style={s.message}>{message}</Text>}</View>
 <View style={page === 'Today' ? null : {
          display: 'none'
        }}>{home}</View>
 <View style={page === 'Train' ? null : {
          display: 'none'
        }}>{heading('Your programme', 'Train with intention.', 'Your assigned workout and durable practice log.')}{training}<Card><Title>Exercise demonstrations</Title><Muted>Approved demonstrations are not supplied yet. These actions open the prototype’s schematic placeholder.</Muted>{(programme?.exercises || []).map(exercise => <Item key={exercise.id} icon="→" title={exercise.name} sub={`${exercise.sets} sets × ${exercise.reps} reps · ${exercise.restSeconds} sec rest`}><Action title={`Demo: ${exercise.name}`} outline onPress={() => {
                setSelectedExercise(exercise);
                setDialog('exercise');
              }} /></Item>)}</Card></View>
 <View style={page === 'Nutrition' ? null : {
          display: 'none'
        }}>{nutrition}</View><View style={page === 'Progress' ? null : {
          display: 'none'
        }}>{progress}</View><View style={page === 'Coach' ? null : {
          display: 'none'
        }}>{coach}</View><View style={page === 'Assessment' ? null : {
          display: 'none'
        }}>{heading('Your starting point', 'Make it personal.', 'Your answers are saved to the shared coaching backend.')}{assessment}</View>
 <View style={s.notice}><Text style={{
            fontSize: 12,
            color: '#65715e'
          }}>Development build · Fictional data only. Login, draft assessments and workout practice sync are connected. Other screens are labelled design previews. Coaching activation remains unavailable.</Text></View>
 </ScrollView>{small && <View style={s.bottom}>{navigation}</View>}</View>
 <Modal visible={Boolean(dialog)} transparent animationType="fade" onRequestClose={() => setDialog(null)}><View style={s.overlay}><ScrollView contentContainerStyle={s.modal}><Action title="Close" outline onPress={() => setDialog(null)} />{dialog === 'meal' && <><Title>{estimate ? 'Confirm your meal' : 'Log a meal'}</Title><Sample /><Muted>Photo + description → confirm portion → save. Photo upload and analysis are not connected.</Muted><TextInput accessibilityLabel="Describe your meal" multiline value={portion} onChangeText={setPortion} style={s.input} />{estimate ? <><Text style={s.h3}>Illustrative macro estimate</Text><Muted>482 kcal · 28 g protein · 51 g carbs · 18 g fat. Fixed sample values; they do not change with your description. Ingredients, oil and portions need confirmation.</Muted><Action title="Save sample meal" dark onPress={() => {
                setMealSaved(true);
                setDialog(null);
              }} /></> : <Action title="Preview sample estimate →" dark onPress={() => setEstimate(true)} />}</>}{dialog === 'connections' && <><Title>Wearable connections</Title><Muted>Apple Health and Health Connect are planned. No device is connected. Coverage depends on available records and permissions; missing data is never zero. Direct vendor access remains unconfirmed.</Muted></>}{dialog === 'booking' && <><Title>Weekly coaching review</Title><Sample /><Muted>One-to-one video session · 30 minutes. No calendar or meeting provider is connected.</Muted>{['Thursday · 6:30 PM', 'Friday · 7:00 PM', 'Saturday · 10:00 AM'].map(time => <Action key={time} title={time} outline onPress={() => {
              setSlot(time);
              setDialog(null);
            }} />)}</>}{dialog === 'exercise' && <><Title>{selectedExercise?.name}</Title><Text style={{
              fontSize: 70,
              textAlign: 'center',
              marginVertical: 20
            }}>🏋</Text><Muted>Motion placeholder—not an instructional demonstration. Your trainer’s approved footage and technique cues will appear here.</Muted></>}{dialog === 'checkin' && <><Title>Your weekly check-in</Title><Sample /><Text style={s.h3}>Energy this week</Text><TextInput accessibilityLabel="Energy this week" value={energy} onChangeText={setEnergy} style={s.input} /><Text style={s.h3}>Average sleep (hours)</Text><TextInput accessibilityLabel="Average sleep hours" keyboardType="decimal-pad" value={sleep} onChangeText={setSleep} style={s.input} /><TextInput accessibilityLabel="A win or challenge" multiline value={checkin} onChangeText={setCheckin} placeholder="What would you like your coach to know?" style={s.input} /><Muted>Your text stays in this screen’s memory. Nothing is sent to your coach.</Muted><Action title="Keep sample check-in" dark onPress={() => setDialog(null)} /></>}</ScrollView></View></Modal>
 </SafeAreaView>;
}
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f0'
  },
  shell: {
    flex: 1,
    flexDirection: 'row'
  },
  sidebar: {
    backgroundColor: '#112e26',
    paddingHorizontal: 20,
    paddingVertical: 36
  },
  logo: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: 'white'
  },
  caption: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#bdcdc4',
    marginTop: 8,
    marginBottom: 35
  },
  navButton: {
    padding: 14,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  navText: {
    color: '#bdcdc4',
    fontSize: 15
  },
  icon: {
    color: '#bdcdc4',
    fontSize: 20
  },
  active: {
    backgroundColor: '#d8f684'
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#12382b',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8
  },
  bottomButton: {
    flexDirection: 'column',
    padding: 8,
    gap: 4
  },
  main: {
    width: '100%',
    maxWidth: 1600,
    alignSelf: 'center'
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderColor: '#dddfd6',
    paddingBottom: 23,
    flexWrap: 'wrap'
  },
  link: {
    color: '#315a3b',
    fontWeight: '600',
    fontSize: 12
  },
  heading: {
    marginTop: 33,
    marginBottom: 25
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#738172',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  h1: {
    fontSize: 37,
    fontWeight: '500',
    letterSpacing: -1.4,
    marginVertical: 8,
    color: '#202b27'
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -.5,
    color: '#202b27',
    marginBottom: 12
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202b27',
    marginVertical: 8
  },
  muted: {
    color: '#7b857c',
    fontSize: 13,
    lineHeight: 21
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e3e6dc',
    borderRadius: 17,
    padding: 25,
    marginBottom: 20,
    overflow: 'hidden'
  },
  hero: {
    backgroundColor: '#183e30',
    minHeight: 280
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -1,
    color: 'white',
    marginVertical: 20
  },
  heroArt: {
    position: 'absolute',
    right: 35,
    top: 30,
    width: 85,
    height: 150,
    borderWidth: 18,
    borderColor: '#a3bb8055',
    borderRadius: 70,
    transform: [{
      rotate: '-20deg'
    }]
  },
  heroArt2: {
    position: 'absolute',
    right: -15,
    top: 65,
    width: 85,
    height: 150,
    borderWidth: 18,
    borderColor: '#a3bb8055',
    borderRadius: 70,
    transform: [{
      rotate: '-20deg'
    }]
  },
  button: {
    backgroundColor: '#d8f684',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 9,
    alignSelf: 'flex-start',
    marginTop: 10
  },
  buttonText: {
    color: '#173c2c',
    fontWeight: '600',
    fontSize: 13
  },
  dark: {
    backgroundColor: '#183e30'
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d6ddcf'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22
  },
  stat: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e5da',
    borderRadius: 14,
    padding: 15
  },
  statValue: {
    fontSize: 26,
    fontWeight: '600',
    marginVertical: 10
  },
  tiny: {
    fontSize: 11,
    color: '#738172'
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16
  },
  day: {
    backgroundColor: '#f2f4eb',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center'
  },
  sample: {
    fontSize: 10,
    color: '#86622d',
    letterSpacing: 1,
    marginBottom: 8
  },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: '#799763',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bar: {
    height: 6,
    backgroundColor: '#edf0e6',
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 14,
    overflow: 'hidden'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderColor: '#edf0e9',
    flexWrap: 'wrap'
  },
  square: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eef1e2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notice: {
    padding: 16,
    backgroundColor: '#eceee4',
    borderRadius: 9,
    marginTop: 14
  },
  chart: {
    height: 180,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25
  },
  bubble: {
    backgroundColor: '#eff3e7',
    padding: 14,
    borderRadius: 14,
    marginVertical: 10
  },
  mine: {
    backgroundColor: '#1b4433',
    alignSelf: 'flex-end'
  },
  input: {
    padding: 13,
    borderWidth: 1,
    borderColor: '#d9ded1',
    borderRadius: 8,
    backgroundColor: '#fafbf7',
    marginVertical: 14,
    color: '#263e2e',
    fontSize: 15
  },
  message: {
    color: '#825d27',
    marginTop: 16
  },
  overlay: {
    flex: 1,
    backgroundColor: '#132d2580',
    justifyContent: 'center',
    padding: 20
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 510,
    alignSelf: 'center',
    marginVertical: 40
  }
});

import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal, StyleSheet, useWindowDimensions, SafeAreaView } from 'react-native';
import { Icon, WorkoutArt } from './ui/Visuals';
import release from './release.json';
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
  return <View style={s.item}><View style={s.square}><Icon name={icon === '◷' ? 'clock' : icon === '→' ? 'Train' : icon === '♡' ? 'shield' : icon === '☀' ? 'Nutrition' : 'spark'} /></View><View style={{
      flex: 1
    }}><Text style={s.h3}>{title}</Text><Muted>{sub}</Muted></View>{children}</View>;
}
function Sample() {
  return <Text style={s.sample}>Preview · Sample data</Text>;
}
export default function PrototypeClient({
  name,
  programme,
  assessment,
  training,
  message,
  onSignOut,
  busy,
  onNavigate
}) {
  const {
    width
  } = useWindowDimensions();
  const small = width < 650;
  const scroll = useRef(null);
  function navigate(next) {
    setPage(next);
    onNavigate?.();
    scroll.current?.scrollTo({
      y: 0,
      animated: false
    });
  }
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
  const firstName = (name || 'you').split(' ')[0];
  const home = <>
    <View style={[s.welcome, {
      marginTop: small ? 28 : 40
    }]}><View><Text style={s.eyebrow}>YOUR DAILY EDGE</Text><Text style={[s.welcomeTitle, {
          fontSize: small ? 36 : 48
        }]}>Good to see you, {firstName}.</Text><Text style={s.welcomeSub}>You don’t need a perfect day. Just your next good move.</Text></View><View style={s.dayBadge}><Icon name="spark" size={18} /><Text style={{
          fontSize: 11,
          color: '#536a48'
        }}>Make room for yourself</Text></View></View>
    {grid(<>
      <View style={[s.workoutHero, {
        minHeight: small ? 390 : 360
      }]}><View style={[s.workoutVisual, {
          width: small ? '76%' : '60%',
          right: small ? -35 : -10,
          top: small ? 18 : 20
        }]}><WorkoutArt /></View><View style={{
          position: 'relative',
          zIndex: 1
        }}><View style={s.heroPill}><View style={s.liveDot} /><Text style={s.heroPillText}>YOUR NEXT WORKOUT</Text></View><Text style={[s.bigHero, {
            fontSize: small ? 36 : 44
          }]}>A little stronger.{'\n'}Every single day.</Text><Text style={s.heroWorkout}>{programme?.title || 'Your coach is shaping your next chapter.'}</Text><Text style={s.heroMeta}>{programme ? `${programme.exercises.length} exercises  /  ${programme.exercises.reduce((n, e) => n + e.sets, 0)} sets  /  Your pace` : 'Your plan will appear here when it’s ready.'}</Text><Pressable accessibilityRole="button" accessibilityLabel="Start your workout →" onPress={() => navigate('Train')} style={s.heroCta}><View style={s.playCircle}><Icon name="play" size={15} /></View><Text style={s.heroCtaText}>Let’s train</Text><Icon name="arrow" size={20} /></Pressable><Text style={s.heroFine}>Practice mode · Activation pending</Text></View></View>
      <View style={s.nextRow}><View><Text style={s.eyebrow}>MAKE IT YOURS</Text><Text style={s.nextTitle}>Small things. Real momentum.</Text></View></View>
      <View style={s.quickGrid}>{[['Assessment', 'user', 'Your starting point', 'A few questions. A better plan.'], ['Nutrition', 'Nutrition', 'Fuel your day', 'Explore your nutrition space.'], ['Coach', 'Coach', 'In your corner', 'Coaching support, all together.']].map(([destination, icon, title, sub]) => <Pressable key={destination} accessibilityRole="button" accessibilityLabel={title} onPress={() => navigate(destination)} style={s.quickCard}><View style={s.quickIcon}><Icon name={icon} /></View><Text style={s.quickTitle}>{title}</Text><Text style={s.quickSub}>{sub}</Text><Icon name="arrow" size={17} color="#7e976e" /></Pressable>)}</View>
    </>, <>
      <View style={s.coachNote}><View style={s.row}><View style={s.coachAvatar}><Text style={{
              fontSize: 17,
              fontWeight: '700',
              color: '#436142'
            }}>fp.</Text></View><Text style={s.eyebrow}>COACH-LED. YOU-FOCUSED.</Text></View><Text style={s.quote}>“The best plan is the one that fits your life.”</Text><Text style={s.noteSub}>Tell your coach a little about your routine. They’ll help you find your rhythm.</Text><Pressable accessibilityRole="button" accessibilityLabel="Your assessment →" onPress={() => navigate('Assessment')} style={s.noteLink}><Text style={s.link}>Build your coaching profile</Text><Icon name="arrow" size={16} /></Pressable></View>
      <Card><View style={s.row}><View style={s.nutritionIcon}><Icon name="Nutrition" size={25} /></View><Text style={s.sample}>Nutrition preview</Text></View><Text style={s.fuelTitle}>Good fuel.{'\n'}Better days.</Text><Text style={s.noteSub}>A space for the food you love and the goals you’re working towards.</Text><View style={s.foodStrip}><View style={[s.foodDot, {
            backgroundColor: '#dee6b9'
          }]} /><View style={[s.foodDot, {
            backgroundColor: '#e5c6a4'
          }]} /><View style={[s.foodDot, {
            backgroundColor: '#b5c5a4'
          }]} /><Text style={s.tiny}>Built around your routine</Text></View><Action title="Explore nutrition →" outline onPress={() => navigate('Nutrition')} /></Card>
      <View style={s.connectionHint}><Icon name="shield" color="#78926c" size={18} /><Text style={s.connectionText}>Your workout progress stays on your device until you sync it.</Text></View>
    </>)}
  </>;
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
    }} onPress={() => navigate(p)} style={[s.navButton, small && s.bottomButton, page === p && s.active]}><Icon name={p} size={small ? 21 : 20} color={page === p ? '#d8f684' : '#8da193'} />{(small || width > 900) && <Text style={[s.navText, small && {
        fontSize: 10
      }, page === p && {
        color: '#e5f4d1',
        fontWeight: '600'
      }]}>{p}</Text>}{!small && page === p && <View style={s.navIndicator} />}</Pressable>)}</>;
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
            color: '#e4efdc',
            fontWeight: '600'
          }}>{name || 'Your account'}</Text><Text style={{
            color: '#bdcdc4',
            marginTop: 8
          }}>Your next stronger.</Text></View>}</View>}
 <ScrollView ref={scroll} style={{
        flex: 1
      }} contentContainerStyle={[s.main, {
        padding: small ? 18 : 30,
        paddingBottom: small ? 110 : 40
      }]} keyboardShouldPersistTaps="handled"><View style={s.top}><View><Text style={{
              fontWeight: '700',
              color: '#202b27'
            }}>FITPILOT / YOUR SPACE · {release.name}</Text><Muted>{new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}</Muted></View><View style={{
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center'
          }}><Pressable accessibilityRole="button" accessibilityLabel="Assessment" onPress={() => navigate('Assessment')}><View style={s.profileButton}><Icon name="user" size={17} /><Text style={s.link}>Profile</Text></View></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Sign out" disabled={busy} onPress={onSignOut}><Icon name="logout" size={18} color="#819277" /></Pressable></View></View>
 <View accessibilityLiveRegion="polite">{!!message && <Text style={s.message}>{message}</Text>}</View>
 <View style={page === 'Today' ? null : {
          display: 'none'
        }}>{home}</View>
 <View style={page === 'Train' ? null : {
          display: 'none'
        }}>{heading('SHOW UP FOR YOU', 'Your time. Your training.', 'Everything else can wait for a set.')}{training}<Card><Title>Movement library</Title><Muted>Technique previews · Coach-approved demonstrations coming later.</Muted>{(programme?.exercises || []).map(exercise => <Item key={exercise.id} icon="→" title={exercise.name} sub={`${exercise.sets} sets × ${exercise.reps} reps · ${exercise.restSeconds} sec rest`}><Action title={`Demo: ${exercise.name}`} outline onPress={() => {
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
        }}>{heading('LET’S GET TO KNOW YOU', 'This is about you.', 'A little context for a more personal coaching experience.')}{React.cloneElement(assessment, {
            onStepChange: () => scroll.current?.scrollTo({
              y: 0,
              animated: true
            })
          })}</View>
 <View style={s.notice}><Text style={{
            fontSize: 12,
            color: '#65715e'
          }}>Demo space · Fictional data. Workout practice and profile saving are connected. Other previews are labelled. Coaching activation pending.</Text></View>
 </ScrollView>{small && <View style={s.bottom}>{navigation}</View>}</View>
 <Modal visible={Boolean(dialog)} transparent animationType="fade" onRequestClose={() => setDialog(null)}><View style={s.overlay}><ScrollView contentContainerStyle={s.modal}><Action title="Close" outline onPress={() => setDialog(null)} />{dialog === 'meal' && <><Title>{estimate ? 'Confirm your meal' : 'Log a meal'}</Title><Sample /><Muted>Photo + description → confirm portion → save. Photo upload and analysis are not connected.</Muted><TextInput accessibilityLabel="Describe your meal" multiline value={portion} onChangeText={setPortion} style={s.input} />{estimate ? <><Text style={s.h3}>Illustrative macro estimate</Text><Muted>482 kcal · 28 g protein · 51 g carbs · 18 g fat. Fixed sample values; they do not change with your description. Ingredients, oil and portions need confirmation.</Muted><Action title="Save sample meal" dark onPress={() => {
                setMealSaved(true);
                setDialog(null);
              }} /></> : <Action title="Preview sample estimate →" dark onPress={() => setEstimate(true)} />}</>}{dialog === 'connections' && <><Title>Wearable connections</Title><Muted>Apple Health and Health Connect are planned. No device is connected. Coverage depends on available records and permissions; missing data is never zero. Direct vendor access remains unconfirmed.</Muted></>}{dialog === 'booking' && <><Title>Weekly coaching review</Title><Sample /><Muted>One-to-one video session · 30 minutes. No calendar or meeting provider is connected.</Muted>{['Thursday · 6:30 PM', 'Friday · 7:00 PM', 'Saturday · 10:00 AM'].map(time => <Action key={time} title={time} outline onPress={() => {
              setSlot(time);
              setDialog(null);
            }} />)}</>}{dialog === 'exercise' && <><Title>{selectedExercise?.name}</Title><View style={{
              backgroundColor: '#163b2c',
              borderRadius: 18,
              marginVertical: 16
            }}><WorkoutArt small /></View><Muted>Motion placeholder—not an instructional demonstration. Your trainer’s approved footage and technique cues will appear here.</Muted></>}{dialog === 'checkin' && <><Title>Your weekly check-in</Title><Sample /><Text style={s.h3}>Energy this week</Text><TextInput accessibilityLabel="Energy this week" value={energy} onChangeText={setEnergy} style={s.input} /><Text style={s.h3}>Average sleep (hours)</Text><TextInput accessibilityLabel="Average sleep hours" keyboardType="decimal-pad" value={sleep} onChangeText={setSleep} style={s.input} /><TextInput accessibilityLabel="A win or challenge" multiline value={checkin} onChangeText={setCheckin} placeholder="What would you like your coach to know?" style={s.input} /><Muted>Your text stays in this screen’s memory. Nothing is sent to your coach.</Muted><Action title="Keep sample check-in" dark onPress={() => setDialog(null)} /></>}</ScrollView></View></Modal>
 </SafeAreaView>;
}
const base = StyleSheet.create({
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
const s = {
  ...base,
  ...StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: '#f6f7f2'
    },
    sidebar: {
      backgroundColor: '#142c24',
      paddingHorizontal: 18,
      paddingVertical: 34
    },
    logo: {
      fontSize: 29,
      fontWeight: '800',
      letterSpacing: -1.5,
      color: '#f2f6e9',
      paddingHorizontal: 12
    },
    caption: {
      fontSize: 8,
      letterSpacing: 2.3,
      color: '#6f8879',
      marginTop: 9,
      marginBottom: 48,
      paddingHorizontal: 13
    },
    navButton: {
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 13,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      position: 'relative'
    },
    active: {
      backgroundColor: '#244335'
    },
    navText: {
      color: '#8da193',
      fontSize: 13
    },
    navIndicator: {
      width: 4,
      height: 4,
      borderRadius: 3,
      backgroundColor: '#d8f684',
      marginLeft: 'auto'
    },
    bottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#142c24',
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20
    },
    bottomButton: {
      flexDirection: 'column',
      paddingHorizontal: 13,
      paddingVertical: 10,
      gap: 6
    },
    top: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 14,
      paddingBottom: 22,
      borderBottomWidth: 1,
      borderColor: '#e6eadf',
      flexWrap: 'wrap'
    },
    profileButton: {
      flexDirection: 'row',
      gap: 7,
      alignItems: 'center',
      backgroundColor: '#ecf1e5',
      padding: 10,
      borderRadius: 12
    },
    heading: {
      marginTop: 32,
      marginBottom: 24
    },
    h1: {
      fontSize: 38,
      fontWeight: '600',
      letterSpacing: -1.5,
      color: '#19372a',
      marginVertical: 8
    },
    h2: {
      fontSize: 20,
      fontWeight: '600',
      letterSpacing: -.6,
      color: '#284331',
      marginBottom: 12
    },
    card: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#e9eee3',
      borderRadius: 24,
      padding: 26,
      marginBottom: 20,
      overflow: 'hidden'
    },
    button: {
      backgroundColor: '#d8f684',
      paddingVertical: 14,
      paddingHorizontal: 19,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 12
    },
    outline: {
      backgroundColor: '#f1f5eb',
      borderWidth: 0
    },
    muted: {
      color: '#81907e',
      fontSize: 13,
      lineHeight: 22
    },
    sample: {
      fontSize: 10,
      color: '#6d7b60',
      marginBottom: 8
    },
    notice: {
      paddingVertical: 17,
      paddingHorizontal: 4,
      marginTop: 24,
      borderTopWidth: 1,
      borderColor: '#e4eadb'
    },
    eyebrow: {
      fontSize: 9,
      letterSpacing: 1.8,
      color: '#6d7d61',
      fontWeight: '700',
      marginBottom: 8,
      textTransform: 'uppercase'
    },
    welcome: {
      marginBottom: 30,
      gap: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    welcomeTitle: {
      fontWeight: '600',
      letterSpacing: -1.9,
      color: '#1a382a',
      marginVertical: 7
    },
    welcomeSub: {
      fontSize: 14,
      lineHeight: 23,
      color: '#6d7c63',
      maxWidth: 400
    },
    dayBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 9,
      paddingHorizontal: 12,
      borderRadius: 22,
      backgroundColor: '#edf3e3'
    },
    workoutHero: {
      borderRadius: 27,
      backgroundColor: '#173e2e',
      padding: 30,
      overflow: 'hidden',
      marginBottom: 26
    },
    workoutVisual: {
      position: 'absolute',
      opacity: .85
    },
    heroPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: '#446444',
      borderRadius: 20,
      paddingVertical: 7,
      paddingHorizontal: 11
    },
    liveDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: '#d8f684'
    },
    heroPillText: {
      color: '#c1d29e',
      fontSize: 8,
      fontWeight: '700',
      letterSpacing: 1.4
    },
    bigHero: {
      fontWeight: '600',
      letterSpacing: -1.6,
      color: '#f4f8e9',
      marginTop: 30,
      marginBottom: 19,
      lineHeight: 49
    },
    heroWorkout: {
      fontSize: 14,
      fontWeight: '600',
      color: '#b7c9a9',
      maxWidth: 280
    },
    heroMeta: {
      fontSize: 10,
      color: '#83a17b',
      marginTop: 8,
      marginBottom: 26
    },
    heroCta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: '#d8f684',
      padding: 13,
      paddingRight: 20,
      borderRadius: 14,
      alignSelf: 'flex-start'
    },
    heroCtaText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#24402a'
    },
    playCircle: {
      backgroundColor: '#c1e16e',
      width: 29,
      height: 29,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center'
    },
    heroFine: {
      fontSize: 10,
      color: '#b1c89e',
      marginTop: 13
    },
    nextRow: {
      marginBottom: 20,
      marginTop: 2
    },
    nextTitle: {
      fontSize: 21,
      fontWeight: '600',
      letterSpacing: -.5,
      color: '#3d5639'
    },
    quickGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 22
    },
    quickCard: {
      flex: 1,
      minWidth: 145,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#e8eee0',
      borderRadius: 20,
      padding: 20,
      gap: 9
    },
    quickIcon: {
      width: 39,
      height: 39,
      borderRadius: 12,
      backgroundColor: '#f0f5e8',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 9
    },
    quickTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#3b5534'
    },
    quickSub: {
      fontSize: 11,
      lineHeight: 18,
      color: '#8c997e',
      marginBottom: 6
    },
    coachNote: {
      backgroundColor: '#eaf0df',
      borderRadius: 24,
      padding: 26,
      marginBottom: 20
    },
    coachAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#d5e2c5',
      alignItems: 'center',
      justifyContent: 'center'
    },
    quote: {
      fontSize: 25,
      lineHeight: 34,
      fontWeight: '500',
      letterSpacing: -.7,
      color: '#3e5b35',
      marginVertical: 20
    },
    noteSub: {
      fontSize: 12,
      lineHeight: 21,
      color: '#819175'
    },
    noteLink: {
      marginTop: 22,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center'
    },
    nutritionIcon: {
      width: 46,
      height: 46,
      backgroundColor: '#f0f5e7',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20
    },
    fuelTitle: {
      fontSize: 29,
      fontWeight: '600',
      letterSpacing: -.8,
      color: '#3e5734',
      marginBottom: 16
    },
    foodStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      marginVertical: 20,
      flexWrap: 'wrap'
    },
    foodDot: {
      width: 17,
      height: 17,
      borderRadius: 9
    },
    connectionHint: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      padding: 8
    },
    connectionText: {
      fontSize: 11,
      color: '#8a9c7d',
      lineHeight: 18,
      flex: 1
    }
  })
};

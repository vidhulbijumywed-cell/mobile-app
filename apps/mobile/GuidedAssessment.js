import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard } from 'react-native';
import { Icon } from './ui/Visuals';
const steps = [{
  number: '01',
  title: 'What are we working towards?',
  sub: 'A little about you helps your coach make this personal.',
  fields: [['displayName', 'Preferred name'], ['goal', 'What would you like coaching to help you achieve?']],
  key: 'goal',
  choices: ['Build strength', 'Feel fitter', 'Build a consistent routine']
}, {
  number: '02',
  title: 'Make training fit your life.',
  sub: 'There’s no perfect starting point. Just your starting point.',
  fields: [['trainingHistory', 'Training experience'], ['availability', 'Days and time available'], ['equipment', 'Equipment you have access to']],
  key: 'trainingHistory',
  choices: ['Just getting started', 'Some experience', 'Training regularly']
}, {
  number: '03',
  title: 'Food that works for you.',
  sub: 'Tell your coach what you enjoy. You can refine this together.',
  fields: [['dietaryPreferences', 'Food preferences']],
  key: 'dietaryPreferences',
  choices: ['Vegetarian', 'Non-vegetarian', 'Vegan', 'No preference']
}];
export default function GuidedAssessment({
  answers,
  onChange,
  onSave,
  busy,
  savedAt,
  onStepChange
}) {
  const [step, setStep] = useState(0);
  function changeStep(next) {
    Keyboard.dismiss();
    setStep(next);
    onStepChange?.();
  }
  const current = steps[step];
  return <View style={s.card}><View style={s.row}><Text style={s.kicker}>YOUR COACHING PROFILE</Text><Text style={s.step}>{step + 1} of 3</Text></View><View style={s.progress}>{steps.map((_, i) => <View key={i} style={[s.segment, i <= step && {
        backgroundColor: '#387458'
      }]} />)}</View>
 <Text style={s.title}>{current.title}</Text><Text style={s.sub}>{current.sub}</Text>
 <View style={s.chips}>{current.choices.map(choice => <Pressable key={choice} accessibilityRole="button" accessibilityState={{
        selected: answers[current.key] === choice
      }} onPress={() => onChange({
        ...answers,
        [current.key]: choice
      })} style={[s.chip, answers[current.key] === choice && s.selected]}><Text style={s.chipText}>{choice}</Text>{answers[current.key] === choice && <Icon name="check" size={16} />}</Pressable>)}</View>
 {current.fields.map(([key, label]) => <View key={key} style={s.field}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} value={typeof answers[key] === 'string' ? answers[key] : ''} onChangeText={text => onChange({
        ...answers,
        [key]: text
      })} placeholder={key === 'displayName' ? 'What should we call you?' : 'In your own words…'} multiline={key !== 'displayName'} style={[s.input, key !== 'displayName' && {
        minHeight: 82,
        textAlignVertical: 'top'
      }]} /></View>)}
 <View style={s.row}>{step > 0 ? <Pressable accessibilityRole="button" onPress={() => changeStep(step - 1)}><Text style={s.link}>← Back</Text></Pressable> : <Text style={s.note}>All questions are optional for now.</Text>}
 {step < 2 ? <Pressable accessibilityRole="button" accessibilityLabel="Continue assessment" onPress={() => changeStep(step + 1)} style={s.primary}><Text style={s.primaryText}>Continue</Text><Icon name="arrow" size={18} color="white" /></Pressable> : <Pressable accessibilityRole="button" accessibilityLabel="Save profile" disabled={busy} onPress={onSave} style={s.primary}><Text style={s.primaryText}>{busy ? 'Saving…' : 'Save my profile'}</Text><Icon name="check" color="white" size={18} /></Pressable>}</View>
 <View style={s.saveRow}><Pressable accessibilityRole="button" accessibilityLabel="Save draft" disabled={busy} onPress={onSave}><Text style={s.link}>Save & finish later</Text></Pressable><Text style={s.note}>{savedAt ? 'Draft saved' : 'Not saved yet'}</Text></View><Text style={s.fine}>Your coach will confirm the full assessment. Unsaved edits stay on this screen only.</Text>
 </View>;
}
const s = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 28,
    borderRadius: 24,
    maxWidth: 740,
    borderWidth: 1,
    borderColor: '#e8ede6'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap'
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 1.8,
    color: '#6c7b6f',
    fontWeight: '700'
  },
  step: {
    fontSize: 12,
    color: '#708074'
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
    marginBottom: 28
  },
  segment: {
    height: 4,
    flex: 1,
    backgroundColor: '#e8eee5',
    borderRadius: 4
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: -1,
    color: '#183d2d'
  },
  sub: {
    fontSize: 15,
    color: '#728074',
    lineHeight: 24,
    marginVertical: 12
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 24
  },
  chip: {
    borderWidth: 1,
    borderColor: '#dce6d8',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  selected: {
    borderColor: '#66965b',
    backgroundColor: '#edf5e5'
  },
  chipText: {
    fontSize: 13,
    color: '#284936'
  },
  field: {
    marginBottom: 20
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4c6152',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#dde6d9',
    borderRadius: 13,
    padding: 15,
    fontSize: 16,
    color: '#203c2c',
    backgroundColor: '#fbfcf9'
  },
  primary: {
    backgroundColor: '#214d38',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 13,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center'
  },
  primaryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  },
  link: {
    color: '#365e42',
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 12
  },
  note: {
    color: '#809080',
    fontSize: 11
  },
  saveRow: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#edf0e9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  fine: {
    fontSize: 11,
    lineHeight: 18,
    color: '#829080'
  }
});

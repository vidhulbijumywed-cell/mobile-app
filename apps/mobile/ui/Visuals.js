import React from 'react';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
export function Icon({
  name,
  size = 22,
  color = '#173d31'
}) {
  const paths = {
    Today: 'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
    Train: 'm4 9 5-5m6 16 5-5M2 7l5-5m10 20 5-5M7 7l10 10M5 11l6-6m2 14 6-6',
    Nutrition: 'M12 21c-5-3-8-7-8-11 0-4 4-6 8-3 4-3 8-1 8 3 0 4-3 8-8 11M12 6c0-3 2-4 5-4',
    Progress: 'M4 20V12m8 8V4m8 16V8',
    Coach: 'M4 5h16v12H9l-5 4V5Zm4 4h8m-8 4h5',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    check: 'm5 12 4 4L19 6',
    clock: 'M12 7v5l3 2',
    user: 'M4 21c0-5 16-5 16 0M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    refresh: 'M20 7a8 8 0 1 0 1 8M20 2v6h-6',
    logout: 'M10 4H4v16h6m3-8h8m-4-4 4 4-4 4',
    chevron: 'm9 5 7 7-7 7',
    shield: 'M12 2 4 5v6c0 5 8 10 8 10s8-5 8-10V5l-8-3Z',
    play: 'm8 4 12 8-12 8V4Z',
    spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',
    close: 'm6 6 12 12M6 18 18 6'
  };
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityElementsHidden><Path d={paths[name] || paths.spark} stroke={color} strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" />{name === 'clock' && <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.65} />}</Svg>;
}
export function WorkoutArt({
  small = false
}) {
  return <Svg width="100%" height={small ? 140 : 250} viewBox="0 0 400 280" accessibilityLabel="Decorative dumbbell artwork">
  <Defs><LinearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#b5c8ac" /><Stop offset=".45" stopColor="#536e60" /><Stop offset="1" stopColor="#1c372d" /></LinearGradient><LinearGradient id="lime" x1="0" y1="0" x2="1" y2="1"><Stop stopColor="#e4ffa0" /><Stop offset="1" stopColor="#9fbf58" /></LinearGradient></Defs>
  <Circle cx="225" cy="140" r="115" fill="none" stroke="#ffffff0f" strokeWidth="1" /><Circle cx="225" cy="140" r="85" fill="none" stroke="#ffffff14" strokeWidth="1" />
  <G transform="translate(65,25) rotate(-27 150 115)"><Rect x="65" y="106" width="180" height="21" rx="10" fill="url(#metal)" /><Path d="M113 109v14m6-14v14m6-14v14m6-14v14m6-14v14m6-14v14m6-14v14m6-14v14m6-14v14m6-14v14m6-14v14m6-14v14m6-14v14" stroke="#c3d1be" strokeWidth="1" opacity=".5" />
  <Rect x="46" y="58" width="43" height="116" rx="13" fill="url(#metal)" stroke="#82987b" /><Rect x="31" y="72" width="21" height="88" rx="7" fill="#203c30" stroke="#688164" />
  <Rect x="216" y="58" width="43" height="116" rx="13" fill="url(#lime)" /><Rect x="253" y="72" width="21" height="88" rx="7" fill="#94b75c" /><Path d="M226 71v90" stroke="#eeffc7" opacity=".55" strokeWidth="2" />
  </G><Circle cx="330" cy="55" r="4" fill="#d8f684" /><Path d="M70 220h32m-16-16v32" stroke="#d8f684" opacity=".5" />
 </Svg>;
}

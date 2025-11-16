/**
 * Just The Two Of Us - Grover Washington Jr. feat. Bill Withers
 * Key: F minor
 * Famous smooth jazz-R&B chord progression
 *
 * Original progression: Dbmaj7 - C7(♭9) - Fm7 - Ebm7 A♭7
 * This is a double-time modified reordering of "Sunny" chord progression
 */

import { Section } from '../../types';

export const justTheTwoOfUs: Section[] = [
  {
    id: 'intro',
    name: 'Intro',
    key: { tonic: 'C#', mode: 'major' },
    chords: [
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'B', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'A#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      { root: 'A', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 1.5 },
      { root: 'F#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2.5 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'B', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'A#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      { root: 'A', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 1.5 },
      { root: 'F#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2.5 },
    ]
  },
  {
    id: 'verse',
    name: 'Verse',
    key: { tonic: 'F', mode: 'minor' },
    chords: [
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 2 },
      { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 1 },
      { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 1 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 2 },
      { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 1 },
      { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 1 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
    ]
  },
  {
    id: 'chorus',
    name: 'Chorus',
    key: { tonic: 'F', mode: 'minor' },
    chords: [
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 1 },
      { root: 'E', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 1 },
      { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 1 },
      { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 1 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 1 },
      { root: 'E', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 1 },
      { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 1 },
      { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 1 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
    ]
  },
  {
    id: 'Outro',
    name: 'Outro',
    key: { tonic: 'C#', mode: 'major' },
    chords: [
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'B', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'A#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      { root: 'A', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 1.5 },
      { root: 'F#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2.5 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 2 },
      { root: 'B', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'A#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      { root: 'A', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 2 },
      { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 1.5 },
      { root: 'F#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2.5 },
    ]
  }
];

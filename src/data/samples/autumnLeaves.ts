/**
 * Autumn Leaves
 * Key: G minor
 * Famous jazz
 */

import { Section } from '../../types';

export const autumnLeaves: Section[] = [
  {
    id: 'A1-Bb',
    name: 'A1-Bb',
    key: { tonic: 'A#', mode: 'major' },
    chords: [
      { root: 'C', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'F', quality: 'major', seventh: '7', tensions: [9], alterations: [], duration: 4 },
      { root: 'A#', quality: 'major', seventh: 'maj7', tensions: [9], alterations: [], duration: 4 },
      { root: 'D#', quality: 'major', seventh: 'maj7', tensions: [9], alterations: [], duration: 4 },
    ]
  },
  {
    id: 'A1-Gm',
    name: 'A1-Gm',
    key: { tonic: 'G', mode: 'minor' },
    chords: [
      { root: 'A', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'D', quality: 'major', seventh: '7', tensions: [9], alterations: [], duration: 4 },
      { root: 'G', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'G', quality: 'major', seventh: '7', tensions: [], alterations: ['b9','b13'], duration: 4 },
    ]
  },
  {
    id: 'A2-Bb',
    name: 'A2-Bb',
    key: { tonic: 'A#', mode: 'major' },
    chords: [
      { root: 'C', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'F', quality: 'major', seventh: '7', tensions: [9], alterations: [], duration: 4 },
      { root: 'A#', quality: 'major', seventh: 'maj7', tensions: [9], alterations: [], duration: 4 },
      { root: 'D#', quality: 'major', seventh: 'maj7', tensions: [9], alterations: [], duration: 4 },
    ]
  },
  {
    id: 'A2-Gm',
    name: 'A2-Gm',
    key: { tonic: 'G', mode: 'minor' },
    chords: [
      { root: 'A', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'D', quality: 'major', seventh: '7', tensions: [9], alterations: [], duration: 4 },
      { root: 'G', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'G', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
    ]
  },
  {
    id: 'B-Gm',
    name: 'B-Gm',
    key: { tonic: 'G', mode: 'minor' },
    chords: [
      { root: 'A', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'D', quality: 'major', seventh: '7', tensions: [9], alterations: [], duration: 4 },
      { root: 'G', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'G', quality: 'major', seventh: '7', tensions: [], alterations: ['b9','b13'], duration: 4 },
    ]
  },
  {
    id: 'B-Bb',
    name: 'B-Bb',
    key: { tonic: 'A#', mode: 'major' },
    chords: [
      { root: 'C', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'F', quality: 'major', seventh: '7', tensions: [9], alterations: [], duration: 4 },
      { root: 'A#', quality: 'major', seventh: 'maj7', tensions: [9], alterations: [], duration: 4 },
      { root: 'D#', quality: 'major', seventh: 'maj7', tensions: [9], alterations: [], duration: 4 },
    ]
  },
  {
    id: 'C1-Gm',
    name: 'C1-Gm',
    key: { tonic: 'G', mode: 'minor' },
    chords: [
      { root: 'A', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'D', quality: 'major', seventh: '7', tensions: [9], alterations: [], duration: 4 },
      { root: 'G', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 2 },
      { root: 'F#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      { root: 'F', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 2 },
      { root: 'E', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
    ]
  },
  {
    id: 'C2-Gm',
    name: 'C2-Gm',
    key: { tonic: 'G', mode: 'minor' },
    chords: [
      { root: 'D#', quality: 'major', seventh: '7', tensions: [9], alterations: [], duration: 4 },
      { root: 'D', quality: 'major', seventh: '7', tensions: [9], alterations: [], duration: 4 },
      { root: 'G', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
      { root: 'G', quality: 'minor', seventh: 'm7', tensions: [9], alterations: [], duration: 4 },
    ]
  },
];

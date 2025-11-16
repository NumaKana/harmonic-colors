/**
 * Sample chord progressions
 * Provides pre-made chord progressions for users to explore
 */

import { Section } from '../types';

export interface SampleSong {
  id: string;
  title: string;
  artist?: string;
  sections: Section[];
}

/**
 * Just The Two Of Us - Grover Washington Jr.
 * Key: C# Major (Db Major enharmonic equivalent)
 * Famous for its smooth jazz progression
 */
const justTheTwoOfUs: SampleSong = {
  id: 'just-the-two-of-us',
  title: 'Just The Two Of Us',
  artist: 'Grover Washington Jr.',
  sections: [
    {
      id: 'intro',
      name: 'Intro',
      key: { tonic: 'C#', mode: 'major' },
      chords: [
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
      ]
    },
    {
      id: 'verse',
      name: 'Verse',
      key: { tonic: 'C#', mode: 'major' },
      chords: [
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'F', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'G', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'A', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 4 },
      ]
    },
    {
      id: 'chorus',
      name: 'Chorus',
      key: { tonic: 'C#', mode: 'major' },
      chords: [
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'C', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'C#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'A', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 4 },
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
      ]
    }
  ]
};

/**
 * Collection of all sample songs
 * Currently includes only one sample, but designed for future expansion
 */
export const sampleSongs: SampleSong[] = [
  justTheTwoOfUs
];

/**
 * Get a sample song by ID
 */
export function getSampleSong(id: string): SampleSong | undefined {
  return sampleSongs.find(song => song.id === id);
}

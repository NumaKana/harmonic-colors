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
 * Just The Two Of Us - Grover Washington Jr. feat. Bill Withers
 * Key: F minor
 * Famous smooth jazz-R&B chord progression
 *
 * Original progression: Dbmaj7 - C7(♭9) - Fm7 - Ebm7 A♭7
 * This is a double-time modified reordering of "Sunny" chord progression
 */
const justTheTwoOfUs: SampleSong = {
  id: 'just-the-two-of-us',
  title: 'Just The Two Of Us',
  artist: 'Grover Washington Jr. feat. Bill Withers',
  sections: [
    {
      id: 'intro',
      name: 'Intro',
      key: { tonic: 'F', mode: 'minor' },
      chords: [
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 4 },
        { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 2 },
        { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      ]
    },
    {
      id: 'verse',
      name: 'Verse',
      key: { tonic: 'F', mode: 'minor' },
      chords: [
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 4 },
        { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 2 },
        { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 4 },
        { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 2 },
        { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
      ]
    },
    {
      id: 'chorus',
      name: 'Chorus',
      key: { tonic: 'F', mode: 'minor' },
      chords: [
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 4 },
        { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'E', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 2 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 2 },
        { root: 'C#', quality: 'major', seventh: 'maj7', tensions: [], alterations: [], duration: 4 },
        { root: 'C', quality: 'major', seventh: '7', tensions: [], alterations: ['b9'], duration: 4 },
        { root: 'F', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 4 },
        { root: 'D#', quality: 'minor', seventh: 'm7', tensions: [], alterations: [], duration: 2 },
        { root: 'G#', quality: 'major', seventh: '7', tensions: [], alterations: [], duration: 2 },
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

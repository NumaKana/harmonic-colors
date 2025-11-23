/**
 * Sample chord progressions index
 * Each sample is stored in a separate file for easy management
 */

import { Section } from '../../types';
import { justTheTwoOfUs } from './justTheTwoOfUs';
import { autumnLeaves } from './autumnLeaves';
import { loveSoSweet } from './loveSoSweet';

export interface SampleSong {
  id: string;
  title: string;
  artist?: string;
  description?: string;
  bpm?: number;
  sections: Section[];
}

/**
 * All available sample songs
 * Add new samples here after creating a separate file
 */
export const sampleSongs: SampleSong[] = [
  {
    id: 'just-the-two-of-us',
    title: 'Just The Two Of Us',
    artist: 'Grover Washington Jr. feat. Bill Withers',
    description: 'Famous smooth jazz-R&B chord progression in F minor',
    bpm: 98,
    sections: justTheTwoOfUs
  },
  {
    id: 'autumn-leaves',
    title: 'Autumn Leaves',
    description: 'Classic jazz standard with key modulation',
    bpm: 140,
    sections: autumnLeaves
  },
{
    id: 'love-so-sweet',
    title: 'Love so Sweet',
    artist: 'Arashi',
    bpm: 139,
    sections: loveSoSweet
  }
  // Add more samples here:
  // {
  //   id: 'sample-id',
  //   title: 'Sample Title',
  //   artist: 'Artist Name',
  //   description: 'Description',
  //   sections: importedSections
  // }
];

/**
 * Get a sample song by ID
 */
export function getSampleSong(id: string): SampleSong | undefined {
  return sampleSongs.find(song => song.id === id);
}

import { Key, Note, Chord } from '../types';

const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Get the index of a note in the chromatic scale
 */
function getNoteIndex(note: Note): number {
  return NOTES.indexOf(note);
}

/**
 * Get a note by adding semitones to a root note
 */
function getNote(root: Note, semitones: number): Note {
  const rootIndex = getNoteIndex(root);
  const newIndex = (rootIndex + semitones) % 12;
  return NOTES[newIndex];
}

/**
 * Generate diatonic chords for a given key
 */
export function getDiatonicChords(key: Key): Chord[] {
  const { tonic, mode } = key;

  if (mode === 'major') {
    // Major key: I, ii, iii, IV, V, vi, vii°
    return [
      { root: getNote(tonic, 0), quality: 'major', tensions: [], alterations: [], duration: 4 },      // I
      { root: getNote(tonic, 2), quality: 'minor', tensions: [], alterations: [], duration: 4 },      // ii
      { root: getNote(tonic, 4), quality: 'minor', tensions: [], alterations: [], duration: 4 },      // iii
      { root: getNote(tonic, 5), quality: 'major', tensions: [], alterations: [], duration: 4 },      // IV
      { root: getNote(tonic, 7), quality: 'major', tensions: [], alterations: [], duration: 4 },      // V
      { root: getNote(tonic, 9), quality: 'minor', tensions: [], alterations: [], duration: 4 },      // vi
      { root: getNote(tonic, 11), quality: 'diminished', tensions: [], alterations: [], duration: 4 }, // vii°
    ];
  } else {
    // Minor key: i, ii°, III, iv, v, VI, VII
    return [
      { root: getNote(tonic, 0), quality: 'minor', tensions: [], alterations: [], duration: 4 },       // i
      { root: getNote(tonic, 2), quality: 'diminished', tensions: [], alterations: [], duration: 4 },  // ii°
      { root: getNote(tonic, 3), quality: 'major', tensions: [], alterations: [], duration: 4 },       // III
      { root: getNote(tonic, 5), quality: 'minor', tensions: [], alterations: [], duration: 4 },       // iv
      { root: getNote(tonic, 7), quality: 'minor', tensions: [], alterations: [], duration: 4 },       // v
      { root: getNote(tonic, 8), quality: 'major', tensions: [], alterations: [], duration: 4 },       // VI
      { root: getNote(tonic, 10), quality: 'major', tensions: [], alterations: [], duration: 4 },      // VII
    ];
  }
}

/**
 * Get the roman numeral for a diatonic chord
 */
export function getRomanNumeral(key: Key, chordIndex: number): string {
  const { mode } = key;

  if (mode === 'major') {
    const numerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
    return numerals[chordIndex] || '';
  } else {
    const numerals = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
    return numerals[chordIndex] || '';
  }
}

/**
 * Get a display name for a chord
 */
export function getChordDisplayName(chord: Chord): string {
  const { root, quality, seventh, tensions, alterations } = chord;

  let name = root;

  // Seventh determines the full chord type (takes precedence over quality)
  if (seventh) {
    if (seventh === '7') {
      // Dominant 7th: C7
      name += '7';
    } else if (seventh === 'maj7') {
      // Major 7th: Cmaj7
      name += 'maj7';
    } else if (seventh === 'm7') {
      // Minor 7th: Cm7
      name += 'm7';
    } else if (seventh === 'm7b5') {
      // Half-diminished: Cm7♭5
      name += 'm7♭5';
    } else if (seventh === 'dim7') {
      // Diminished 7th: Cdim7
      name += 'dim7';
    } else if (seventh === 'aug7') {
      // Augmented 7th: Caug7
      name += 'aug7';
    }
  } else {
    // No seventh - use quality
    if (quality === 'minor') {
      name += 'm';
    } else if (quality === 'diminished') {
      name += 'dim';
    } else if (quality === 'augmented') {
      name += 'aug';
    }
  }

  // Add tensions (in parentheses if present)
  if (tensions.length > 0) {
    name += '(' + tensions.join(',') + ')';
  }

  // Add alterations (in parentheses if present)
  if (alterations.length > 0) {
    name += '(' + alterations.join(',') + ')';
  }

  return name;
}

import { Key, Note, Chord, MinorScaleType } from '../types';

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
export function getDiatonicChords(key: Key, minorScaleType: MinorScaleType = 'melodic'): Chord[] {
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
    // Minor key - varies by scale type
    if (minorScaleType === 'natural') {
      // Natural minor: i, ii°, III, iv, v, VI, VII
      return [
        { root: getNote(tonic, 0), quality: 'minor', tensions: [], alterations: [], duration: 4 },       // i
        { root: getNote(tonic, 2), quality: 'diminished', tensions: [], alterations: [], duration: 4 },  // ii°
        { root: getNote(tonic, 3), quality: 'major', tensions: [], alterations: [], duration: 4 },       // III
        { root: getNote(tonic, 5), quality: 'minor', tensions: [], alterations: [], duration: 4 },       // iv
        { root: getNote(tonic, 7), quality: 'minor', tensions: [], alterations: [], duration: 4 },       // v
        { root: getNote(tonic, 8), quality: 'major', tensions: [], alterations: [], duration: 4 },       // VI
        { root: getNote(tonic, 10), quality: 'major', tensions: [], alterations: [], duration: 4 },      // VII
      ];
    } else if (minorScaleType === 'harmonic') {
      // Harmonic minor: i, ii°, III+, iv, V, VI, vii°
      return [
        { root: getNote(tonic, 0), quality: 'minor', tensions: [], alterations: [], duration: 4 },       // i
        { root: getNote(tonic, 2), quality: 'diminished', tensions: [], alterations: [], duration: 4 },  // ii°
        { root: getNote(tonic, 3), quality: 'augmented', tensions: [], alterations: [], duration: 4 },   // III+
        { root: getNote(tonic, 5), quality: 'minor', tensions: [], alterations: [], duration: 4 },       // iv
        { root: getNote(tonic, 7), quality: 'major', tensions: [], alterations: [], duration: 4 },       // V (raised 7th)
        { root: getNote(tonic, 8), quality: 'major', tensions: [], alterations: [], duration: 4 },       // VI
        { root: getNote(tonic, 11), quality: 'diminished', tensions: [], alterations: [], duration: 4 }, // vii°
      ];
    } else {
      // Melodic minor (ascending): i, ii, III+, IV, V, vi°, vii°
      return [
        { root: getNote(tonic, 0), quality: 'minor', tensions: [], alterations: [], duration: 4 },       // i
        { root: getNote(tonic, 2), quality: 'minor', tensions: [], alterations: [], duration: 4 },       // ii (raised 6th)
        { root: getNote(tonic, 3), quality: 'augmented', tensions: [], alterations: [], duration: 4 },   // III+
        { root: getNote(tonic, 5), quality: 'major', tensions: [], alterations: [], duration: 4 },       // IV (raised 6th)
        { root: getNote(tonic, 7), quality: 'major', tensions: [], alterations: [], duration: 4 },       // V (raised 7th)
        { root: getNote(tonic, 9), quality: 'diminished', tensions: [], alterations: [], duration: 4 },  // vi° (raised 6th)
        { root: getNote(tonic, 11), quality: 'diminished', tensions: [], alterations: [], duration: 4 }, // vii° (raised 7th)
      ];
    }
  }
}

/**
 * Get the roman numeral for a diatonic chord
 */
export function getRomanNumeral(key: Key, chordIndex: number, minorScaleType: MinorScaleType = 'melodic'): string {
  const { mode } = key;

  if (mode === 'major') {
    const numerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
    return numerals[chordIndex] || '';
  } else {
    if (minorScaleType === 'natural') {
      const numerals = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
      return numerals[chordIndex] || '';
    } else if (minorScaleType === 'harmonic') {
      const numerals = ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'];
      return numerals[chordIndex] || '';
    } else {
      // Melodic minor
      const numerals = ['i', 'ii', 'III+', 'IV', 'V', 'vi°', 'vii°'];
      return numerals[chordIndex] || '';
    }
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
    } else if (seventh === 'mMaj7') {
      // Minor major 7th: CmMaj7
      name += 'mMaj7';
    } else if (seventh === 'm7b5') {
      // Half-diminished: Cm7♭5
      name += 'm7♭5';
    } else if (seventh === 'dim7') {
      // Diminished 7th: Cdim7
      name += 'dim7';
    } else if (seventh === 'aug7') {
      // Augmented 7th: Caug7
      name += 'aug7';
    } else if (seventh === 'augMaj7') {
      // Augmented major 7th: CaugMaj7
      name += 'augMaj7';
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

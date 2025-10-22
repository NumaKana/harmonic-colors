import { Chord, Key, Note, HarmonicFunction, HarmonicFunctionType } from '../types';

const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Get the index of a note in the chromatic scale
 */
function getNoteIndex(note: Note): number {
  return NOTES.indexOf(note);
}

/**
 * Calculate the interval (in semitones) from the tonic to the chord root
 */
function getIntervalFromTonic(tonic: Note, chordRoot: Note): number {
  const tonicIndex = getNoteIndex(tonic);
  const rootIndex = getNoteIndex(chordRoot);
  return (rootIndex - tonicIndex + 12) % 12;
}

/**
 * Analyze the harmonic function of a chord in a given key
 */
export function analyzeHarmonicFunction(chord: Chord, key: Key): HarmonicFunction {
  const interval = getIntervalFromTonic(key.tonic, chord.root);
  const { mode } = key;

  // Define harmonic functions based on scale degree and mode
  if (mode === 'major') {
    switch (interval) {
      case 0: // I
        return {
          romanNumeral: 'I',
          function: 'tonic',
          isDiatonic: chord.quality === 'major',
        };
      case 2: // ii
        return {
          romanNumeral: 'ii',
          function: 'subdominant',
          isDiatonic: chord.quality === 'minor',
        };
      case 4: // iii
        return {
          romanNumeral: 'iii',
          function: 'tonic', // iii can function as tonic substitute
          isDiatonic: chord.quality === 'minor',
        };
      case 5: // IV
        return {
          romanNumeral: 'IV',
          function: 'subdominant',
          isDiatonic: chord.quality === 'major',
        };
      case 7: // V
        return {
          romanNumeral: 'V',
          function: 'dominant',
          isDiatonic: chord.quality === 'major',
        };
      case 9: // vi
        return {
          romanNumeral: 'vi',
          function: 'tonic', // vi can function as tonic substitute
          isDiatonic: chord.quality === 'minor',
        };
      case 11: // vii°
        return {
          romanNumeral: 'vii°',
          function: 'dominant',
          isDiatonic: chord.quality === 'diminished',
        };
      default:
        // Non-diatonic chord
        return {
          romanNumeral: `${chord.root}`,
          function: 'tonic', // Default to tonic for unknown
          isDiatonic: false,
        };
    }
  } else {
    // Minor mode
    switch (interval) {
      case 0: // i
        return {
          romanNumeral: 'i',
          function: 'tonic',
          isDiatonic: chord.quality === 'minor',
        };
      case 2: // ii°
        return {
          romanNumeral: 'ii°',
          function: 'subdominant',
          isDiatonic: chord.quality === 'diminished',
        };
      case 3: // III
        return {
          romanNumeral: 'III',
          function: 'tonic', // III is relative major
          isDiatonic: chord.quality === 'major',
        };
      case 5: // iv
        return {
          romanNumeral: 'iv',
          function: 'subdominant',
          isDiatonic: chord.quality === 'minor',
        };
      case 7: // v or V
        return {
          romanNumeral: chord.quality === 'major' ? 'V' : 'v',
          function: 'dominant',
          isDiatonic: chord.quality === 'minor', // Natural minor has minor v
        };
      case 8: // VI
        return {
          romanNumeral: 'VI',
          function: 'subdominant',
          isDiatonic: chord.quality === 'major',
        };
      case 10: // VII
        return {
          romanNumeral: 'VII',
          function: 'subdominant',
          isDiatonic: chord.quality === 'major',
        };
      default:
        // Non-diatonic chord
        return {
          romanNumeral: `${chord.root}`,
          function: 'tonic', // Default to tonic for unknown
          isDiatonic: false,
        };
    }
  }
}

/**
 * Get the harmonic function type for a chord in a key
 */
export function getHarmonicFunctionType(chord: Chord, key: Key): HarmonicFunctionType {
  const analysis = analyzeHarmonicFunction(chord, key);
  return analysis.function;
}

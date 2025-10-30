import { Chord, Key, Note, ChordQuality, HarmonicFunction, HarmonicFunctionType } from '../types';

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
 * Detect if a chord is a secondary dominant (V7/X)
 * Returns the target chord degree if it's a secondary dominant, null otherwise
 */
function detectSecondaryDominant(chord: Chord, key: Key): number | null {
  // Secondary dominants must be major or have a dominant 7th
  if (chord.quality !== 'major' && chord.seventh !== '7') {
    return null;
  }

  const interval = getIntervalFromTonic(key.tonic, chord.root);

  // Diatonic degrees in this key
  const diatonicDegrees = key.mode === 'major'
    ? [0, 2, 4, 5, 7, 9, 11] // I, ii, iii, IV, V, vi, vii
    : [0, 2, 3, 5, 7, 8, 10]; // i, ii°, III, iv, v, VI, VII

  // If the chord itself is diatonic, it's not a secondary dominant
  if (diatonicDegrees.includes(interval)) {
    // Exception: Check if it should be a different quality for this scale degree
    // For example, in C major, a C major chord is diatonic (I), not V7/IV
    const expectedQuality = getExpectedQuality(interval, key.mode);
    if (chord.quality === expectedQuality) {
      // If the quality matches, check if the seventh (if present) is diatonic
      if (!chord.seventh) {
        return null; // Plain triad is diatonic
      }
      // Seventh chords: only '7' (dominant 7th) suggests secondary dominant function
      // maj7, m7, m7b5, dim7 are all diatonic seventh extensions
      if (chord.seventh !== '7') {
        return null; // Diatonic seventh chord (Imaj7, iim7, etc.)
      }
    }
  }

  // Check if this chord resolves to a diatonic chord (V7 relationship)
  // For example, in C major:
  // D7 (interval 2) resolves to G (interval 7) -> V7/V
  // A7 (interval 9) resolves to D (interval 2) -> V7/ii
  // E7 (interval 4) resolves to A (interval 9) -> V7/vi
  // B7 (interval 11) resolves to E (interval 4) -> V7/iii

  const targetInterval = (interval + 7) % 12; // Perfect 5th up

  // The target must be diatonic, and the chord itself should not be the primary dominant
  if (diatonicDegrees.includes(targetInterval) && targetInterval !== interval) {
    return targetInterval;
  }

  return null;
}

/**
 * Get the expected quality for a scale degree in a given mode
 */
function getExpectedQuality(interval: number, mode: 'major' | 'minor'): ChordQuality {
  if (mode === 'major') {
    switch (interval) {
      case 0: return 'major';    // I
      case 2: return 'minor';    // ii
      case 4: return 'minor';    // iii
      case 5: return 'major';    // IV
      case 7: return 'major';    // V
      case 9: return 'minor';    // vi
      case 11: return 'diminished'; // vii°
      default: return 'major';
    }
  } else {
    switch (interval) {
      case 0: return 'minor';    // i
      case 2: return 'diminished'; // ii°
      case 3: return 'major';    // III
      case 5: return 'minor';    // iv
      case 7: return 'minor';    // v
      case 8: return 'major';    // VI
      case 10: return 'major';   // VII
      default: return 'minor';
    }
  }
}

/**
 * Detect borrowed chords (modal interchange)
 * Returns the source mode if it's a borrowed chord, null otherwise
 */
function detectBorrowedChord(chord: Chord, key: Key): string | null {
  const interval = getIntervalFromTonic(key.tonic, chord.root);

  if (key.mode === 'major') {
    // Common borrowed chords from parallel minor
    switch (interval) {
      case 3: // ♭III (borrowed from minor)
        if (chord.quality === 'major') return 'minor';
        break;
      case 5: // iv (borrowed from minor)
        if (chord.quality === 'minor') return 'minor';
        break;
      case 8: // ♭VI (borrowed from minor)
        if (chord.quality === 'major') return 'minor';
        break;
      case 10: // ♭VII (borrowed from minor)
        if (chord.quality === 'major') return 'minor';
        break;
    }
  } else {
    // Common borrowed chords from parallel major (less common)
    switch (interval) {
      case 4: // III (borrowed from major - natural iii in minor is ♭III)
        if (chord.quality === 'minor') return 'major';
        break;
      case 9: // vi (borrowed from major)
        if (chord.quality === 'minor') return 'major';
        break;
    }
  }

  return null;
}

/**
 * Analyze the harmonic function of a chord in a given key
 */
export function analyzeHarmonicFunction(chord: Chord, key: Key): HarmonicFunction {
  const interval = getIntervalFromTonic(key.tonic, chord.root);
  const { mode } = key;

  // Check for secondary dominants first
  const secondaryTarget = detectSecondaryDominant(chord, key);
  if (secondaryTarget !== null) {
    // This is a secondary dominant
    const targetRomanMap: Record<number, string> = key.mode === 'major'
      ? { 0: 'I', 2: 'ii', 4: 'iii', 5: 'IV', 7: 'V', 9: 'vi', 11: 'vii°' }
      : { 0: 'i', 2: 'ii°', 3: 'III', 5: 'iv', 7: 'V', 8: 'VI', 10: 'VII' };

    return {
      romanNumeral: `V7/${targetRomanMap[secondaryTarget] || '?'}`,
      function: 'dominant',
      isDiatonic: false,
    };
  }

  // Check for borrowed chords
  const borrowedFrom = detectBorrowedChord(chord, key);
  if (borrowedFrom) {
    // Determine the borrowed chord's Roman numeral based on interval
    let romanNumeral = `${chord.root}`;
    let harmonicFunction: HarmonicFunctionType = 'tonic';

    if (key.mode === 'major' && borrowedFrom === 'minor') {
      switch (interval) {
        case 3: romanNumeral = '♭III'; harmonicFunction = 'tonic'; break;
        case 5: romanNumeral = 'iv'; harmonicFunction = 'subdominant'; break;
        case 8: romanNumeral = '♭VI'; harmonicFunction = 'subdominant'; break;
        case 10: romanNumeral = '♭VII'; harmonicFunction = 'subdominant'; break;
      }
    }

    return {
      romanNumeral,
      function: harmonicFunction,
      isDiatonic: false,
    };
  }

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

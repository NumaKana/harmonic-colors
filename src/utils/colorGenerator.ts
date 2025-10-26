import { Key, Chord, ColorHSL, Note } from '../types';
import { getHarmonicFunctionType } from './harmonicAnalysis';

/**
 * Calculate the scale degree of a chord within a key
 * Returns 1-7 for diatonic chords, or null for non-diatonic
 */
function getScaleDegree(chord: Chord, key: Key): number | null {
  const noteOrder: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const tonicIndex = noteOrder.indexOf(key.tonic);
  const rootIndex = noteOrder.indexOf(chord.root);

  // Calculate semitone distance from tonic
  let semitones = (rootIndex - tonicIndex + 12) % 12;

  // Map semitones to scale degree
  const semitoneToScaleDegree: Record<number, number> = {
    0: 1,  // I
    2: 2,  // ii
    4: 3,  // iii
    5: 4,  // IV
    7: 5,  // V
    9: 6,  // vi
    11: 7  // vii
  };

  return semitoneToScaleDegree[semitones] ?? null;
}

/**
 * Map notes to hue values (0-360 degrees)
 * C = 0, C# = 30, D = 60, etc.
 */
const NOTE_TO_HUE: Record<Note, number> = {
  'C': 0,
  'C#': 30,
  'D': 60,
  'D#': 90,
  'E': 120,
  'F': 150,
  'F#': 180,
  'G': 210,
  'G#': 240,
  'A': 270,
  'A#': 300,
  'B': 330,
};

/**
 * Generate Color 1 (Key-based color)
 * Based on the tonic of the key
 */
export function generateKeyColor(key: Key, hueRotation: number = 0): ColorHSL {
  // Get base hue from the tonic note
  const baseHue = NOTE_TO_HUE[key.tonic];
  const hue = (baseHue + hueRotation) % 360;

  // Set lightness based on mode
  const lightness = key.mode === 'major' ? 62 : 42; // Major: brighter, Minor: darker

  // Set saturation
  const saturation = 75;

  return {
    hue,
    saturation,
    lightness,
  };
}

/**
 * Generate Color 2 (Chord-based color)
 * Based on the chord's harmonic function and root note
 */
export function generateChordColor(
  chord: Chord,
  key: Key,
  baseColor: ColorHSL
): ColorHSL {
  // Get the harmonic function
  const harmonicFunction = getHarmonicFunctionType(chord, key);

  // Calculate hue adjustment based on harmonic function
  let hueAdjustment = 0;
  switch (harmonicFunction) {
    case 'tonic':
      hueAdjustment = 0; // ±0 degrees
      break;
    case 'subdominant':
      hueAdjustment = 15; // +15 degrees
      break;
    case 'dominant':
      hueAdjustment = 30; // +30 degrees
      break;
  }

  // Apply micro-adjustment based on scale degree within harmonic function
  const scaleDegree = getScaleDegree(chord, key);
  let microHueAdjustment = 0;
  let microSaturationAdjustment = 0;
  let microLightnessAdjustment = 0;

  if (scaleDegree !== null) {
    // Apply different adjustments for different scale degrees within the same harmonic function
    // Focus on saturation and lightness differences for better perceptibility
    if (harmonicFunction === 'tonic') {
      // I, iii, vi
      if (scaleDegree === 1) {
        // I: no adjustment (neutral reference)
        microHueAdjustment = 0;
        microSaturationAdjustment = 0;
        microLightnessAdjustment = 0;
      } else if (scaleDegree === 3) {
        // iii: significantly darker and less saturated
        microHueAdjustment = -8;
        microSaturationAdjustment = -15;
        microLightnessAdjustment = -15;
      } else if (scaleDegree === 6) {
        // vi: significantly brighter and more saturated
        microHueAdjustment = 8;
        microSaturationAdjustment = 15;
        microLightnessAdjustment = 15;
      }
    } else if (harmonicFunction === 'subdominant') {
      // ii, IV
      if (scaleDegree === 2) {
        // ii: darker and less saturated
        microHueAdjustment = -5;
        microSaturationAdjustment = -12;
        microLightnessAdjustment = -12;
      } else if (scaleDegree === 4) {
        // IV: brighter and more saturated
        microHueAdjustment = 5;
        microSaturationAdjustment = 12;
        microLightnessAdjustment = 12;
      }
    } else if (harmonicFunction === 'dominant') {
      // V, vii
      if (scaleDegree === 5) {
        // V: no adjustment (neutral reference)
        microHueAdjustment = 0;
        microSaturationAdjustment = 0;
        microLightnessAdjustment = 0;
      } else if (scaleDegree === 7) {
        // vii: significantly darker and less saturated
        microHueAdjustment = -8;
        microSaturationAdjustment = -15;
        microLightnessAdjustment = -15;
      }
    }
  }

  // Apply hue adjustment (keep within ±30 degree range for diatonic chords)
  const hue = (baseColor.hue + hueAdjustment + microHueAdjustment) % 360;

  // Calculate lightness adjustment based on chord quality and function
  let lightnessAdjustment = 0;

  if (chord.quality === 'major') {
    switch (harmonicFunction) {
      case 'tonic':
        lightnessAdjustment = 10;
        break;
      case 'subdominant':
        lightnessAdjustment = 5;
        break;
      case 'dominant':
        lightnessAdjustment = -5;
        break;
    }
  } else if (chord.quality === 'minor') {
    switch (harmonicFunction) {
      case 'tonic':
        lightnessAdjustment = 0;
        break;
      case 'subdominant':
        lightnessAdjustment = -5;
        break;
      case 'dominant':
        lightnessAdjustment = -10;
        break;
    }
  } else if (chord.quality === 'diminished' || chord.quality === 'augmented') {
    lightnessAdjustment = -15;
  }

  // Apply lightness adjustment with micro-adjustment and bounds (20-80%)
  const lightness = Math.max(20, Math.min(80, baseColor.lightness + lightnessAdjustment + microLightnessAdjustment));

  // Calculate saturation (will be used for tensions in future)
  let saturation = 75;

  // For now, just base saturation (tensions will be added later)
  if (chord.seventh) {
    saturation += 5;
  }

  // Apply micro-saturation adjustment
  saturation += microSaturationAdjustment;

  // Apply bounds (0-100%)
  saturation = Math.max(0, Math.min(100, saturation));

  return {
    hue,
    saturation,
    lightness,
  };
}

/**
 * Convert HSL color to CSS string
 */
export function hslToCSS(color: ColorHSL): string {
  return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
}

/**
 * Get marble ratio based on harmonic function
 * Returns the ratio of Color 1 to Color 2 (0-1)
 * Higher value = more Color 1 (key color)
 */
export function getMarbleRatio(chord: Chord, key: Key): number {
  const harmonicFunction = getHarmonicFunctionType(chord, key);

  switch (harmonicFunction) {
    case 'tonic':
      return 0.8; // 80% color1, 20% color2
    case 'subdominant':
      return 0.65; // 65% color1, 35% color2
    case 'dominant':
      return 0.5; // 50% color1, 50% color2
    default:
      return 0.65;
  }
}

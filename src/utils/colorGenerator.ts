import { Key, Chord, ColorHSL, Note } from '../types';
import { getHarmonicFunctionType } from './harmonicAnalysis';

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

  // Apply hue adjustment (keep within ±30 degree range for diatonic chords)
  const hue = (baseColor.hue + hueAdjustment) % 360;

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

  // Apply lightness adjustment with bounds (20-80%)
  const lightness = Math.max(20, Math.min(80, baseColor.lightness + lightnessAdjustment));

  // Calculate saturation (will be used for tensions in future)
  let saturation = 75;

  // For now, just base saturation (tensions will be added later)
  if (chord.seventh) {
    saturation += 5;
  }

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

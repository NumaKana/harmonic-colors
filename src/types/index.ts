/**
 * Core type definitions for Harmonic Colors
 */

export type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented';

export type SeventhType = '7' | 'maj7' | 'm7' | 'mMaj7' | 'm7b5' | 'dim7' | 'aug7' | 'augMaj7';

export type Tension = 9 | 11 | 13;

export type Alteration = 'b9' | '#9' | '#11' | 'b13';

export interface Chord {
  root: Note;
  quality: ChordQuality;
  seventh?: SeventhType;
  tensions: Tension[];
  alterations: Alteration[];
  duration: number; // in beats
}

export interface Key {
  tonic: Note;
  mode: 'major' | 'minor';
}

export interface ChordProgression {
  key: Key;
  chords: Chord[];
  bpm: number;
}

export interface ColorHSL {
  hue: number;        // 0-360
  saturation: number; // 0-100
  lightness: number;  // 0-100
}

export interface ParticleConfig {
  color: string;
  count: number;
  size: number;
  type: string;
}

export interface ChordColor {
  baseColor: ColorHSL;      // Color 1: Key-based
  chordColor: ColorHSL;     // Color 2: Chord-based
  marbleRatio: number;      // Ratio between color1 and color2 (0-1)
  particles: ParticleConfig[]; // Tension particles
}

export type HarmonicFunctionType = 'tonic' | 'subdominant' | 'dominant';

export interface HarmonicFunction {
  romanNumeral: string;
  function: HarmonicFunctionType;
  isDiatonic: boolean;
}

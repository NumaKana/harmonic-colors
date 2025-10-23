import * as Tone from 'tone';
import { Chord, Note } from '../types';

/**
 * Audio engine for playing chords using Tone.js
 */
class AudioEngine {
  private synth: Tone.PolySynth | null = null;
  private isInitialized = false;

  /**
   * Initialize the audio engine
   * Must be called after user interaction due to browser autoplay policies
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    await Tone.start();

    // Create a polyphonic synthesizer with a warm, pad-like sound
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.7,
        release: 1.0,
      },
    }).toDestination();

    this.isInitialized = true;
  }

  /**
   * Convert a chord to an array of note frequencies
   */
  getChordNotes(chord: Chord, octave: number = 4): string[] {
    const notes: string[] = [];

    // Add root note
    notes.push(`${chord.root}${octave}`);

    // Add third (major 3rd or minor 3rd)
    const thirdInterval = chord.quality === 'major' || chord.quality === 'augmented' ? 4 : 3;
    notes.push(this.transposeNote(chord.root, thirdInterval, octave));

    // Add fifth
    let fifthInterval = 7; // Perfect fifth
    if (chord.quality === 'diminished') {
      fifthInterval = 6; // Diminished fifth
    } else if (chord.quality === 'augmented') {
      fifthInterval = 8; // Augmented fifth
    }
    notes.push(this.transposeNote(chord.root, fifthInterval, octave));

    // Add seventh if present
    if (chord.seventh) {
      let seventhInterval = 10; // Minor 7th (default for '7')

      switch (chord.seventh) {
        case 'maj7':
          seventhInterval = 11; // Major 7th
          break;
        case 'm7':
        case 'm7b5':
          seventhInterval = 10; // Minor 7th
          break;
        case 'dim7':
          seventhInterval = 9; // Diminished 7th
          break;
        case 'aug7':
          seventhInterval = 10; // Minor 7th (for augmented 7th chord)
          break;
      }

      notes.push(this.transposeNote(chord.root, seventhInterval, octave));
    }

    // Add tensions (9th, 11th, 13th)
    chord.tensions.forEach((tension) => {
      let interval = 0;
      switch (tension) {
        case 9:
          interval = 14; // 9th = octave + 2 semitones
          break;
        case 11:
          interval = 17; // 11th = octave + 5 semitones
          break;
        case 13:
          interval = 21; // 13th = octave + 9 semitones
          break;
      }
      notes.push(this.transposeNote(chord.root, interval, octave));
    });

    return notes;
  }

  /**
   * Transpose a note by a given number of semitones
   */
  private transposeNote(root: Note, semitones: number, octave: number): string {
    const notes: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = notes.indexOf(root);

    const totalSemitones = rootIndex + semitones;
    const newOctave = octave + Math.floor(totalSemitones / 12);
    const newNoteIndex = totalSemitones % 12;

    return `${notes[newNoteIndex]}${newOctave}`;
  }

  /**
   * Play a chord
   * @param chord The chord to play
   * @param duration Duration in seconds (default: 2)
   */
  async playChord(chord: Chord, duration: number = 2): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.synth) {
      throw new Error('Synthesizer not initialized');
    }

    const notes = this.getChordNotes(chord);
    this.synth.triggerAttackRelease(notes, duration);
  }

  /**
   * Stop all currently playing notes
   */
  stop(): void {
    if (this.synth) {
      this.synth.releaseAll();
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    this.isInitialized = false;
  }
}

// Create a singleton instance
export const audioEngine = new AudioEngine();

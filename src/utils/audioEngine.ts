import * as Tone from 'tone';
import { Chord, Note } from '../types';

/**
 * Audio engine for playing chords using Tone.js
 */
class AudioEngine {
  private synth: Tone.PolySynth | null = null;
  private isInitialized = false;
  private isPlaying = false;
  private currentSequence: Tone.Part | null = null;

  /**
   * Initialize the audio engine
   * Must be called after user interaction due to browser autoplay policies
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
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
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw new Error('Audio initialization failed. Please check your browser audio settings.');
    }
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
   * @param duration Duration in seconds (default: 1)
   */
  async playChord(chord: Chord, duration: number = 1): Promise<void> {
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
   * Play a chord progression sequentially
   * @param chords Array of chords to play
   * @param bpm Beats per minute (default: 120)
   * @param onChordChange Callback called when each chord starts playing
   */
  async playProgression(
    chords: Chord[],
    bpm: number = 120,
    onChordChange?: (index: number) => void
  ): Promise<void> {
    if (chords.length === 0) {
      return;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.synth) {
      throw new Error('Synthesizer not initialized');
    }

    // Stop any currently playing sequence
    this.stopProgression();

    // Set the BPM
    Tone.getTransport().bpm.value = bpm;

    // Create events for each chord
    const events: Array<{ time: number; chord: Chord; index: number }> = [];
    let currentTime = 0;

    chords.forEach((chord, index) => {
      const timeInSeconds = (60 / bpm) * currentTime;
      events.push({
        time: timeInSeconds,
        chord,
        index,
      });
      currentTime += chord.duration;
    });

    // Create a Tone.Part to schedule the chord sequence
    this.currentSequence = new Tone.Part((time, event) => {
      const notes = this.getChordNotes(event.chord);
      const durationInSeconds = (60 / bpm) * event.chord.duration;

      // Trigger the chord at the scheduled time
      this.synth!.triggerAttackRelease(notes, durationInSeconds, time);

      // Call the callback to update UI
      if (onChordChange) {
        // Schedule the callback to run at the same time as the chord
        Tone.getDraw().schedule(() => {
          onChordChange(event.index);
        }, time);
      }
    }, events);

    this.currentSequence.start(0);
    this.currentSequence.loop = false;
    this.isPlaying = true;

    // Start the transport
    await Tone.getTransport().start();

    // Schedule stopping the transport after all chords are played
    const totalDuration = events.reduce((sum, event) => sum + event.chord.duration, 0);
    const totalSeconds = (60 / bpm) * totalDuration;

    Tone.getTransport().schedule((time) => {
      this.stopProgression();
      if (onChordChange) {
        Tone.getDraw().schedule(() => {
          onChordChange(-1); // Signal that playback has ended
        }, time);
      }
    }, `+${totalSeconds}`);
  }

  /**
   * Stop the currently playing progression
   */
  stopProgression(): void {
    if (this.currentSequence) {
      this.currentSequence.stop();
      this.currentSequence.dispose();
      this.currentSequence = null;
    }

    Tone.getTransport().stop();
    Tone.getTransport().cancel();

    if (this.synth) {
      this.synth.releaseAll();
    }

    this.isPlaying = false;
  }

  /**
   * Check if a progression is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
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
    this.stopProgression();

    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    this.isInitialized = false;
  }
}

// Create a singleton instance
export const audioEngine = new AudioEngine();

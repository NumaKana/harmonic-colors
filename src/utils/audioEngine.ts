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
    console.log('🎵 playProgression called with:', {
      chordsCount: chords.length,
      bpm,
      chords: chords.map((c, i) => ({
        index: i,
        root: c.root,
        quality: c.quality,
        duration: c.duration,
      })),
    });

    if (chords.length === 0) {
      console.warn('⚠️ No chords to play');
      return;
    }

    if (!this.isInitialized) {
      console.log('🔧 Initializing audio engine...');
      await this.initialize();
    }

    if (!this.synth) {
      throw new Error('Synthesizer not initialized');
    }

    // Stop any currently playing sequence
    this.stopProgression();

    // Set the BPM
    Tone.getTransport().bpm.value = bpm;
    console.log('⏱️ BPM set to:', bpm);

    // Create events for each chord
    const events: Array<{ time: string; chord: Chord; index: number }> = [];
    let currentTime = 0;

    chords.forEach((chord, index) => {
      const timeString = `${currentTime}:0:0`;
      events.push({
        time: timeString,
        chord,
        index,
      });
      console.log(`📅 Event ${index}: time=${timeString}, chord=${chord.root}${chord.quality}, duration=${chord.duration} beats`);
      currentTime += chord.duration;
    });

    console.log('📊 Total events scheduled:', events.length);
    console.log('⏰ Total duration:', currentTime, 'beats');

    // Create a Tone.Part to schedule the chord sequence
    this.currentSequence = new Tone.Part((time, event) => {
      console.log(`🎹 Playing chord ${event.index} at time ${time}:`, {
        chord: event.chord.root + event.chord.quality,
        scheduledTime: time,
        currentTime: Tone.now(),
      });

      const notes = this.getChordNotes(event.chord);
      const durationInSeconds = (60 / bpm) * event.chord.duration;

      console.log(`  Notes: ${notes.join(', ')}, duration: ${durationInSeconds}s`);

      // Trigger the chord at the scheduled time
      this.synth!.triggerAttackRelease(notes, durationInSeconds, time);

      // Call the callback to update UI
      if (onChordChange) {
        // Schedule the callback to run at the same time as the chord
        Tone.getDraw().schedule(() => {
          console.log(`🎨 UI update: highlighting chord ${event.index}`);
          onChordChange(event.index);
        }, time);
      }
    }, events);

    this.currentSequence.start(0);
    this.currentSequence.loop = false;
    this.isPlaying = true;

    console.log('▶️ Starting Tone.Transport...');
    console.log('🔄 Transport state before start:', Tone.getTransport().state);

    // Start the transport
    await Tone.getTransport().start();

    console.log('🔄 Transport state after start:', Tone.getTransport().state);
    console.log('⏱️ Transport position:', Tone.getTransport().position);

    // Schedule stopping the transport after all chords are played
    const totalDuration = events.reduce((sum, event) => sum + event.chord.duration, 0);
    const totalSeconds = (60 / bpm) * totalDuration;

    console.log(`⏹️ Scheduling stop after ${totalSeconds}s (${totalDuration} beats)`);

    Tone.getTransport().schedule(() => {
      console.log('⏹️ Playback completed, stopping...');
      this.stopProgression();
      if (onChordChange) {
        Tone.getDraw().schedule(() => {
          console.log('🎨 UI update: clearing highlight (index -1)');
          onChordChange(-1); // Signal that playback has ended
        }, Tone.now());
      }
    }, `+${totalSeconds}`);
  }

  /**
   * Stop the currently playing progression
   */
  stopProgression(): void {
    console.log('⏹️ stopProgression called');

    if (this.currentSequence) {
      console.log('  Stopping and disposing current sequence');
      this.currentSequence.stop();
      this.currentSequence.dispose();
      this.currentSequence = null;
    }

    console.log('  Stopping Transport');
    Tone.getTransport().stop();
    console.log('  Canceling scheduled events');
    Tone.getTransport().cancel();

    if (this.synth) {
      console.log('  Releasing all notes');
      this.synth.releaseAll();
    }

    this.isPlaying = false;
    console.log('✅ Progression stopped');
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

import { useState, useEffect, useRef } from 'react';
import { Chord } from '../types';
import { audioEngine } from '../utils/audioEngine';
import './PlaybackControls.css';

interface PlaybackControlsProps {
  chords: Chord[];
  onPlayingIndexChange: (index: number) => void;
  onPlaybackPositionChange?: (position: number) => void;
  onTimeSignatureChange?: (timeSignature: number) => void;
  onBpmChange?: (bpm: number) => void;
  onMetronomeChange?: (enabled: boolean) => void;
}

const PlaybackControls = ({ chords, onPlayingIndexChange, onPlaybackPositionChange, onTimeSignatureChange, onBpmChange, onMetronomeChange }: PlaybackControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [timeSignature, setTimeSignature] = useState(4);

  const startTimeRef = useRef<number>(0);
  const currentIndexRef = useRef<number>(-1);
  const animationFrameRef = useRef<number | null>(null);

  // Animation loop to update playback position
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const updatePosition = () => {
      const now = performance.now();
      const elapsedMs = now - startTimeRef.current;
      const beatsPerMs = bpm / 60000; // Convert BPM to beats per millisecond
      const currentBeat = elapsedMs * beatsPerMs;

      if (onPlaybackPositionChange) {
        onPlaybackPositionChange(currentBeat);
      }

      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    animationFrameRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, bpm, onPlaybackPositionChange]);

  const handlePlayProgression = async () => {
    if (chords.length === 0) {
      return;
    }

    if (isPlaying) {
      audioEngine.stopProgression();
      setIsPlaying(false);
      onPlayingIndexChange(-1);
      if (onPlaybackPositionChange) {
        onPlaybackPositionChange(0);
      }
      return;
    }

    setIsPlaying(true);
    startTimeRef.current = performance.now();
    currentIndexRef.current = 0;

    try {
      await audioEngine.playProgression(chords, bpm, (index) => {
        currentIndexRef.current = index;
        onPlayingIndexChange(index);
        if (index === -1) {
          setIsPlaying(false);
          if (onPlaybackPositionChange) {
            onPlaybackPositionChange(0);
          }
        }
      });
    } catch (error) {
      console.error('Failed to play progression:', error);
      setIsPlaying(false);
      onPlayingIndexChange(-1);
      if (onPlaybackPositionChange) {
        onPlaybackPositionChange(0);
      }
      alert('Failed to play audio. Please check your browser audio settings.');
    }
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setBpm(value);
      if (onBpmChange) {
        onBpmChange(value);
      }
    }
  };

  const handleBpmBlur = () => {
    // Ensure BPM is within valid range on blur
    if (bpm < 40) setBpm(40);
    if (bpm > 240) setBpm(240);
  };

  const handleMetronomeToggle = () => {
    const newValue = !metronomeEnabled;
    setMetronomeEnabled(newValue);
    audioEngine.setMetronomeEnabled(newValue);
    if (onMetronomeChange) {
      onMetronomeChange(newValue);
    }
  };

  const handleTimeSignatureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setTimeSignature(value);
    audioEngine.setTimeSignature(value);
    if (onTimeSignatureChange) {
      onTimeSignatureChange(value);
    }
  };

  return (
    <div className="playback-controls">
      <div className="playback-controls-section">
        <button
          className={`playback-button ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayProgression}
          disabled={chords.length === 0}
          title={
            chords.length === 0
              ? 'Add chords to the progression to enable playback'
              : isPlaying
              ? 'Stop progression playback'
              : `Play chord progression at ${bpm} BPM`
          }
        >
          {isPlaying ? '⏸ Stop' : '▶ Play'}
        </button>
      </div>

      <div className="playback-controls-section">
        <label htmlFor="bpm-input" className="bpm-label">
          BPM:
        </label>
        <input
          id="bpm-input"
          type="number"
          className="bpm-input"
          value={bpm}
          onChange={handleBpmChange}
          onBlur={handleBpmBlur}
          min={40}
          max={240}
          disabled={isPlaying}
          title={isPlaying ? 'Cannot change BPM during playback' : 'Set playback tempo (40-240 BPM)'}
          aria-label="Beats per minute"
        />
      </div>

      <div className="playback-controls-section">
        <label htmlFor="metronome-toggle" className="metronome-label">
          <input
            id="metronome-toggle"
            type="checkbox"
            className="metronome-checkbox"
            checked={metronomeEnabled}
            onChange={handleMetronomeToggle}
            title="Enable metronome click during playback"
            aria-label="Metronome toggle"
          />
          Metronome
        </label>
      </div>

      <div className="playback-controls-section">
        <label htmlFor="time-signature-select" className="time-signature-label">
          Time:
        </label>
        <select
          id="time-signature-select"
          className="time-signature-select"
          value={timeSignature}
          onChange={handleTimeSignatureChange}
          disabled={isPlaying}
          title={isPlaying ? 'Cannot change time signature during playback' : 'Set time signature'}
          aria-label="Time signature"
        >
          <option value={2}>2/4</option>
          <option value={3}>3/4</option>
          <option value={4}>4/4</option>
          <option value={5}>5/4</option>
          <option value={6}>6/8</option>
          <option value={7}>7/8</option>
        </select>
      </div>
    </div>
  );
};

export default PlaybackControls;

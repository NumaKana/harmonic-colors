import { useState } from 'react';
import { Chord } from '../types';
import { audioEngine } from '../utils/audioEngine';
import './PlaybackControls.css';

interface PlaybackControlsProps {
  chords: Chord[];
  onPlayingIndexChange: (index: number) => void;
}

const PlaybackControls = ({ chords, onPlayingIndexChange }: PlaybackControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);

  const handlePlayProgression = async () => {
    if (chords.length === 0) {
      return;
    }

    if (isPlaying) {
      audioEngine.stopProgression();
      setIsPlaying(false);
      onPlayingIndexChange(-1);
      return;
    }

    setIsPlaying(true);
    try {
      await audioEngine.playProgression(chords, bpm, (index) => {
        onPlayingIndexChange(index);
        if (index === -1) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Failed to play progression:', error);
      setIsPlaying(false);
      onPlayingIndexChange(-1);
      alert('Failed to play audio. Please check your browser audio settings.');
    }
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setBpm(value);
    }
  };

  const handleBpmBlur = () => {
    // Ensure BPM is within valid range on blur
    if (bpm < 40) setBpm(40);
    if (bpm > 240) setBpm(240);
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
    </div>
  );
};

export default PlaybackControls;

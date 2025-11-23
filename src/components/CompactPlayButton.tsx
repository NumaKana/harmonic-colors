import { useState, useEffect, useRef } from 'react';
import { Chord } from '../types';
import { audioEngine } from '../utils/audioEngine';
import './CompactPlayButton.css';

interface CompactPlayButtonProps {
  chords: Chord[];
  bpm: number;
  metronomeEnabled: boolean;
  timeSignature: number;
  onPlayingIndexChange: (index: number) => void;
  onPlaybackPositionChange?: (position: number) => void;
}

const CompactPlayButton = ({
  chords,
  bpm,
  metronomeEnabled,
  timeSignature,
  onPlayingIndexChange,
  onPlaybackPositionChange
}: CompactPlayButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const startTimeRef = useRef<number>(0);
  const currentIndexRef = useRef<number>(-1);
  const animationFrameRef = useRef<number | null>(null);

  // Sync metronome and time signature with audioEngine
  useEffect(() => {
    audioEngine.setMetronomeEnabled(metronomeEnabled);
    audioEngine.setTimeSignature(timeSignature);
  }, [metronomeEnabled, timeSignature]);

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
      const beatsPerMs = bpm / 60000;
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

  return (
    <button
      className={`compact-play-button clickable ${isPlaying ? 'playing' : ''}`}
      onClick={handlePlayProgression}
      disabled={chords.length === 0}
      title={
        chords.length === 0
          ? 'Add chords to play'
          : isPlaying
          ? 'Stop'
          : 'Play'
      }
    >
      {isPlaying ? '⏸' : '▶'}
    </button>
  );
};

export default CompactPlayButton;

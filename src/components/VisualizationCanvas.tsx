import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Chord, Key } from '../types';
import TimelineVisualization from './TimelineVisualization';
import CompactPlayButton from './CompactPlayButton';
import './VisualizationCanvas.css';

interface VisualizationCanvasProps {
  selectedKey: Key;
  currentChord?: Chord;
  hueRotation?: number;
  chordProgression?: Chord[];
  currentChordIndex?: number;
  playbackPosition?: number;
  bpm?: number;
  metronomeEnabled?: boolean;
  timeSignature?: number;
  onPlayingIndexChange?: (index: number) => void;
  onPlaybackPositionChange?: (position: number) => void;
}

const VisualizationCanvas = ({
  selectedKey,
  currentChord,
  hueRotation = 0,
  chordProgression = [],
  currentChordIndex = -1,
  playbackPosition = 0,
  bpm = 120,
  metronomeEnabled = false,
  timeSignature = 4,
  onPlayingIndexChange,
  onPlaybackPositionChange
}: VisualizationCanvasProps) => {
  const fallbackCanvasRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [timelineMode, setTimelineMode] = useState<'playback' | 'preview'>('playback');

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS gradient');
      setWebGLSupported(false);
    }
  }, []);


  return (
    <div className="visualization-container">
      {/* Mode Toggle Buttons */}
      <div className="visualization-mode-controls">
        <button
          className={`mode-button ${timelineMode === 'playback' ? 'active' : ''}`}
          onClick={() => setTimelineMode('playback')}
        >
          Playback
        </button>
        <button
          className={`mode-button ${timelineMode === 'preview' ? 'active' : ''}`}
          onClick={() => setTimelineMode('preview')}
        >
          Preview
        </button>
      </div>

      {webGLSupported ? (
        <div className="visualization-canvas-wrapper">
          {timelineMode === 'preview' && (
            <div className="timeline-hint">
              💡 Drag to scroll horizontally
            </div>
          )}
          {onPlayingIndexChange && onPlaybackPositionChange && (
            <CompactPlayButton
              chords={chordProgression}
              bpm={bpm}
              metronomeEnabled={metronomeEnabled}
              timeSignature={timeSignature}
              onPlayingIndexChange={onPlayingIndexChange}
              onPlaybackPositionChange={onPlaybackPositionChange}
            />
          )}
          <div className="visualization-canvas">
          <Canvas
            orthographic
            camera={{
              zoom: 1,
              position: [0, 0, 5],
              left: -1,
              right: 1,
              top: 1,
              bottom: -1,
              near: 0.1,
              far: 1000
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <TimelineVisualization
              chords={chordProgression}
              selectedKey={selectedKey}
              currentIndex={currentChordIndex}
              playbackPosition={playbackPosition}
              mode={timelineMode}
            />
          </Canvas>
          </div>
        </div>
      ) : (
        <div className="visualization-canvas" ref={fallbackCanvasRef}>
          {/* Fallback: CSS gradient for non-WebGL browsers */}
        </div>
      )}
    </div>
  );
};

export default VisualizationCanvas;

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Chord, Key, Section, VisualizationStyle } from '../types';
import TimelineVisualization from './TimelineVisualization';
import CompactPlayButton from './CompactPlayButton';
import './VisualizationCanvas.css';

interface VisualizationCanvasProps {
  selectedKey: Key;
  currentChord?: Chord;
  majorHueRotation?: number;
  minorHueRotation?: number;
  chordProgression?: Chord[];
  sections?: Section[]; // All sections for key lookup
  currentChordIndex?: number;
  playbackPosition?: number;
  bpm?: number;
  metronomeEnabled?: boolean;
  timeSignature?: number;
  onPlayingIndexChange?: (index: number) => void;
  onPlaybackPositionChange?: (position: number) => void;
  visualizationStyle?: VisualizationStyle;
}

const VisualizationCanvas = ({
  selectedKey,
  majorHueRotation = 0,
  minorHueRotation = 0,
  chordProgression = [],
  sections = [],
  currentChordIndex = -1,
  playbackPosition = 0,
  bpm = 120,
  metronomeEnabled = false,
  timeSignature = 4,
  onPlayingIndexChange,
  onPlaybackPositionChange,
  visualizationStyle = 'marble'
}: VisualizationCanvasProps) => {
  const fallbackCanvasRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [timelineMode, setTimelineMode] = useState<'playback' | 'preview'>('playback');
  const [scrollProgress, setScrollProgress] = useState(0); // 0-1, scroll position ratio
  const [totalWidth, setTotalWidth] = useState(0); // Total timeline width
  const [viewWidth, setViewWidth] = useState(8.0); // Current view width
  const [isDraggingScrollbar, setIsDraggingScrollbar] = useState(false);
  const setCameraPositionRef = useRef<((progress: number) => void) | null>(null);

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS gradient');
      setWebGLSupported(false);
    }
  }, []);

  // Scrollbar drag handling with React synthetic events
  const handleScrollbarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingScrollbar(true);

    if (!scrollbarRef.current) return;

    const rect = scrollbarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));

    // Update camera position via ref
    if (setCameraPositionRef.current) {
      setCameraPositionRef.current(progress);
    }
  };

  // Mouse move and up handlers
  useEffect(() => {
    if (!isDraggingScrollbar) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();

      if (!scrollbarRef.current) return;

      const rect = scrollbarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const progress = Math.max(0, Math.min(1, clickX / rect.width));

      // Update camera position via ref
      if (setCameraPositionRef.current) {
        setCameraPositionRef.current(progress);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingScrollbar(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingScrollbar]);


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
        <>
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
                sections={sections}
                currentIndex={currentChordIndex}
                playbackPosition={playbackPosition}
                mode={timelineMode}
                majorHueRotation={majorHueRotation}
                minorHueRotation={minorHueRotation}
                visualizationStyle={visualizationStyle}
                onScrollInfoChange={(info) => {
                  setScrollProgress(info.progress);
                  setTotalWidth(info.totalWidth);
                  setViewWidth(info.viewWidth);
                }}
                onSetCameraPosition={(handler) => {
                  setCameraPositionRef.current = handler;
                }}
              />
            </Canvas>
            </div>
          </div>
          {/* Scrollbar for preview mode - outside canvas wrapper */}
          {timelineMode === 'preview' && totalWidth > viewWidth && (
            <div
              className="timeline-scrollbar"
              ref={scrollbarRef}
              onMouseDown={handleScrollbarMouseDown}
            >
              <div
                className="scrollbar-thumb"
                style={{
                  left: `${scrollProgress * (1 - viewWidth / totalWidth) * 100}%`,
                  width: `${(viewWidth / totalWidth) * 100}%`
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="visualization-canvas" ref={fallbackCanvasRef}>
          {/* Fallback: CSS gradient for non-WebGL browsers */}
        </div>
      )}
    </div>
  );
};

export default VisualizationCanvas;

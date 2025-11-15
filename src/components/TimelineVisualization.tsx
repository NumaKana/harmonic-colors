/**
 * TimelineVisualization - Timeline display for chord progression
 * Shows chord colors flowing from left to right
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from 'three';
import { Chord, Key, Section, VisualizationStyle } from '../types';
import { generateKeyColor, generateChordColor, getMarbleRatio, generateParticles, getHueRotationForKey } from '../utils/colorGenerator';
import TimelineSegment from './TimelineSegment';
import ParticleSystem from './ParticleSystem';

interface TimelineVisualizationProps {
  chords: Chord[];
  selectedKey: Key;
  sections?: Section[]; // All sections for key lookup
  currentIndex: number;
  playbackPosition: number;
  mode: 'playback' | 'preview';
  majorHueRotation?: number;
  minorHueRotation?: number;
  visualizationStyle?: VisualizationStyle;
  onScrollInfoChange?: (info: { progress: number; totalWidth: number; viewWidth: number }) => void;
  onSetCameraPosition?: (handler: (progress: number) => void) => void;
}

const TimelineVisualization = ({
  chords,
  selectedKey,
  sections = [],
  currentIndex,
  playbackPosition,
  mode,
  majorHueRotation = 0,
  minorHueRotation = 0,
  visualizationStyle = 'marble',
  onScrollInfoChange,
  onSetCameraPosition
}: TimelineVisualizationProps) => {
  const { camera, gl } = useThree();
  const cameraRef = useRef<OrthographicCamera>(camera as OrthographicCamera);
  const targetCameraX = useRef<number>(0);

  // Preview mode scroll state
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const cameraStartXRef = useRef<number>(0);
  const [previewCameraX, setPreviewCameraX] = useState<number>(0);

  // Generate color data for all chords
  const segmentData = useMemo(() => {
    let currentX = 0;

    return chords.map((chord, chordIndex) => {
      // Find the section key for this chord
      const chordKey = chord.sectionId && sections.length > 0
        ? sections.find(s => s.id === chord.sectionId)?.key || selectedKey
        : selectedKey;

      // Get the appropriate hue rotation for this chord's key
      const hueRotation = getHueRotationForKey(chordKey, majorHueRotation, minorHueRotation);

      // Generate colors using the chord's section key and appropriate hue rotation
      const keyColor = generateKeyColor(chordKey, hueRotation);
      const chordColor = generateChordColor(chord, chordKey, keyColor);
      const marbleRatio = getMarbleRatio(chord, chordKey);
      const particles = generateParticles(chord); // Generate particles for tensions
      const width = chord.duration * 0.5; // Scale duration to visual width
      const x = currentX + width / 2; // Center position

      const segment = {
        id: `chord-${chordIndex}-${chord.root}-${chord.quality}`, // Unique stable ID
        chord,
        color1: keyColor,
        color2: chordColor,
        marbleRatio,
        particles,
        width,
        x,
        // Pre-calculate positions to avoid creating new arrays on every render
        segmentPosition: [x, 0, 0] as [number, number, number],
        particlePosition: [x, 0, 0.05] as [number, number, number]
      };

      currentX += width;
      return segment;
    });
  }, [chords, selectedKey, sections, majorHueRotation, minorHueRotation]);

  // Calculate total width
  const totalWidth = useMemo(() => {
    return segmentData.reduce((sum, segment) => sum + segment.width, 0);
  }, [segmentData]);

  // Update camera position based on mode
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    if (mode === 'preview') {
      // Preview mode: Fixed viewport width, scrollable content
      // 1 beat = 0.5 units, show about 16 beats at once (increased from 8)
      const viewWidth = 8.0; // Show 16 beats worth of content (16 * 0.5 = 8.0 units)

      cam.left = -viewWidth / 2;
      cam.right = viewWidth / 2;
      cam.top = 1;
      cam.bottom = -1;
      cam.position.x = previewCameraX;
      cam.updateProjectionMatrix();
    } else {
      // Playback mode: camera follows playback position smoothly
      // Set camera to follow playback position (keeps bar at center)
      targetCameraX.current = playbackPosition * 0.5;

      // Show a window of ~5 beats width (increased from 2.5)
      const viewWidth = 2.5;
      cam.left = -viewWidth / 2;
      cam.right = viewWidth / 2;
      cam.top = 1;
      cam.bottom = -1;
      cam.updateProjectionMatrix();
    }
  }, [mode, playbackPosition, previewCameraX, totalWidth]);

  // Mouse event handlers for preview mode scrolling
  useEffect(() => {
    if (mode !== 'preview') return;

    const canvas = gl.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      cameraStartXRef.current = previewCameraX;
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - dragStartXRef.current;
      // Convert screen pixels to world units (invert direction for natural scrolling)
      const worldDelta = -deltaX * 0.005;
      const newX = cameraStartXRef.current + worldDelta;

      // Clamp camera position to valid range
      const viewWidth = 8.0;
      const minX = viewWidth / 2;
      const maxX = totalWidth - viewWidth / 2;
      const clampedX = Math.max(minX, Math.min(maxX, newX));

      setPreviewCameraX(clampedX);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = 'grab';
    };

    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.style.cursor = 'default';
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mode, gl, totalWidth, previewCameraX]);

  // Reset preview camera position when switching to preview mode
  useEffect(() => {
    if (mode === 'preview') {
      const viewWidth = 8.0;
      setPreviewCameraX(viewWidth / 2); // Start at the beginning
    }
  }, [mode]);

  // Notify parent of scroll info changes
  useEffect(() => {
    if (mode === 'preview' && onScrollInfoChange) {
      const viewWidth = 8.0;
      const scrollableWidth = totalWidth - viewWidth;
      const progress = scrollableWidth > 0 ? (previewCameraX - viewWidth / 2) / scrollableWidth : 0;
      onScrollInfoChange({
        progress: Math.max(0, Math.min(1, progress)),
        totalWidth,
        viewWidth
      });
    }
  }, [mode, previewCameraX, totalWidth, onScrollInfoChange]);

  // Provide camera position setter to parent
  useEffect(() => {
    if (!onSetCameraPosition) return;

    const handleSetPosition = (progress: number) => {
      const viewWidth = 8.0;
      const scrollableWidth = totalWidth - viewWidth;
      const newX = viewWidth / 2 + progress * scrollableWidth;

      setPreviewCameraX(newX);
    };

    onSetCameraPosition(handleSetPosition);
  }, [totalWidth, onSetCameraPosition]);

  // Smooth camera movement for playback mode
  useFrame(() => {
    if (mode === 'playback') {
      const cam = cameraRef.current;
      if (cam) {
        // Smooth interpolation
        const lerpFactor = 0.1;
        cam.position.x += (targetCameraX.current - cam.position.x) * lerpFactor;
      }
    }
  });

  // Render timeline segments
  return (
    <group>
      {segmentData.map((segment, index) => {
        // In preview mode, show all segments
        // In playback mode, only show nearby segments for performance
        const isVisible = mode === 'preview' ||
          (mode === 'playback' && currentIndex >= 0 && Math.abs(index - currentIndex) <= 2);

        if (!isVisible) return null;

        // Get next segment's colors for blending
        const nextSegment = index < segmentData.length - 1 ? segmentData[index + 1] : null;

        return (
          <group key={segment.id}>
            <TimelineSegment
              color1={segment.color1}
              color2={segment.color2}
              marbleRatio={segment.marbleRatio}
              width={segment.width}
              position={segment.segmentPosition}
              nextColor1={nextSegment?.color1}
              nextColor2={nextSegment?.color2}
              blendWidth={0.3}
              visualizationStyle={visualizationStyle}
            />
            {/* Render particles if tensions/alterations exist */}
            {segment.particles.length > 0 && (
              <ParticleSystem
                particles={segment.particles}
                position={segment.particlePosition}
                width={segment.width}
                height={2.0}
              />
            )}
          </group>
        );
      })}

      {/* Current position indicator in playback mode */}
      {mode === 'playback' && currentIndex >= 0 && (
        <mesh position={[playbackPosition * 0.5, 0, 0.1]}>
          <planeGeometry args={[0.02, 2.5]} />
          <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
      )}
    </group>
  );
};

export default TimelineVisualization;

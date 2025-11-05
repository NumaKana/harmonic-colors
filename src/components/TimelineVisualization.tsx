/**
 * TimelineVisualization - Timeline display for chord progression
 * Shows chord colors flowing from left to right
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from 'three';
import { Chord, Key, Section } from '../types';
import { generateKeyColor, generateChordColor, getMarbleRatio, generateParticles } from '../utils/colorGenerator';
import TimelineSegment from './TimelineSegment';
import ParticleSystem from './ParticleSystem';

interface TimelineVisualizationProps {
  chords: Chord[];
  selectedKey: Key;
  sections?: Section[]; // All sections for key lookup
  currentIndex: number;
  playbackPosition: number;
  mode: 'playback' | 'preview';
  hueRotation?: number;
}

const TimelineVisualization = ({
  chords,
  selectedKey,
  sections = [],
  currentIndex,
  playbackPosition,
  mode,
  hueRotation = 0
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

    return chords.map((chord) => {
      // Find the section key for this chord
      const chordKey = chord.sectionId && sections.length > 0
        ? sections.find(s => s.id === chord.sectionId)?.key || selectedKey
        : selectedKey;

      // Generate colors using the chord's section key
      const keyColor = generateKeyColor(chordKey, hueRotation);
      const chordColor = generateChordColor(chord, chordKey, keyColor);
      const marbleRatio = getMarbleRatio(chord, chordKey);
      const particles = generateParticles(chord); // Generate particles for tensions
      const width = chord.duration * 0.5; // Scale duration to visual width

      const segment = {
        chord,
        color1: keyColor,
        color2: chordColor,
        marbleRatio,
        particles,
        width,
        x: currentX + width / 2 // Center position
      };

      currentX += width;
      return segment;
    });
  }, [chords, selectedKey, sections, hueRotation]);

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
      // 1 beat = 0.5 units, show about 8 beats at once
      const viewWidth = 4.0; // Show 8 beats worth of content (8 * 0.5 = 4.0 units)

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

      // Show a window of ~4 beats width
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
      const viewWidth = 4.0;
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
      const viewWidth = 4.0;
      setPreviewCameraX(viewWidth / 2); // Start at the beginning
    }
  }, [mode]);

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
          <group key={index}>
            <TimelineSegment
              color1={segment.color1}
              color2={segment.color2}
              marbleRatio={segment.marbleRatio}
              width={segment.width}
              position={[segment.x, 0, 0]}
              nextColor1={nextSegment?.color1}
              nextColor2={nextSegment?.color2}
              blendWidth={0.3}
            />
            {/* Render particles if tensions/alterations exist */}
            {segment.particles.length > 0 && (
              <ParticleSystem
                particles={segment.particles}
                position={[segment.x, 0, 0.05]}
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

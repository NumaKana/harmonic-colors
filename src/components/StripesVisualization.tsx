import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ColorHSL } from '../types';
import { lerpColor, easeOutExpo } from '../utils/animations';
import { hslToCSS } from '../utils/colorGenerator';

interface StripesVisualizationProps {
  color1: ColorHSL;
  color2: ColorHSL;
  transitionDuration?: number; // Transition duration in seconds (default: 0.3)
}

/**
 * StripesVisualization Component
 *
 * Renders a fullscreen plane with horizontal stripes:
 * - Top 20%: Color 1
 * - Middle 60%: Color 2
 * - Bottom 20%: Color 1
 *
 * Includes smooth transition animations when colors change.
 */
const StripesVisualization = ({
  color1,
  color2,
  transitionDuration = 0.3
}: StripesVisualizationProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [fromColor1, setFromColor1] = useState<ColorHSL>(color1);
  const [fromColor2, setFromColor2] = useState<ColorHSL>(color2);
  const [currentColor1, setCurrentColor1] = useState<ColorHSL>(color1);
  const [currentColor2, setCurrentColor2] = useState<ColorHSL>(color2);

  // Create canvas texture for stripes
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  // Create canvas texture on mount
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 100;
    const canvasTexture = new THREE.CanvasTexture(canvas);
    setTexture(canvasTexture);

    return () => {
      canvasTexture.dispose();
    };
  }, []);

  // Detect color changes and start animation
  useEffect(() => {
    const color1Changed =
      color1.hue !== currentColor1.hue ||
      color1.saturation !== currentColor1.saturation ||
      color1.lightness !== currentColor1.lightness;

    const color2Changed =
      color2.hue !== currentColor2.hue ||
      color2.saturation !== currentColor2.saturation ||
      color2.lightness !== currentColor2.lightness;

    if (color1Changed || color2Changed) {
      // Start new animation
      setFromColor1(currentColor1);
      setFromColor2(currentColor2);
      setAnimationProgress(0);
      setIsAnimating(true);
    }
  }, [color1, color2, currentColor1, currentColor2]);

  // Update canvas texture with current colors
  useEffect(() => {
    if (!texture) return;

    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get CSS color strings
    const color1CSS = hslToCSS(currentColor1);
    const color2CSS = hslToCSS(currentColor2);

    // Top stripe (20%): Color 1
    ctx.fillStyle = color1CSS;
    ctx.fillRect(0, 0, 1, 20);

    // Middle stripe (60%): Color 2
    ctx.fillStyle = color2CSS;
    ctx.fillRect(0, 20, 1, 60);

    // Bottom stripe (20%): Color 1
    ctx.fillStyle = color1CSS;
    ctx.fillRect(0, 80, 1, 20);

    // Mark texture as needing update
    texture.needsUpdate = true;
  }, [texture, currentColor1, currentColor2]);

  // Animation loop
  useFrame((_, delta) => {
    if (isAnimating) {
      // Update animation progress
      const newProgress = Math.min(animationProgress + delta / transitionDuration, 1.0);
      setAnimationProgress(newProgress);

      // Apply easing (easeOutExpo: fast start, slow end)
      const easedProgress = easeOutExpo(newProgress);

      // Interpolate colors
      const interpolatedColor1 = lerpColor(fromColor1, color1, easedProgress);
      const interpolatedColor2 = lerpColor(fromColor2, color2, easedProgress);

      setCurrentColor1(interpolatedColor1);
      setCurrentColor2(interpolatedColor2);

      // End animation when complete
      if (newProgress >= 1.0) {
        setIsAnimating(false);
      }
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef}>
      {/* Fullscreen plane geometry */}
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

export default StripesVisualization;

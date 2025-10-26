import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { vertexShader, fragmentShader } from '../shaders/marbleShader';
import { ColorHSL } from '../types';
import { lerpColor, easeOutExpo } from '../utils/animations';

interface ColorGradientMeshProps {
  color1: ColorHSL;
  color2: ColorHSL;
  marbleRatio?: number; // 0.0 - 1.0 (higher = more color1)
  noiseScale?: number; // Scale of the noise pattern
  noiseStrength?: number; // Strength of the noise effect (0.0 - 1.0)
  octaves?: number; // Number of noise octaves for FBM (1-8)
  transitionDuration?: number; // Transition duration in seconds (default: 0.3)
}

/**
 * ColorGradientMesh Component
 *
 * Renders a fullscreen plane with a marble pattern shader
 * that organically blends two HSL colors using Perlin noise.
 *
 * The marble ratio determines the base mix between colors,
 * while noise adds organic variation to create a marble effect.
 *
 * Includes smooth transition animations when colors change.
 */
const ColorGradientMesh = ({
  color1,
  color2,
  marbleRatio = 0.5,
  noiseScale = 3.0,
  noiseStrength = 0.3,
  octaves = 4,
  transitionDuration = 0.3
}: ColorGradientMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [fromColor1, setFromColor1] = useState<ColorHSL>(color1);
  const [fromColor2, setFromColor2] = useState<ColorHSL>(color2);
  const [fromMarbleRatio, setFromMarbleRatio] = useState<number>(marbleRatio);
  const [currentColor1, setCurrentColor1] = useState<ColorHSL>(color1);
  const [currentColor2, setCurrentColor2] = useState<ColorHSL>(color2);
  const [currentMarbleRatio, setCurrentMarbleRatio] = useState<number>(marbleRatio);

  // Create shader material with HSL and marble uniforms
  const uniforms = useMemo(
    () => ({
      uColor1HSL: {
        value: new THREE.Vector3(color1.hue, color1.saturation / 100, color1.lightness / 100),
      },
      uColor2HSL: {
        value: new THREE.Vector3(color2.hue, color2.saturation / 100, color2.lightness / 100),
      },
      uMarbleRatio: { value: marbleRatio },
      uTime: { value: 0.0 },
      uNoiseScale: { value: noiseScale },
      uNoiseStrength: { value: noiseStrength },
      uOctaves: { value: octaves },
    }),
    [] // Only create once
  );

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

    const ratioChanged = marbleRatio !== currentMarbleRatio;

    if (color1Changed || color2Changed || ratioChanged) {
      // Start new animation
      setFromColor1(currentColor1);
      setFromColor2(currentColor2);
      setFromMarbleRatio(currentMarbleRatio);
      setAnimationProgress(0);
      setIsAnimating(true);
    }
  }, [color1, color2, marbleRatio, currentColor1, currentColor2, currentMarbleRatio]);

  // Animation loop
  useFrame((state, delta) => {
    if (isAnimating) {
      // Update animation progress
      const newProgress = Math.min(animationProgress + delta / transitionDuration, 1.0);
      setAnimationProgress(newProgress);

      // Apply easing (easeOutExpo: fast start, slow end)
      const easedProgress = easeOutExpo(newProgress);

      // Interpolate colors
      const interpolatedColor1 = lerpColor(fromColor1, color1, easedProgress);
      const interpolatedColor2 = lerpColor(fromColor2, color2, easedProgress);
      const interpolatedRatio = fromMarbleRatio + (marbleRatio - fromMarbleRatio) * easedProgress;

      setCurrentColor1(interpolatedColor1);
      setCurrentColor2(interpolatedColor2);
      setCurrentMarbleRatio(interpolatedRatio);

      // End animation when complete
      if (newProgress >= 1.0) {
        setIsAnimating(false);
      }
    }

    // Update shader uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uColor1HSL.value.set(
        currentColor1.hue,
        currentColor1.saturation / 100,
        currentColor1.lightness / 100
      );
      materialRef.current.uniforms.uColor2HSL.value.set(
        currentColor2.hue,
        currentColor2.saturation / 100,
        currentColor2.lightness / 100
      );
      materialRef.current.uniforms.uMarbleRatio.value = currentMarbleRatio;
      materialRef.current.uniforms.uNoiseScale.value = noiseScale;
      materialRef.current.uniforms.uNoiseStrength.value = noiseStrength;
      materialRef.current.uniforms.uOctaves.value = octaves;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Fullscreen plane geometry */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default ColorGradientMesh;

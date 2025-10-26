import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { vertexShader, fragmentShader } from '../shaders/marbleShader';
import { ColorHSL } from '../types';

interface ColorGradientMeshProps {
  color1: ColorHSL;
  color2: ColorHSL;
  marbleRatio?: number; // 0.0 - 1.0 (higher = more color1)
  noiseScale?: number; // Scale of the noise pattern
  noiseStrength?: number; // Strength of the noise effect (0.0 - 1.0)
  octaves?: number; // Number of noise octaves for FBM (1-8)
}

/**
 * ColorGradientMesh Component
 *
 * Renders a fullscreen plane with a marble pattern shader
 * that organically blends two HSL colors using Perlin noise.
 *
 * The marble ratio determines the base mix between colors,
 * while noise adds organic variation to create a marble effect.
 */
const ColorGradientMesh = ({
  color1,
  color2,
  marbleRatio = 0.5,
  noiseScale = 3.0,
  noiseStrength = 0.3,
  octaves = 4
}: ColorGradientMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

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

  // Update uniforms when colors or parameters change
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor1HSL.value.set(
        color1.hue,
        color1.saturation / 100,
        color1.lightness / 100
      );
      materialRef.current.uniforms.uColor2HSL.value.set(
        color2.hue,
        color2.saturation / 100,
        color2.lightness / 100
      );
      materialRef.current.uniforms.uMarbleRatio.value = marbleRatio;
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

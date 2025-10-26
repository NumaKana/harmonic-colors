import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { vertexShader, fragmentShader } from '../shaders/gradientShader';
import { ColorHSL } from '../types';

interface ColorGradientMeshProps {
  color1: ColorHSL;
  color2: ColorHSL;
}

/**
 * ColorGradientMesh Component
 *
 * Renders a fullscreen plane with a vertical gradient shader
 * that interpolates between two HSL colors.
 *
 * This replaces the CSS linear-gradient with a WebGL shader implementation.
 */
const ColorGradientMesh = ({ color1, color2 }: ColorGradientMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create shader material with HSL uniforms
  const uniforms = useMemo(
    () => ({
      uColor1HSL: {
        value: new THREE.Vector3(color1.hue, color1.saturation / 100, color1.lightness / 100),
      },
      uColor2HSL: {
        value: new THREE.Vector3(color2.hue, color2.saturation / 100, color2.lightness / 100),
      },
    }),
    [] // Only create once
  );

  // Update uniforms when colors change
  useFrame(() => {
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

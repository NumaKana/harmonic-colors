/**
 * TimelineSegment - Single chord segment in the timeline
 * Displays a colored plane representing one chord's duration and color
 */

import { useRef, useMemo } from 'react';
import { Mesh, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { ColorHSL, VisualizationStyle } from '../types';
import { vertexShader, fragmentShader } from '../shaders/timelineShader';
import { stripesVertexShader, stripesFragmentShader } from '../shaders/stripesTimelineShader';

interface TimelineSegmentProps {
  color1: ColorHSL;
  color2: ColorHSL;
  marbleRatio: number;
  width: number;
  position: [number, number, number];
  nextColor1?: ColorHSL;
  nextColor2?: ColorHSL;
  blendWidth?: number;
  visualizationStyle?: VisualizationStyle;
}

const TimelineSegment = ({
  color1,
  color2,
  marbleRatio,
  width,
  position,
  nextColor1,
  nextColor2,
  blendWidth = 0.3,
  visualizationStyle = 'marble'
}: TimelineSegmentProps) => {
  const meshRef = useRef<Mesh>(null);

  // Create shader material with marble or stripes effect
  const shaderMaterial = useMemo(() => {
    const hasNext = nextColor1 && nextColor2;
    const isStripes = visualizationStyle === 'stripes';

    const baseUniforms = {
      uColor1HSL: { value: [color1.hue, color1.saturation / 100, color1.lightness / 100] },
      uColor2HSL: { value: [color2.hue, color2.saturation / 100, color2.lightness / 100] },
      uNextColor1HSL: { value: hasNext ? [nextColor1.hue, nextColor1.saturation / 100, nextColor1.lightness / 100] : [0, 0, 0] },
      uNextColor2HSL: { value: hasNext ? [nextColor2.hue, nextColor2.saturation / 100, nextColor2.lightness / 100] : [0, 0, 0] },
      uHasNext: { value: hasNext ? 1.0 : 0.0 },
      uBlendWidth: { value: blendWidth }
    };

    if (isStripes) {
      return new ShaderMaterial({
        vertexShader: stripesVertexShader,
        fragmentShader: stripesFragmentShader,
        uniforms: baseUniforms
      });
    } else {
      return new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          ...baseUniforms,
          uMarbleRatio: { value: marbleRatio },
          uTime: { value: 0 },
          uNoiseScale: { value: 2.0 },
          uNoiseStrength: { value: 0.8 },
          uOctaves: { value: 4 }
        }
      });
    }
  }, [visualizationStyle]);

  // Update uniforms when colors change
  useMemo(() => {
    const hasNext = nextColor1 && nextColor2;
    const isStripes = visualizationStyle === 'stripes';

    shaderMaterial.uniforms.uColor1HSL.value = [
      color1.hue,
      color1.saturation / 100,
      color1.lightness / 100
    ];
    shaderMaterial.uniforms.uColor2HSL.value = [
      color2.hue,
      color2.saturation / 100,
      color2.lightness / 100
    ];

    // Only update marbleRatio for marble style
    if (!isStripes && shaderMaterial.uniforms.uMarbleRatio) {
      shaderMaterial.uniforms.uMarbleRatio.value = marbleRatio;
    }

    shaderMaterial.uniforms.uHasNext.value = hasNext ? 1.0 : 0.0;
    shaderMaterial.uniforms.uBlendWidth.value = blendWidth;

    if (hasNext) {
      shaderMaterial.uniforms.uNextColor1HSL.value = [
        nextColor1.hue,
        nextColor1.saturation / 100,
        nextColor1.lightness / 100
      ];
      shaderMaterial.uniforms.uNextColor2HSL.value = [
        nextColor2.hue,
        nextColor2.saturation / 100,
        nextColor2.lightness / 100
      ];
    }
  }, [color1, color2, marbleRatio, nextColor1, nextColor2, blendWidth, visualizationStyle, shaderMaterial]);

  // Animate time uniform (only for marble style)
  useFrame((state) => {
    if (shaderMaterial && shaderMaterial.uniforms.uTime) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} material={shaderMaterial}>
      <planeGeometry args={[width, 2, 32, 32]} />
    </mesh>
  );
};

export default TimelineSegment;

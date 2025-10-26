/**
 * GLSL Shader for marble pattern visualization
 *
 * This shader creates a fluid marbling effect using domain warping technique.
 * The pattern mimics traditional marbling art where paint is dropped on water
 * and swirled to create organic, flowing patterns.
 *
 * Technique: Domain Warping (multi-layered FBM distortion)
 * - Layer 1: Initial noise distortion field (q)
 * - Layer 2: Warp coordinates using layer 1 (r)
 * - Layer 3: Final pattern using warped coordinates
 * - Result: Fluid, swirling marble patterns with veins and depth
 */

import { noiseGLSL } from './noiseUtils.glsl';

export const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform vec3 uColor1HSL; // HSL color 1 (top) - Key color
  uniform vec3 uColor2HSL; // HSL color 2 (bottom) - Chord color
  uniform float uMarbleRatio; // Base marble ratio (0.0 - 1.0)
  uniform float uTime; // Animation time
  uniform float uNoiseScale; // Noise scale (higher = more detail)
  uniform float uNoiseStrength; // Noise strength (0.0 - 1.0)
  uniform int uOctaves; // Number of noise octaves for FBM

  varying vec2 vUv;

  ${noiseGLSL}

  /**
   * Convert HSL to RGB
   * @param hsl vec3(hue [0-360], saturation [0-1], lightness [0-1])
   * @return vec3(r, g, b) [0-1]
   */
  vec3 hsl2rgb(vec3 hsl) {
    float h = hsl.x / 360.0; // Normalize hue to [0, 1]
    float s = hsl.y;
    float l = hsl.z;

    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
    float m = l - c / 2.0;

    vec3 rgb;

    if (h < 1.0 / 6.0) {
      rgb = vec3(c, x, 0.0);
    } else if (h < 2.0 / 6.0) {
      rgb = vec3(x, c, 0.0);
    } else if (h < 3.0 / 6.0) {
      rgb = vec3(0.0, c, x);
    } else if (h < 4.0 / 6.0) {
      rgb = vec3(0.0, x, c);
    } else if (h < 5.0 / 6.0) {
      rgb = vec3(x, 0.0, c);
    } else {
      rgb = vec3(c, 0.0, x);
    }

    return rgb + m;
  }

  void main() {
    // Convert HSL to RGB
    vec3 color1 = hsl2rgb(uColor1HSL);
    vec3 color2 = hsl2rgb(uColor2HSL);

    // === Domain Warping for Fluid Marbling Effect ===
    // Start with base UV coordinates (reduce scale for larger patterns)
    vec2 uv = vUv * uNoiseScale * 0.5;

    // Layer 1: Create initial distortion field
    vec2 q = vec2(
      fbm(uv + uTime * 0.05, uOctaves),
      fbm(uv + vec2(5.2, 1.3) + uTime * 0.05, uOctaves)
    );

    // Layer 2: Warp the coordinates using the first distortion (increase warp strength)
    vec2 r = vec2(
      fbm(uv + q * 3.0 + vec2(1.7, 9.2) + uTime * 0.08, uOctaves),
      fbm(uv + q * 3.0 + vec2(8.3, 2.8) + uTime * 0.08, uOctaves)
    );

    // Layer 3: Final pattern using twice-warped coordinates (increase warp strength)
    float pattern = fbm(uv + r * 2.0 + uTime * 0.03, uOctaves);

    // Normalize pattern from [-1, 1] to [0, 1]
    pattern = pattern * 0.5 + 0.5;

    // Apply marble ratio with smooth gradient
    // Create flowing veins effect
    float veinPattern = abs(sin(pattern * 10.0 + r.x * 5.0));
    veinPattern = smoothstep(0.3, 0.7, veinPattern);

    // Combine pattern with marble ratio
    float mixFactor = pattern * (1.0 - uMarbleRatio) + uMarbleRatio;

    // Add vein details for more realistic marble
    mixFactor = mix(mixFactor, veinPattern, uNoiseStrength * 0.3);

    // Smooth the transition between colors
    mixFactor = smoothstep(0.0, 1.0, mixFactor);

    // Mix colors with the warped pattern
    vec3 finalColor = mix(color2, color1, mixFactor);

    // Add subtle color variation for depth
    float colorVariation = fbm(uv * 0.5 + r * 2.0, 2) * 0.1;
    finalColor += colorVariation;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

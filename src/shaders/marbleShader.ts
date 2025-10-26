/**
 * GLSL Shader for marble pattern visualization
 *
 * This shader creates an organic marble effect by blending two colors
 * using Perlin noise. The marble ratio is determined by the harmonic
 * function of the current chord.
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

    // Generate noise pattern
    // Combine UV coordinates with time for animated marble
    vec2 noiseCoord = vUv * uNoiseScale + uTime * 0.1;

    // Use FBM for richer, more organic patterns
    float noise = fbm(noiseCoord, uOctaves);

    // Normalize noise from [-1, 1] to [0, 1]
    noise = noise * 0.5 + 0.5;

    // Calculate threshold based on marble ratio
    // Areas where noise > threshold show color1
    // Areas where noise <= threshold show color2
    float threshold = 1.0 - uMarbleRatio;

    // Add slight variation to threshold for more organic edges
    float variationNoise = cnoise(vUv * uNoiseScale * 0.5) * 0.5 + 0.5;
    threshold += (variationNoise - 0.5) * uNoiseStrength;

    // Use smoothstep for slightly softer edges between colors
    // This creates a more natural marble look
    // Wider range = smoother transitions between colors
    float colorMix = smoothstep(threshold - 0.15, threshold + 0.15, noise);

    // Select color based on threshold
    // Higher marble ratio = more color1 regions
    vec3 finalColor = mix(color2, color1, colorMix);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

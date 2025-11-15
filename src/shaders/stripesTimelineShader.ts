/**
 * GLSL Shader for timeline segment with horizontal stripes
 *
 * Creates horizontal stripes pattern:
 * - Top 20%: Color 1
 * - Middle 60%: Color 2
 * - Bottom 20%: Color 1
 */

export const stripesVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const stripesFragmentShader = `
  uniform vec3 uColor1HSL; // HSL color 1 (top/bottom) - Key color
  uniform vec3 uColor2HSL; // HSL color 2 (middle) - Chord color
  uniform vec3 uNextColor1HSL; // Next segment's key color (optional)
  uniform vec3 uNextColor2HSL; // Next segment's chord color (optional)
  uniform float uHasNext; // 1.0 if next segment exists, 0.0 otherwise
  uniform float uBlendWidth; // Width of blend region (0.0 - 1.0)

  varying vec2 vUv;
  varying vec3 vWorldPosition;

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
    // Convert HSL to RGB for current segment
    vec3 color1 = hsl2rgb(uColor1HSL);
    vec3 color2 = hsl2rgb(uColor2HSL);

    // Create horizontal stripes based on vertical position (vUv.y)
    // Top 20%: Color 1
    // Middle 60%: Color 2
    // Bottom 20%: Color 1
    vec3 currentColor;

    if (vUv.y > 0.8) {
      // Top 20%: Color 1
      currentColor = color1;
    } else if (vUv.y > 0.2) {
      // Middle 60%: Color 2
      currentColor = color2;
    } else {
      // Bottom 20%: Color 1
      currentColor = color1;
    }

    // === Horizontal gradient to next segment ===
    if (uHasNext > 0.5) {
      // Calculate blend factor based on horizontal position
      // Blend in the rightmost portion of the segment
      float blendStart = 1.0 - uBlendWidth;
      float horizontalBlend = smoothstep(blendStart, 1.0, vUv.x);

      // Convert next segment's colors
      vec3 nextColor1 = hsl2rgb(uNextColor1HSL);
      vec3 nextColor2 = hsl2rgb(uNextColor2HSL);

      // Create same stripe pattern for next segment
      vec3 nextColor;
      if (vUv.y > 0.8) {
        nextColor = nextColor1;
      } else if (vUv.y > 0.2) {
        nextColor = nextColor2;
      } else {
        nextColor = nextColor1;
      }

      // Blend current and next colors
      currentColor = mix(currentColor, nextColor, horizontalBlend);
    }

    gl_FragColor = vec4(currentColor, 1.0);
  }
`;

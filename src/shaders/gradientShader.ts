/**
 * GLSL Shader for vertical gradient with HSL color support
 *
 * This shader creates a vertical gradient between two colors,
 * supporting HSL to RGB conversion in the fragment shader.
 */

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

  varying vec2 vUv;

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

    // Vertical gradient: top (vUv.y = 1.0) = color1, bottom (vUv.y = 0.0) = color2
    vec3 finalColor = mix(color2, color1, vUv.y);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

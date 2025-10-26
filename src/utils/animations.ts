import { ColorHSL } from '../types';

/**
 * Linear interpolation between two numbers
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Linear interpolation between two HSL colors
 * Handles hue wrapping for shortest path interpolation
 */
export function lerpColor(from: ColorHSL, to: ColorHSL, t: number): ColorHSL {
  // Handle hue wrapping for shortest path
  let fromHue = from.hue;
  let toHue = to.hue;

  // Calculate shortest path between hues
  const diff = toHue - fromHue;
  if (diff > 180) {
    fromHue += 360;
  } else if (diff < -180) {
    toHue += 360;
  }

  const interpolatedHue = lerp(fromHue, toHue, t) % 360;

  return {
    hue: interpolatedHue < 0 ? interpolatedHue + 360 : interpolatedHue,
    saturation: lerp(from.saturation, to.saturation, t),
    lightness: lerp(from.lightness, to.lightness, t),
  };
}

/**
 * Easing function: ease-in-out cubic
 * Creates smooth acceleration and deceleration
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Easing function: ease-in-out quadratic
 * Gentler than cubic
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Easing function: ease-out exponential
 * Fast start, slow end
 */
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Easing function: ease-in-out exponential
 * Smooth start and end with fast middle
 */
export function easeInOutExpo(t: number): number {
  return t === 0
    ? 0
    : t === 1
    ? 1
    : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
}

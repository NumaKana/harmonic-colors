/**
 * ParticleSystem - Renders floating particles for chord tensions
 * Uses Three.js Points for GPU-optimized rendering
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleConfig } from '../types';

interface ParticleSystemProps {
  particles: ParticleConfig[];
  position: [number, number, number];
  width: number;
  height?: number;
}

const ParticleSystem = ({
  particles,
  position,
  width,
  height = 2.0
}: ParticleSystemProps) => {
  const pointsRefs = useRef<Array<THREE.Points<THREE.BufferGeometry> | null>>([]);

  // Generate particle geometry and materials for each particle config
  const particleSystems = useMemo(() => {
    return particles.map((config) => {
      const count = config.count;
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const phases = new Float32Array(count);

      // Initialize particle positions and velocities
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Random position within segment bounds
        positions[i3] = (Math.random() - 0.5) * width; // x
        positions[i3 + 1] = (Math.random() - 0.5) * height; // y
        positions[i3 + 2] = 0; // z

        // Random velocity for floating animation (very slow movement)
        // Scale velocity by width to maintain consistent relative speed
        const velocityScale = Math.min(width / 2.0, 1.0); // Normalize to reference width of 2.0
        velocities[i3] = (Math.random() - 0.5) * 0.002 * velocityScale; // x velocity (very slow)
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.002 * velocityScale; // y velocity (very slow)
        velocities[i3 + 2] = 0; // z velocity

        // Random phase for animation variation
        phases[i] = Math.random() * Math.PI * 2;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

      // Parse HSL color string to THREE.Color
      const color = new THREE.Color(config.color);

      const material = new THREE.PointsMaterial({
        color: color,
        size: config.size * 0.75, // Very large particles (75x the original size)
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      return {
        geometry,
        material,
        count,
        config
      };
    });
  }, [particles, width, height]);

  // Animate particles
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    pointsRefs.current.forEach((points, index) => {
      if (!points) return;

      const geometry = points.geometry;
      const positions = geometry.attributes.position.array as Float32Array;
      const velocities = geometry.attributes.velocity.array as Float32Array;
      const phases = geometry.attributes.phase.array as Float32Array;
      const count = particleSystems[index].count;

      // Scale float amplitude by width to maintain consistent relative movement
      const floatScale = Math.min(width / 2.0, 1.0); // Normalize to reference width of 2.0

      // Update each particle position
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const phase = phases[i];

        // Floating animation with sine wave (very slow and gentle)
        const floatX = Math.sin(time * 0.1 + phase) * 0.001 * floatScale;
        const floatY = Math.cos(time * 0.15 + phase) * 0.001 * floatScale;

        // Update position with velocity and floating
        positions[i3] += velocities[i3] + floatX;
        positions[i3 + 1] += velocities[i3 + 1] + floatY;

        // Wrap particles around bounds
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        if (positions[i3] > halfWidth) positions[i3] = -halfWidth;
        if (positions[i3] < -halfWidth) positions[i3] = halfWidth;
        if (positions[i3 + 1] > halfHeight) positions[i3 + 1] = -halfHeight;
        if (positions[i3 + 1] < -halfHeight) positions[i3 + 1] = halfHeight;
      }

      geometry.attributes.position.needsUpdate = true;

      // Very slow rotation of entire particle system
      points.rotation.z = Math.sin(time * 0.05) * 0.03;
    });
  });

  return (
    <group position={position}>
      {particleSystems.map((system, index) => (
        <points
          key={`${system.config.type}-${index}`}
          ref={(ref) => { pointsRefs.current[index] = ref as THREE.Points<THREE.BufferGeometry> | null; }}
          geometry={system.geometry}
          material={system.material}
        />
      ))}
    </group>
  );
};

export default ParticleSystem;

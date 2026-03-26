"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COLORS = ["#4a9eff", "#7c3aed", "#06b6d4"];

interface Particle {
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  baseSize: number;
  pulseSpeed: number;
}

const TechParticles = () => {
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      orbitRadius: 0.2 + Math.random() * 0.25,
      orbitSpeed: 0.8 + Math.random() * 1.2,
      orbitOffset: (Math.PI * 2 * i) / 10 + Math.random() * 0.5,
      baseSize: 0.02 + Math.random() * 0.02,
      pulseSpeed: 1.5 + Math.random() * 1.5,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      const angle = t * p.orbitSpeed + p.orbitOffset;
      mesh.position.set(
        Math.cos(angle) * p.orbitRadius,
        Math.sin(angle) * p.orbitRadius * 0.6,
        Math.sin(angle * 0.7) * p.orbitRadius * 0.3
      );

      const scale = p.baseSize + Math.sin(t * p.pulseSpeed) * p.baseSize * 0.3;
      mesh.scale.setScalar(scale / p.baseSize);
    });
  });

  return (
    <group>
      {particles.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[p.baseSize, 8, 8]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export { TechParticles };

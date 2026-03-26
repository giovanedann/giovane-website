"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NETWORK_COLORS = ["#4a9eff", "#7c3aed", "#06b6d4"];
const PARTICLE_COUNT = 40;
const CONNECTION_DISTANCE = 2.0;
const BOUNDS = { xMin: -6, xMax: -1, yMin: -3, yMax: 3, zMin: -3, zMax: 1 };

interface NetworkParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
  size: number;
}

const ParticleNetwork = () => {
  const particleMeshRefs = useRef<THREE.Mesh[]>([]);
  const lineGeometryRef = useRef<THREE.BufferGeometry>(null!);

  const particles = useMemo<NetworkParticle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      position: new THREE.Vector3(
        BOUNDS.xMin + Math.random() * (BOUNDS.xMax - BOUNDS.xMin),
        BOUNDS.yMin + Math.random() * (BOUNDS.yMax - BOUNDS.yMin),
        BOUNDS.zMin + Math.random() * (BOUNDS.zMax - BOUNDS.zMin)
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.003
      ),
      color: NETWORK_COLORS[Math.floor(Math.random() * NETWORK_COLORS.length)],
      size: 0.03 + Math.random() * 0.03,
    }));
  }, []);

  const maxLines = PARTICLE_COUNT * (PARTICLE_COUNT - 1);
  const linePositions = useMemo(() => new Float32Array(maxLines * 3 * 2), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 3 * 2), [maxLines]);

  useFrame(() => {
    let lineIndex = 0;

    particles.forEach((p, i) => {
      p.position.add(p.velocity);

      if (p.position.x < BOUNDS.xMin || p.position.x > BOUNDS.xMax) p.velocity.x *= -1;
      if (p.position.y < BOUNDS.yMin || p.position.y > BOUNDS.yMax) p.velocity.y *= -1;
      if (p.position.z < BOUNDS.zMin || p.position.z > BOUNDS.zMax) p.velocity.z *= -1;

      const mesh = particleMeshRefs.current[i];
      if (mesh) {
        mesh.position.copy(p.position);
        const fadeX = 1 - Math.max(0, (p.position.x - BOUNDS.xMax + 1.5) / 1.5);
        (mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0.05, fadeX * 0.6);
      }

      for (let j = i + 1; j < particles.length; j++) {
        const dist = p.position.distanceTo(particles[j].position);
        if (dist < CONNECTION_DISTANCE) {
          const idx = lineIndex * 6;
          linePositions[idx] = p.position.x;
          linePositions[idx + 1] = p.position.y;
          linePositions[idx + 2] = p.position.z;
          linePositions[idx + 3] = particles[j].position.x;
          linePositions[idx + 4] = particles[j].position.y;
          linePositions[idx + 5] = particles[j].position.z;

          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.3;
          lineColors[idx] = 0.29 * opacity;
          lineColors[idx + 1] = 0.62 * opacity;
          lineColors[idx + 2] = 1.0 * opacity;
          lineColors[idx + 3] = 0.29 * opacity;
          lineColors[idx + 4] = 0.62 * opacity;
          lineColors[idx + 5] = 1.0 * opacity;

          lineIndex++;
        }
      }
    });

    if (lineGeometryRef.current) {
      lineGeometryRef.current.setAttribute(
        "position",
        new THREE.BufferAttribute(linePositions.slice(0, lineIndex * 6), 3)
      );
      lineGeometryRef.current.setAttribute(
        "color",
        new THREE.BufferAttribute(lineColors.slice(0, lineIndex * 6), 3)
      );
      lineGeometryRef.current.computeBoundingSphere();
    }
  });

  return (
    <group>
      {particles.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) particleMeshRefs.current[i] = el;
          }}
          position={p.position}
        >
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry ref={lineGeometryRef} />
        <lineBasicMaterial vertexColors transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
};

export { ParticleNetwork };

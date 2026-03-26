"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BODY_COLOR = "#1a1a2e";
const CORE_COLOR = "#4a9eff";

const RobotTorso = () => {
  const coreRef = useRef<THREE.Mesh>(null!);
  const coreLightRef = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.4 + 1.0;
    if (coreRef.current) {
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
    if (coreLightRef.current) {
      coreLightRef.current.intensity = pulse * 0.5;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 16]} />
        <meshStandardMaterial color={BODY_COLOR} metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 1.2, 16]} />
        <meshStandardMaterial color={BODY_COLOR} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh ref={coreRef} position={[0, 0.1, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={CORE_COLOR}
          emissive={CORE_COLOR}
          emissiveIntensity={1.0}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight
        ref={coreLightRef}
        position={[0, 0.1, 0.5]}
        color={CORE_COLOR}
        intensity={0.5}
        distance={3}
        decay={2}
      />
    </group>
  );
};

export { RobotTorso };

"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Physics, RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { TechCube } from "./TechCube";
import { TECH_ITEMS } from "./cubeConfig";

const generatePositions = (count: number): [number, number, number][] => {
  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 3 + Math.random() * 4;
    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
    const y = (Math.random() - 0.5) * 5;
    const z = -2 + Math.random() * 2;
    positions.push([x, y, z]);
  }
  return positions;
};

const generateRotations = (count: number): [number, number, number][] => {
  return Array.from({ length: count }, () => [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
  ] as [number, number, number]);
};

const FloatingForce = () => {
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta;
  });

  return null;
};

const SceneContent = () => {
  const positions = useMemo(() => generatePositions(TECH_ITEMS.length), []);
  const rotations = useMemo(() => generateRotations(TECH_ITEMS.length), []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <directionalLight position={[-5, -5, 5]} intensity={0.2} color="#4a9eff" />
      <pointLight position={[0, 0, 8]} intensity={0.3} color="#7c3aed" />
      <Environment preset="city" backgroundIntensity={0} />

      <Physics gravity={[0, 0, 0]} timeStep="vary">
        <FloatingForce />
        {TECH_ITEMS.map((tech, i) => (
          <TechCube
            key={tech.name}
            name={tech.name}
            color={tech.color}
            position={positions[i]}
            rotation={rotations[i]}
          />
        ))}
      </Physics>
    </>
  );
};

const FloatingCubesScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <SceneContent />
    </Canvas>
  );
};

export { FloatingCubesScene };

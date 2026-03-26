"use client";

import { useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { TechCube } from "./TechCube";

const CUBE_COUNT = 35;

interface CubeData {
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
}

const generateCubes = (count: number): CubeData[] => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = 2.5 + Math.random() * 5;
    return {
      position: [
        Math.cos(angle) * radius + (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 6,
        -3 + Math.random() * 4,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ] as [number, number, number],
      size: 0.35 + Math.random() * 0.45,
    };
  });
};

const SceneContent = () => {
  const cubes = useMemo(() => generateCubes(CUBE_COUNT), []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, 5]} intensity={0.3} color="#4a9eff" />
      <pointLight position={[0, 0, 8]} intensity={0.4} color="#7c3aed" />

      <Physics gravity={[0, 0, 0]} timeStep="vary">
        {cubes.map((cube, i) => (
          <TechCube
            key={i}
            position={cube.position}
            rotation={cube.rotation}
            size={cube.size}
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
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      dpr={[1, 1.5]}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
};

export { FloatingCubesScene };

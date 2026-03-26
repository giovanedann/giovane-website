"use client";

import { useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { TechCube } from "./TechCube";
import { GridFloor } from "./GridFloor";

const CUBE_COUNT = 30;

interface CubeData {
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
}

const generateCubes = (count: number): CubeData[] => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const radius = 2 + Math.random() * 4.5;
    return {
      position: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 5,
        -2 + Math.random() * 2,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ] as [number, number, number],
      size: 0.3 + Math.random() * 0.35,
    };
  });
};

const SceneContent = () => {
  const cubes = useMemo(() => generateCubes(CUBE_COUNT), []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 8, 5]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-5, 3, 3]} intensity={0.3} color="#8888ff" />
      <pointLight position={[0, 0, 6]} intensity={0.3} />
      <fog attach="fog" args={["#000000", 10, 25]} />

      <GridFloor />

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
      camera={{ position: [0, 0.5, 10], fov: 55 }}
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

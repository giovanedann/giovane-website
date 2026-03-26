"use client";

import { useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Cube } from "./Cube";

interface CubeData {
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
}

const generateCubes = (): CubeData[] => {
  const cubes: CubeData[] = [];
  const rot = () => [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2] as [number, number, number];

  for (let i = 0; i < 25; i++) {
    const angle = (i / 25) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const radius = 2.5 + Math.random() * 4;
    cubes.push({
      position: [Math.cos(angle) * radius, (Math.random() - 0.5) * 5, -2 + Math.random() * 2],
      rotation: rot(),
      size: 0.5 + Math.random() * 0.4,
    });
  }

  for (let i = 0; i < 15; i++) {
    cubes.push({
      position: [(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 5, -4 + Math.random() * 2],
      rotation: rot(),
      size: 0.35 + Math.random() * 0.25,
    });
  }

  return cubes;
};

const SceneContent = () => {
  const cubes = useMemo(() => generateCubes(), []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-6, 2, -3]} intensity={0.6} color="#8090ff" />
      <directionalLight position={[4, -3, -4]} intensity={0.4} color="#9070dd" />
      <pointLight position={[0, 3, 6]} intensity={0.5} />
      <fog attach="fog" args={["#1a1a1a", 12, 22]} />

      <Physics gravity={[0, 0, 0]} timeStep="vary">
        {cubes.map((cube, i) => (
          <Cube
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

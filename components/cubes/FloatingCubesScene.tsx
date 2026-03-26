"use client";

import { useRef, useState, useCallback, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import { Cube } from "./Cube";
import { CubeContextMenu } from "./CubeContextMenu";

export interface CubeData {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
}

let cubeIdCounter = 0;
const nextId = () => `cube-${cubeIdCounter++}`;

const rot = (): [number, number, number] => [
  Math.random() * Math.PI * 2,
  Math.random() * Math.PI * 2,
  Math.random() * Math.PI * 2,
];

const generateInitialCubes = (): CubeData[] => {
  return Array.from({ length: 40 }, () => ({
    id: nextId(),
    position: [
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 10,
      -3 + Math.random() * 3,
    ] as [number, number, number],
    rotation: rot(),
    size: 0.4 + Math.random() * 0.5,
  }));
};

interface MenuState {
  visible: boolean;
  x: number;
  y: number;
  cubeId: string;
  cubeWorldPos: [number, number, number];
  cubeSize: number;
}

interface SceneContentProps {
  cubes: CubeData[];
  onCubeContextMenu: (id: string, screenX: number, screenY: number, worldPos: [number, number, number], size: number) => void;
  gravityOn: boolean;
}

const MouseLight = () => {
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame(({ pointer, camera }) => {
    if (!lightRef.current) return;
    const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const distance = 5;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    lightRef.current.position.copy(pos);
  });

  return <pointLight ref={lightRef} intensity={0.8} distance={6} decay={2} color="#ffffff" />;
};

const SceneContent = ({ cubes, onCubeContextMenu, gravityOn }: SceneContentProps) => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-6, 2, -3]} intensity={0.6} color="#8090ff" />
      <directionalLight position={[4, -3, -4]} intensity={0.4} color="#9070dd" />
      <pointLight position={[0, 3, 6]} intensity={0.5} />
      <MouseLight />
      <fog attach="fog" args={["#0a0a0a", 12, 22]} />

      <Physics gravity={gravityOn ? [0, -9.81, 0] : [0, 0, 0]} timeStep="vary">
        {cubes.map((cube) => (
          <Cube
            key={cube.id}
            id={cube.id}
            position={cube.position}
            rotation={cube.rotation}
            size={cube.size}
            onContextMenu={onCubeContextMenu}
          />
        ))}
      </Physics>
    </>
  );
};

interface FloatingCubesSceneOuterProps {
  keyboardAction?: string | null;
}

const FloatingCubesScene = ({ keyboardAction }: FloatingCubesSceneOuterProps) => {
  const [cubes, setCubes] = useState<CubeData[]>([]);
  const [gravityOn, setGravityOn] = useState(false);

  useEffect(() => {
    setCubes(generateInitialCubes());
  }, []);

  useEffect(() => {
    if (!keyboardAction) return;

    if (keyboardAction === "explode") {
      setCubes(prev => prev.map(c => ({
        ...c,
        id: nextId(),
        position: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          -3 + Math.random() * 3,
        ] as [number, number, number],
        rotation: rot(),
      })));
    } else if (keyboardAction === "reset") {
      setCubes(generateInitialCubes());
    } else if (keyboardAction === "gravity") {
      setGravityOn(prev => !prev);
    }
  }, [keyboardAction]);

  const [menu, setMenu] = useState<MenuState>({
    visible: false,
    x: 0,
    y: 0,
    cubeId: "",
    cubeWorldPos: [0, 0, 0],
    cubeSize: 0.5,
  });

  const handleCubeContextMenu = useCallback(
    (id: string, screenX: number, screenY: number, worldPos: [number, number, number], size: number) => {
      setMenu({ visible: true, x: screenX, y: screenY, cubeId: id, cubeWorldPos: worldPos, cubeSize: size });
    },
    []
  );

  const handleCloseMenu = useCallback(() => {
    setMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleAction = useCallback(
    (action: "augment" | "shatter" | "duplicate" | "shrink") => {
      const { cubeId, cubeWorldPos, cubeSize } = menu;

      setCubes((prev) => {
        switch (action) {
          case "augment":
            return prev.map((c) =>
              c.id === cubeId ? { ...c, size: Math.min(c.size * 1.5, 2.0) } : c
            );

          case "shrink":
            return prev.map((c) =>
              c.id === cubeId ? { ...c, size: Math.max(c.size * 0.6, 0.15) } : c
            );

          case "duplicate": {
            const offset: [number, number, number] = [
              cubeWorldPos[0] + (Math.random() - 0.5) * 1.5,
              cubeWorldPos[1] + (Math.random() - 0.5) * 1.5,
              cubeWorldPos[2],
            ];
            return [...prev, { id: nextId(), position: offset, rotation: rot(), size: cubeSize }];
          }

          case "shatter": {
            const fragments: CubeData[] = Array.from({ length: 6 }, () => ({
              id: nextId(),
              position: [
                cubeWorldPos[0] + (Math.random() - 0.5) * 0.5,
                cubeWorldPos[1] + (Math.random() - 0.5) * 0.5,
                cubeWorldPos[2] + (Math.random() - 0.5) * 0.5,
              ] as [number, number, number],
              rotation: rot(),
              size: cubeSize * 0.4,
            }));
            return [...prev.filter((c) => c.id !== cubeId), ...fragments];
          }

          default:
            return prev;
        }
      });

      setMenu((prev) => ({ ...prev, visible: false }));
    },
    [menu]
  );

  return (
    <>
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
        onContextMenu={(e) => e.preventDefault()}
      >
        <Suspense fallback={null}>
          <SceneContent cubes={cubes} onCubeContextMenu={handleCubeContextMenu} gravityOn={gravityOn} />
        </Suspense>
      </Canvas>
      <CubeContextMenu
        x={menu.x}
        y={menu.y}
        visible={menu.visible}
        onAction={handleAction}
        onClose={handleCloseMenu}
      />
    </>
  );
};

export { FloatingCubesScene };

"use client";

import { useRef, useState, useCallback, useEffect, useLayoutEffect, Suspense } from "react";
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

const CAMERA_FOV = 55;
const CAMERA_Z = 10;
const AVG_CUBE_DEPTH = -1.5;
const CAMERA_DISTANCE = CAMERA_Z - AVG_CUBE_DEPTH;
const HALF_FOV_RAD = (CAMERA_FOV / 2) * (Math.PI / 180);
const BASE_CUBE_COUNT = 40;
const REF_HALF_H = CAMERA_DISTANCE * Math.tan(HALF_FOV_RAD);
const REF_AREA = REF_HALF_H * (REF_HALF_H * (16 / 9)) * 4;
const SPAWN_MARGIN = 0.95;
const MIN_CUBES = 20;
const MAX_CUBES = 120;

function computeViewportBounds() {
  const aspect = window.innerWidth / window.innerHeight;
  const halfH = CAMERA_DISTANCE * Math.tan(HALF_FOV_RAD);
  const halfW = halfH * aspect;
  const area = halfW * halfH * 4;
  const count = Math.round(BASE_CUBE_COUNT * (area / REF_AREA));
  return {
    boundsX: halfW * SPAWN_MARGIN,
    boundsY: halfH * SPAWN_MARGIN,
    cubeCount: Math.max(MIN_CUBES, Math.min(MAX_CUBES, count)),
  };
}

const generateInitialCubes = (boundsX: number, boundsY: number, count: number): CubeData[] => {
  return Array.from({ length: count }, () => ({
    id: nextId(),
    position: [
      (Math.random() - 0.5) * boundsX * 2,
      (Math.random() - 0.5) * boundsY * 2,
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
  explodeSignal: number;
  boundsX: number;
  boundsY: number;
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

const SceneContent = ({ cubes, onCubeContextMenu, gravityOn, explodeSignal, boundsX, boundsY }: SceneContentProps) => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-6, 2, -3]} intensity={0.6} color="#8090ff" />
      <directionalLight position={[4, -3, -4]} intensity={0.4} color="#9070dd" />
      <pointLight position={[0, 3, 6]} intensity={0.5} />
      <MouseLight />
      <fog attach="fog" args={["#0a0a0a", 12, 22]} />

      <Physics gravity={[0, 0, 0]} timeStep="vary">
        {cubes.map((cube) => (
          <Cube
            key={cube.id}
            id={cube.id}
            position={cube.position}
            rotation={cube.rotation}
            size={cube.size}
            onContextMenu={onCubeContextMenu}
            gravityOn={gravityOn}
            explodeSignal={explodeSignal}
            boundsX={boundsX}
            boundsY={boundsY}
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
  const [bounds, setBounds] = useState({ boundsX: 7, boundsY: 5 });
  const [gravityOn, setGravityOn] = useState(false);
  const [explodeSignal, setExplodeSignal] = useState(0);

  useLayoutEffect(() => {
    const vb = computeViewportBounds();
    setBounds({ boundsX: vb.boundsX, boundsY: vb.boundsY });
    setCubes(generateInitialCubes(vb.boundsX, vb.boundsY, vb.cubeCount));

    const handleResize = () => {
      const newBounds = computeViewportBounds();
      setBounds({ boundsX: newBounds.boundsX, boundsY: newBounds.boundsY });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!keyboardAction) return;

    if (keyboardAction === "explode") {
      setExplodeSignal((prev) => prev + 1);
    } else if (keyboardAction === "reset") {
      setGravityOn(false);
      const vb = computeViewportBounds();
      setBounds({ boundsX: vb.boundsX, boundsY: vb.boundsY });
      setCubes(generateInitialCubes(vb.boundsX, vb.boundsY, vb.cubeCount));
    } else if (keyboardAction === "gravity") {
      setGravityOn((prev) => !prev);
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
              c.id === cubeId ? { ...c, id: nextId(), position: cubeWorldPos, size: Math.min(c.size * 1.5, 2.0) } : c
            );

          case "shrink":
            return prev.map((c) =>
              c.id === cubeId ? { ...c, id: nextId(), position: cubeWorldPos, size: Math.max(c.size * 0.6, 0.15) } : c
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
        camera={{ position: [0, 0.5, CAMERA_Z], fov: CAMERA_FOV }}
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
          <SceneContent
            cubes={cubes}
            onCubeContextMenu={handleCubeContextMenu}
            gravityOn={gravityOn}
            explodeSignal={explodeSignal}
            boundsX={bounds.boundsX}
            boundsY={bounds.boundsY}
          />
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

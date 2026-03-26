"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RobotModel } from "./RobotModel";
import { ParticleNetwork } from "./ParticleNetwork";
import { useMouseTracking } from "./useMouseTracking";
import type { RobotHandRef } from "./RobotHand";

interface SceneContentProps {
  leftHandRef: React.RefObject<RobotHandRef | null>;
  hoveredButtonPosition: React.MutableRefObject<THREE.Vector3 | null>;
  isMobile: boolean;
}

const SceneContent = ({
  leftHandRef,
  hoveredButtonPosition,
  isMobile,
}: SceneContentProps) => {
  const robotPosition = useRef(new THREE.Vector3(1.8, -0.2, 0));
  const { state: mouseState, projectToWorld } = useMouseTracking(
    robotPosition.current,
    0
  );
  const mouseTarget = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    if (mouseState.isActive) {
      projectToWorld(camera);
      mouseTarget.current.copy(mouseState.target3D);
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, -2]} intensity={0.2} color="#4a9eff" />
      <RobotModel
        mouseTarget={mouseTarget}
        leftHandRef={leftHandRef}
        hoveredButtonPosition={hoveredButtonPosition}
        isMobile={isMobile}
      />
      {!isMobile && <ParticleNetwork />}
    </>
  );
};

interface RobotSceneProps {
  leftHandRef: React.RefObject<RobotHandRef | null>;
  hoveredButtonPosition: React.MutableRefObject<THREE.Vector3 | null>;
  isMobile: boolean;
}

const RobotScene = ({
  leftHandRef,
  hoveredButtonPosition,
  isMobile,
}: RobotSceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 5], fov: 50, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <Suspense fallback={null}>
        <SceneContent
          leftHandRef={leftHandRef}
          hoveredButtonPosition={hoveredButtonPosition}
          isMobile={isMobile}
        />
      </Suspense>
    </Canvas>
  );
};

export { RobotScene };

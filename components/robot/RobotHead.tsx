"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const EYE_COLOR = "#4a9eff";
const HEAD_COLOR = "#1a1a2e";

interface RobotHeadProps {
  mouseTarget: React.MutableRefObject<THREE.Vector3>;
  isMobile?: boolean;
}

const RobotHead = ({ mouseTarget, isMobile = false }: RobotHeadProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const leftEyeRef = useRef<THREE.Mesh>(null!);
  const rightEyeRef = useRef<THREE.Mesh>(null!);
  const targetQuat = useRef(new THREE.Quaternion());
  const currentQuat = useRef(new THREE.Quaternion());
  const lookAtMatrix = useRef(new THREE.Matrix4());
  const up = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((state) => {
    if (!groupRef.current) return;

    const target = mouseTarget.current;
    const headWorldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(headWorldPos);

    const relative = target.clone().sub(headWorldPos);

    const maxHorizontalAngle = THREE.MathUtils.degToRad(30);
    const maxVerticalAngle = THREE.MathUtils.degToRad(20);

    const horizontalAngle = Math.atan2(relative.x, relative.z);
    const verticalAngle = Math.atan2(
      relative.y,
      Math.sqrt(relative.x * relative.x + relative.z * relative.z)
    );

    const clampedH = THREE.MathUtils.clamp(
      horizontalAngle,
      -maxHorizontalAngle,
      maxHorizontalAngle
    );
    const clampedV = THREE.MathUtils.clamp(
      verticalAngle,
      -maxVerticalAngle,
      maxVerticalAngle
    );

    const dist = 10;
    const lookTarget = new THREE.Vector3(
      Math.sin(clampedH) * dist,
      Math.sin(clampedV) * dist,
      Math.cos(clampedH) * dist
    ).add(headWorldPos);

    lookAtMatrix.current.lookAt(headWorldPos, lookTarget, up.current);
    targetQuat.current.setFromRotationMatrix(lookAtMatrix.current);

    currentQuat.current.slerp(targetQuat.current, 0.06);
    groupRef.current.quaternion.copy(currentQuat.current);

    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 1.2;
    if (leftEyeRef.current) {
      (leftEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
    if (rightEyeRef.current) {
      (rightEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh scale={[0.55, 0.5, 0.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={HEAD_COLOR}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <mesh ref={leftEyeRef} position={[-0.2, 0.1, 0.45]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={EYE_COLOR}
          emissive={EYE_COLOR}
          emissiveIntensity={1.2}
        />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.2, 0.1, 0.45]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={EYE_COLOR}
          emissive={EYE_COLOR}
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
};

export { RobotHead };

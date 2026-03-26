"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BODY_COLOR = "#1a1a2e";
const JOINT_COLOR = "#252540";

interface RobotHandProps {
  side: "left" | "right";
}

export interface RobotHandRef {
  triggerPress: () => void;
}

const RobotHand = forwardRef<RobotHandRef, RobotHandProps>(({ side }, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  const pressOffset = useRef(0);
  const pressVelocity = useRef(0);
  const isPressed = useRef(false);
  const pressTime = useRef(0);

  useImperativeHandle(ref, () => ({
    triggerPress: () => {
      isPressed.current = true;
      pressTime.current = 0;
      pressVelocity.current = 0;
      pressOffset.current = 0;
    },
  }));

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isPressed.current) {
      pressTime.current += delta;

      if (pressTime.current < 0.1) {
        pressOffset.current = THREE.MathUtils.lerp(pressOffset.current, 0.15, 0.3);
      } else {
        const stiffness = 300;
        const damping = 15;
        const force = -stiffness * pressOffset.current;
        pressVelocity.current += force * delta;
        pressVelocity.current *= Math.exp(-damping * delta);
        pressOffset.current += pressVelocity.current * delta;

        if (
          Math.abs(pressOffset.current) < 0.001 &&
          Math.abs(pressVelocity.current) < 0.001
        ) {
          pressOffset.current = 0;
          pressVelocity.current = 0;
          isPressed.current = false;
        }
      }

      groupRef.current.position.z = pressOffset.current;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.4} />
      </mesh>
      {side === "left" && (
        <>
          {[-0.06, -0.02, 0.02, 0.06].map((offset, i) => (
            <mesh key={i} position={[offset, -0.14, 0.02]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.018, 0.08, 8]} />
              <meshStandardMaterial color={BODY_COLOR} metalness={0.7} roughness={0.4} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
});

RobotHand.displayName = "RobotHand";

export { RobotHand };

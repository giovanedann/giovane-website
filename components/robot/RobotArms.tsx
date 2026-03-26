"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useArmIK } from "./useArmIK";
import { RobotHand, type RobotHandRef } from "./RobotHand";

const BODY_COLOR = "#1a1a2e";
const JOINT_COLOR = "#252540";

const UPPER_ARM_LENGTH = 0.5;
const FOREARM_LENGTH = 0.45;

interface RobotArmsProps {
  mouseTarget: React.MutableRefObject<THREE.Vector3>;
  leftHandRef: React.RefObject<RobotHandRef | null>;
  hoveredButtonPosition: React.MutableRefObject<THREE.Vector3 | null>;
}

const ArmSegment = ({
  length,
  topRadius,
  bottomRadius,
}: {
  length: number;
  topRadius: number;
  bottomRadius: number;
}) => (
  <mesh position={[0, -length / 2, 0]}>
    <cylinderGeometry args={[topRadius, bottomRadius, length, 12]} />
    <meshStandardMaterial color={BODY_COLOR} metalness={0.8} roughness={0.3} />
  </mesh>
);

const JointSphere = ({ radius }: { radius: number }) => (
  <mesh>
    <sphereGeometry args={[radius, 16, 16]} />
    <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.4} />
  </mesh>
);

const RobotArms = ({
  mouseTarget,
  leftHandRef,
  hoveredButtonPosition,
}: RobotArmsProps) => {
  const leftShoulderRef = useRef<THREE.Group>(null!);
  const leftElbowRef = useRef<THREE.Group>(null!);

  const leftShoulderPosition = new THREE.Vector3(-0.5, 0.3, 0);

  const { solve: solveLeftArm, initializeSmoothedTarget } = useArmIK({
    upperArmLength: UPPER_ARM_LENGTH,
    forearmLength: FOREARM_LENGTH,
    shoulderPosition: leftShoulderPosition,
  });

  useEffect(() => {
    initializeSmoothedTarget(new THREE.Vector3(-1, 0, 1));
  }, [initializeSmoothedTarget]);

  useFrame(() => {
    const target = hoveredButtonPosition.current || mouseTarget.current;

    const clampedTarget = target.clone();
    clampedTarget.x = THREE.MathUtils.clamp(clampedTarget.x, -3, 0.2);
    clampedTarget.y = THREE.MathUtils.clamp(clampedTarget.y, -1.5, 1.5);

    const lerpFactor = hoveredButtonPosition.current ? 0.12 : 0.08;
    const ikResult = solveLeftArm(clampedTarget, lerpFactor);

    if (leftShoulderRef.current) {
      leftShoulderRef.current.rotation.copy(ikResult.shoulderAngle);
    }
    if (leftElbowRef.current) {
      leftElbowRef.current.rotation.set(-ikResult.elbowAngle, 0, 0);
    }
  });

  return (
    <>
      <group position={[-0.5, 0.3, 0]}>
        <JointSphere radius={0.1} />
        <group ref={leftShoulderRef}>
          <ArmSegment length={UPPER_ARM_LENGTH} topRadius={0.07} bottomRadius={0.06} />
          <group position={[0, -UPPER_ARM_LENGTH, 0]}>
            <JointSphere radius={0.08} />
            <group ref={leftElbowRef}>
              <ArmSegment length={FOREARM_LENGTH} topRadius={0.06} bottomRadius={0.055} />
              <group position={[0, -FOREARM_LENGTH, 0]}>
                <RobotHand ref={leftHandRef} side="left" />
              </group>
            </group>
          </group>
        </group>
      </group>

      <group position={[0.5, 0.3, 0]}>
        <JointSphere radius={0.1} />
        <group rotation={[0.3, 0, -0.2]}>
          <ArmSegment length={UPPER_ARM_LENGTH} topRadius={0.07} bottomRadius={0.06} />
          <group position={[0, -UPPER_ARM_LENGTH, 0]}>
            <JointSphere radius={0.08} />
            <group rotation={[-0.8, 0, 0]}>
              <ArmSegment length={FOREARM_LENGTH} topRadius={0.06} bottomRadius={0.055} />
              <group position={[0, -FOREARM_LENGTH, 0]}>
                <RobotHand side="right" />
              </group>
            </group>
          </group>
        </group>
      </group>
    </>
  );
};

export { RobotArms };

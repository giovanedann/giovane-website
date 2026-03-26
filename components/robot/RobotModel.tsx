"use client";

import * as THREE from "three";
import { RobotHead } from "./RobotHead";
import { RobotTorso } from "./RobotTorso";
import { RobotArms } from "./RobotArms";
import { RobotLegs } from "./RobotLegs";
import { TechParticles } from "./TechParticles";
import type { RobotHandRef } from "./RobotHand";

interface RobotModelProps {
  mouseTarget: React.MutableRefObject<THREE.Vector3>;
  leftHandRef: React.RefObject<RobotHandRef | null>;
  hoveredButtonPosition: React.MutableRefObject<THREE.Vector3 | null>;
  isMobile?: boolean;
}

const RobotModel = ({
  mouseTarget,
  leftHandRef,
  hoveredButtonPosition,
  isMobile = false,
}: RobotModelProps) => {
  if (isMobile) {
    return (
      <group position={[0, 0.5, 0]}>
        <RobotHead mouseTarget={mouseTarget} isMobile />
      </group>
    );
  }

  return (
    <group position={[1.8, -0.2, 0]}>
      <group position={[0, 1.2, 0]}>
        <RobotHead mouseTarget={mouseTarget} />
      </group>
      <RobotTorso />
      <RobotArms
        mouseTarget={mouseTarget}
        leftHandRef={leftHandRef}
        hoveredButtonPosition={hoveredButtonPosition}
      />
      <RobotLegs />
      <group position={[0.85, -0.65, 0.15]}>
        <TechParticles />
      </group>
    </group>
  );
};

export { RobotModel };

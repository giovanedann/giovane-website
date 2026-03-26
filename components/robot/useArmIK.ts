"use client";

import { useRef, useCallback } from "react";
import * as THREE from "three";

interface IKResult {
  shoulderAngle: THREE.Euler;
  elbowAngle: number;
  reachable: boolean;
}

interface IKConfig {
  upperArmLength: number;
  forearmLength: number;
  shoulderPosition: THREE.Vector3;
}

export const useArmIK = (config: IKConfig) => {
  const result = useRef<IKResult>({
    shoulderAngle: new THREE.Euler(),
    elbowAngle: 0,
    reachable: true,
  });

  const tempVec = useRef(new THREE.Vector3());
  const smoothedTarget = useRef(new THREE.Vector3());

  const solve = useCallback(
    (target: THREE.Vector3, lerpFactor = 0.08) => {
      smoothedTarget.current.lerp(target, lerpFactor);

      const { upperArmLength: a, forearmLength: b, shoulderPosition } = config;

      tempVec.current.copy(smoothedTarget.current).sub(shoulderPosition);
      const distance = tempVec.current.length();

      const maxReach = a + b;
      const minReach = Math.abs(a - b);

      let d = distance;
      if (d > maxReach) {
        d = maxReach;
        result.current.reachable = false;
      } else if (d < minReach) {
        d = minReach;
        result.current.reachable = false;
      } else {
        result.current.reachable = true;
      }

      const cosElbow = (a * a + b * b - d * d) / (2 * a * b);
      const elbowAngle =
        Math.PI - Math.acos(THREE.MathUtils.clamp(cosElbow, -1, 1));

      const cosShoulder = (a * a + d * d - b * b) / (2 * a * d);
      const shoulderOffsetAngle = Math.acos(
        THREE.MathUtils.clamp(cosShoulder, -1, 1)
      );

      const direction = tempVec.current.normalize();
      const baseAngleY = Math.atan2(direction.x, direction.z);
      const baseAngleX = -Math.asin(
        THREE.MathUtils.clamp(direction.y, -1, 1)
      );

      result.current.shoulderAngle.set(
        baseAngleX - shoulderOffsetAngle,
        baseAngleY,
        0
      );
      result.current.elbowAngle = elbowAngle;

      return result.current;
    },
    [config]
  );

  const initializeSmoothedTarget = useCallback(
    (position: THREE.Vector3) => {
      smoothedTarget.current.copy(position);
    },
    []
  );

  return { solve, initializeSmoothedTarget, result: result.current };
};

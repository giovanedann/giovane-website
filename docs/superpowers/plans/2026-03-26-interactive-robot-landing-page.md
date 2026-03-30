# Interactive 3D Robot Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current landing page with an interactive Three.js 3D robot that follows the user's mouse, presses buttons with its left arm, and holds floating tech particles in its right hand.

**Architecture:** Full-viewport Three.js canvas (via @react-three/fiber) renders behind HTML content. Robot is built from Three.js primitives with metallic materials. Left arm uses two-bone IK to track mouse and press buttons. Particle network fills the left side of the 3D scene. Mobile shows head-only. WebGL failure falls back to the existing BackgroundBoxes page.

**Tech Stack:** Three.js, @react-three/fiber, @react-three/drei, React 19, Next.js 16, TypeScript, motion (Framer Motion)

**Spec:** `docs/superpowers/specs/2026-03-26-interactive-robot-landing-page-design.md`

---

## File Structure

All new files go under `components/robot/`:

```
components/robot/
  useWebGLSupport.ts      -- Hook: detect WebGL availability
  useMobileDetect.ts      -- Hook: viewport < 768px detection
  useMouseTracking.ts     -- Hook: mouse position → 3D target point
  useArmIK.ts             -- Hook: two-bone IK solver (law of cosines)
  RobotHead.tsx           -- Head mesh + eye glow + mouse-follow lerp
  RobotTorso.tsx          -- Torso + chest core glow + neck
  RobotHand.tsx           -- Hand mesh + finger details + press animation
  RobotArms.tsx           -- Both arms: left IK + right static pose
  RobotLegs.tsx           -- Static legs + feet
  TechParticles.tsx       -- 8-12 orbiting particles around right hand
  ParticleNetwork.tsx     -- 40 spheres with connecting lines, left side
  RobotModel.tsx          -- Full robot assembly (groups all parts)
  RobotScene.tsx          -- R3F Canvas, camera, lighting, transparent bg
```

Modified:
```
app/page.tsx              -- Robot scene + HTML overlay + BackgroundBoxes fallback
```

---

### Task 1: Install Dependencies

**Files:** `package.json`

- [ ] **Step 1: Install Three.js and React Three Fiber**

```bash
pnpm add three @react-three/fiber @react-three/drei
pnpm add -D @types/three
```

- [ ] **Step 2: Verify install**

```bash
pnpm build
```

Expected: Build succeeds (no imports yet, just deps added).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: add three.js dependencies for robot landing page"
```

---

### Task 2: Utility Hooks

**Files:**
- Create: `components/robot/useWebGLSupport.ts`
- Create: `components/robot/useMobileDetect.ts`

- [ ] **Step 1: Create useWebGLSupport.ts**

```typescript
"use client";

import { useState, useEffect } from "react";

export const useWebGLSupport = () => {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
};
```

Returns `null` during SSR, `true`/`false` after mount. Tries webgl2 → webgl → experimental-webgl.

- [ ] **Step 2: Create useMobileDetect.ts**

```typescript
"use client";

import { useState, useEffect } from "react";

export const useMobileDetect = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
};
```

- [ ] **Step 3: Commit**

```bash
git add components/robot/useWebGLSupport.ts components/robot/useMobileDetect.ts
git commit -m "feat: add WebGL support and mobile detect hooks"
```

---

### Task 3: Mouse Tracking Hook

**Files:**
- Create: `components/robot/useMouseTracking.ts`

- [ ] **Step 1: Create useMouseTracking.ts**

Uses a `THREE.Raycaster` to intersect mouse ray with a plane in front of the robot to get world-space 3D coordinates. Tracks both mouse and touch. All state in refs (no re-renders).

```typescript
"use client";

import { useRef, useCallback, useEffect } from "react";
import * as THREE from "three";

interface MouseState {
  normalized: { x: number; y: number };
  target3D: THREE.Vector3;
  isActive: boolean;
}

export const useMouseTracking = (robotPosition: THREE.Vector3, planeZ = 0) => {
  const state = useRef<MouseState>({
    normalized: { x: 0, y: 0 },
    target3D: new THREE.Vector3(),
    isActive: false,
  });

  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), -planeZ));
  const intersectPoint = useRef(new THREE.Vector3());

  const updateFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      state.current.normalized.x = (clientX / window.innerWidth) * 2 - 1;
      state.current.normalized.y = -(clientY / window.innerHeight) * 2 + 1;
      state.current.isActive = true;
    },
    []
  );

  const projectToWorld = useCallback(
    (camera: THREE.Camera) => {
      const { normalized } = state.current;
      raycaster.current.setFromCamera(
        new THREE.Vector2(normalized.x, normalized.y),
        camera
      );
      raycaster.current.ray.intersectPlane(
        plane.current,
        intersectPoint.current
      );
      state.current.target3D.copy(intersectPoint.current);
      return state.current.target3D;
    },
    []
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) =>
      updateFromEvent(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateFromEvent(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onMouseLeave = () => {
      state.current.isActive = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [updateFromEvent]);

  useEffect(() => {
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        state.current.normalized.x = THREE.MathUtils.clamp(e.gamma / 45, -1, 1);
        state.current.normalized.y = THREE.MathUtils.clamp((e.beta - 45) / 45, -1, 1);
        state.current.isActive = true;
      }
    };

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      const requestPermission = () => {
        (DeviceOrientationEvent as any)
          .requestPermission()
          .then((response: string) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", onOrientation);
            }
          });
        window.removeEventListener("touchstart", requestPermission);
      };
      window.addEventListener("touchstart", requestPermission, { once: true });
    } else if (typeof window !== "undefined") {
      window.addEventListener("deviceorientation", onOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, []);

  return { state: state.current, projectToWorld };
};
```

- [ ] **Step 2: Commit**

```bash
git add components/robot/useMouseTracking.ts
git commit -m "feat: add mouse tracking hook with touch and gyroscope support"
```

---

### Task 4: Two-Bone IK Solver Hook

**Files:**
- Create: `components/robot/useArmIK.ts`

- [ ] **Step 1: Create useArmIK.ts**

Geometric two-bone IK using law of cosines. Built-in lerp smoothing. All refs, no re-renders.

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add components/robot/useArmIK.ts
git commit -m "feat: add two-bone IK solver hook"
```

---

### Task 5: Robot Head

**Files:**
- Create: `components/robot/RobotHead.tsx`

- [ ] **Step 1: Create RobotHead.tsx**

Slightly squished sphere head with two emissive eye spheres. Tracks mouse via quaternion slerp with clamped rotation (±30° H, ±20° V). Eye emissive intensity pulses.

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add components/robot/RobotHead.tsx
git commit -m "feat: add robot head with eye tracking"
```

---

### Task 6: Robot Torso + Legs

**Files:**
- Create: `components/robot/RobotTorso.tsx`
- Create: `components/robot/RobotLegs.tsx`

- [ ] **Step 1: Create RobotTorso.tsx**

Neck cylinder, tapered torso cylinder, and pulsing chest core with point light.

```typescript
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BODY_COLOR = "#1a1a2e";
const CORE_COLOR = "#4a9eff";

const RobotTorso = () => {
  const coreRef = useRef<THREE.Mesh>(null!);
  const coreLightRef = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.4 + 1.0;
    if (coreRef.current) {
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
    if (coreLightRef.current) {
      coreLightRef.current.intensity = pulse * 0.5;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 16]} />
        <meshStandardMaterial color={BODY_COLOR} metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 1.2, 16]} />
        <meshStandardMaterial color={BODY_COLOR} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh ref={coreRef} position={[0, 0.1, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={CORE_COLOR}
          emissive={CORE_COLOR}
          emissiveIntensity={1.0}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight
        ref={coreLightRef}
        position={[0, 0.1, 0.5]}
        color={CORE_COLOR}
        intensity={0.5}
        distance={3}
        decay={2}
      />
    </group>
  );
};

export { RobotTorso };
```

- [ ] **Step 2: Create RobotLegs.tsx**

Static legs with joint spheres and box feet. No animation.

```typescript
"use client";

const BODY_COLOR = "#1a1a2e";
const JOINT_COLOR = "#252540";

const RobotLegs = () => {
  return (
    <group position={[0, -1.0, 0]}>
      {[{ x: -0.2 }, { x: 0.2 }].map(({ x }, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.07, 0.065, 0.5, 12]} />
            <meshStandardMaterial color={BODY_COLOR} metalness={0.8} roughness={0.3} />
          </mesh>
          <group position={[0, -0.6, 0]}>
            <mesh>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.065, 0.06, 0.4, 12]} />
              <meshStandardMaterial color={BODY_COLOR} metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.55, 0.04]}>
              <boxGeometry args={[0.16, 0.08, 0.22]} />
              <meshStandardMaterial color={BODY_COLOR} metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

export { RobotLegs };
```

- [ ] **Step 3: Commit**

```bash
git add components/robot/RobotTorso.tsx components/robot/RobotLegs.tsx
git commit -m "feat: add robot torso and legs"
```

---

### Task 7: Robot Hand + Arms

**Files:**
- Create: `components/robot/RobotHand.tsx`
- Create: `components/robot/RobotArms.tsx`

- [ ] **Step 1: Create RobotHand.tsx**

Hand with `triggerPress()` exposed via `useImperativeHandle`. Press animation: 100ms forward push via lerp, then spring-damper rebound (stiffness=300, damping=15). Left hand has 4 cylinder fingers.

```typescript
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
```

- [ ] **Step 2: Create RobotArms.tsx**

Left arm: IK solver runs in `useFrame`, targets either hovered button position or mouse. Right arm: static pose with Euler rotations placing hand at bottom-right.

```typescript
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
      {/* Left arm - IK controlled */}
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

      {/* Right arm - static pose */}
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
```

- [ ] **Step 3: Commit**

```bash
git add components/robot/RobotHand.tsx components/robot/RobotArms.tsx
git commit -m "feat: add robot hand with press animation and arms with IK"
```

---

### Task 8: Tech Particles + Particle Network

**Files:**
- Create: `components/robot/TechParticles.tsx`
- Create: `components/robot/ParticleNetwork.tsx`

- [ ] **Step 1: Create TechParticles.tsx**

10 particles with randomized elliptical orbits, emissive materials (blue/purple/cyan), and size pulsing.

```typescript
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COLORS = ["#4a9eff", "#7c3aed", "#06b6d4"];

interface Particle {
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  baseSize: number;
  pulseSpeed: number;
}

const TechParticles = () => {
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      orbitRadius: 0.2 + Math.random() * 0.25,
      orbitSpeed: 0.8 + Math.random() * 1.2,
      orbitOffset: (Math.PI * 2 * i) / 10 + Math.random() * 0.5,
      baseSize: 0.02 + Math.random() * 0.02,
      pulseSpeed: 1.5 + Math.random() * 1.5,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      const angle = t * p.orbitSpeed + p.orbitOffset;
      mesh.position.set(
        Math.cos(angle) * p.orbitRadius,
        Math.sin(angle) * p.orbitRadius * 0.6,
        Math.sin(angle * 0.7) * p.orbitRadius * 0.3
      );

      const scale = p.baseSize + Math.sin(t * p.pulseSpeed) * p.baseSize * 0.3;
      mesh.scale.setScalar(scale / p.baseSize);
    });
  });

  return (
    <group>
      {particles.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[p.baseSize, 8, 8]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export { TechParticles };
```

- [ ] **Step 2: Create ParticleNetwork.tsx**

40 particles bounded to the left side of the scene. Connected by dynamic BufferGeometry lines when within distance threshold. Particles fade toward center.

```typescript
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NETWORK_COLORS = ["#4a9eff", "#7c3aed", "#06b6d4"];
const PARTICLE_COUNT = 40;
const CONNECTION_DISTANCE = 2.0;
const BOUNDS = { xMin: -6, xMax: -1, yMin: -3, yMax: 3, zMin: -3, zMax: 1 };

interface NetworkParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
  size: number;
}

const ParticleNetwork = () => {
  const particleMeshRefs = useRef<THREE.Mesh[]>([]);
  const lineGeometryRef = useRef<THREE.BufferGeometry>(null!);

  const particles = useMemo<NetworkParticle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      position: new THREE.Vector3(
        BOUNDS.xMin + Math.random() * (BOUNDS.xMax - BOUNDS.xMin),
        BOUNDS.yMin + Math.random() * (BOUNDS.yMax - BOUNDS.yMin),
        BOUNDS.zMin + Math.random() * (BOUNDS.zMax - BOUNDS.zMin)
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.003
      ),
      color: NETWORK_COLORS[Math.floor(Math.random() * NETWORK_COLORS.length)],
      size: 0.03 + Math.random() * 0.03,
    }));
  }, []);

  const maxLines = PARTICLE_COUNT * (PARTICLE_COUNT - 1);
  const linePositions = useMemo(() => new Float32Array(maxLines * 3 * 2), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 3 * 2), [maxLines]);

  useFrame(() => {
    let lineIndex = 0;

    particles.forEach((p, i) => {
      p.position.add(p.velocity);

      if (p.position.x < BOUNDS.xMin || p.position.x > BOUNDS.xMax) p.velocity.x *= -1;
      if (p.position.y < BOUNDS.yMin || p.position.y > BOUNDS.yMax) p.velocity.y *= -1;
      if (p.position.z < BOUNDS.zMin || p.position.z > BOUNDS.zMax) p.velocity.z *= -1;

      const mesh = particleMeshRefs.current[i];
      if (mesh) {
        mesh.position.copy(p.position);
        const fadeX = 1 - Math.max(0, (p.position.x - BOUNDS.xMax + 1.5) / 1.5);
        (mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0.05, fadeX * 0.6);
      }

      for (let j = i + 1; j < particles.length; j++) {
        const dist = p.position.distanceTo(particles[j].position);
        if (dist < CONNECTION_DISTANCE) {
          const idx = lineIndex * 6;
          linePositions[idx] = p.position.x;
          linePositions[idx + 1] = p.position.y;
          linePositions[idx + 2] = p.position.z;
          linePositions[idx + 3] = particles[j].position.x;
          linePositions[idx + 4] = particles[j].position.y;
          linePositions[idx + 5] = particles[j].position.z;

          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.3;
          lineColors[idx] = 0.29 * opacity;
          lineColors[idx + 1] = 0.62 * opacity;
          lineColors[idx + 2] = 1.0 * opacity;
          lineColors[idx + 3] = 0.29 * opacity;
          lineColors[idx + 4] = 0.62 * opacity;
          lineColors[idx + 5] = 1.0 * opacity;

          lineIndex++;
        }
      }
    });

    if (lineGeometryRef.current) {
      lineGeometryRef.current.setAttribute(
        "position",
        new THREE.BufferAttribute(linePositions.slice(0, lineIndex * 6), 3)
      );
      lineGeometryRef.current.setAttribute(
        "color",
        new THREE.BufferAttribute(lineColors.slice(0, lineIndex * 6), 3)
      );
      lineGeometryRef.current.computeBoundingSphere();
    }
  });

  return (
    <group>
      {particles.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) particleMeshRefs.current[i] = el;
          }}
          position={p.position}
        >
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry ref={lineGeometryRef} />
        <lineBasicMaterial vertexColors transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
};

export { ParticleNetwork };
```

- [ ] **Step 3: Commit**

```bash
git add components/robot/TechParticles.tsx components/robot/ParticleNetwork.tsx
git commit -m "feat: add tech particles and particle network"
```

---

### Task 9: Robot Model Assembly + Scene

**Files:**
- Create: `components/robot/RobotModel.tsx`
- Create: `components/robot/RobotScene.tsx`

- [ ] **Step 1: Create RobotModel.tsx**

Groups all robot parts. Robot positioned at [1.8, -0.2, 0] (right of center). On mobile, renders head only at [0, 0.5, 0].

```typescript
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
```

- [ ] **Step 2: Create RobotScene.tsx**

R3F Canvas with transparent background, camera at [0, 0.5, 5], three-point lighting, pointer-events: none. SceneContent is a separate inner component for R3F hooks.

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add components/robot/RobotModel.tsx components/robot/RobotScene.tsx
git commit -m "feat: add robot model assembly and Three.js scene"
```

---

### Task 10: Update Landing Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite app/page.tsx**

Dynamic-import `RobotScene` with `ssr: false`. WebGL check flow: `null` → loading, `false` → fallback (current page), `true` → robot scene + HTML overlay. Button hover/click handlers communicate positions to Three.js arm via refs.

```typescript
"use client";

import { useRef, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { BackgroundBoxes } from "@/components/aceternity/background-boxes";
import { Button } from "@/components/ui/button";
import { useWebGLSupport } from "@/components/robot/useWebGLSupport";
import { useMobileDetect } from "@/components/robot/useMobileDetect";
import type { RobotHandRef } from "@/components/robot/RobotHand";
import * as THREE from "three";

const RobotScene = dynamic(
  () =>
    import("@/components/robot/RobotScene").then((mod) => ({
      default: mod.RobotScene,
    })),
  { ssr: false }
);

const FallbackPage = () => (
  <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
    <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-background [mask-image:radial-gradient(transparent,white)]" />
    <BackgroundBoxes />
    <div className="relative z-20 flex flex-col items-center gap-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold text-foreground md:text-7xl"
      >
        Giovane Saes
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xl font-medium text-muted-foreground md:text-2xl"
      >
        Product & AI Engineer
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-lg text-foreground/80"
      >
        Who are <span className="font-bold">you</span>?
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <Link href="/blog">
          <Button variant="outline" size="lg" className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50">
            I am an engineer
          </Button>
        </Link>
        <Link href="/about">
          <Button variant="outline" size="lg" className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50">
            I am a recruiter
          </Button>
        </Link>
        <Link href="/game">
          <Button variant="outline" size="lg" className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50">
            I am a wanderer
          </Button>
        </Link>
      </motion.div>
    </div>
  </div>
);

const BUTTON_CONFIG = [
  { label: "I am an engineer", href: "/blog" },
  { label: "I am a recruiter", href: "/about" },
  { label: "I am a wanderer", href: "/game" },
] as const;

export default function Home() {
  const webglSupported = useWebGLSupport();
  const isMobile = useMobileDetect();
  const router = useRouter();

  const leftHandRef = useRef<RobotHandRef | null>(null);
  const hoveredButtonPosition = useRef<THREE.Vector3 | null>(null);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const screenToWorld = useCallback(
    (element: HTMLElement): THREE.Vector3 => {
      const rect = element.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
      const y = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
      return new THREE.Vector3(x * 3.5, y * 2.5, 1);
    },
    []
  );

  const handleButtonHover = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isMobile) return;
      hoveredButtonPosition.current = screenToWorld(e.currentTarget);
    },
    [screenToWorld, isMobile]
  );

  const handleButtonLeave = useCallback(() => {
    hoveredButtonPosition.current = null;
  }, []);

  const handleButtonClick = useCallback(
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isMobile) return;
      e.preventDefault();
      setPressedButton(href);
      leftHandRef.current?.triggerPress();
      setTimeout(() => {
        router.push(href);
      }, 300);
    },
    [isMobile, router]
  );

  if (webglSupported === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background" />
    );
  }

  if (!webglSupported) {
    return <FallbackPage />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <RobotScene
        leftHandRef={leftHandRef}
        hoveredButtonPosition={hoveredButtonPosition}
        isMobile={isMobile}
      />

      <div
        className={
          isMobile
            ? "relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6"
            : "relative z-10 flex h-full flex-col justify-center gap-8 pl-[10%] md:pl-[15%] lg:pl-[20%]"
        }
        style={isMobile ? undefined : { maxWidth: "50%" }}
      >
        {isMobile && <div className="h-32" />}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={
            isMobile
              ? "text-center text-4xl font-bold text-foreground"
              : "text-5xl font-bold text-foreground md:text-7xl"
          }
        >
          Giovane Saes
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={
            isMobile
              ? "text-center text-lg font-medium text-muted-foreground"
              : "text-xl font-medium text-muted-foreground md:text-2xl"
          }
        >
          Product & AI Engineer
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={
            isMobile
              ? "text-center text-base text-foreground/80"
              : "mt-4 text-lg text-foreground/80"
          }
        >
          Who are <span className="font-bold">you</span>?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={isMobile ? "flex w-full flex-col gap-3" : "flex flex-col gap-4"}
        >
          {BUTTON_CONFIG.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
              onClick={handleButtonClick(href)}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                animate={
                  pressedButton === href
                    ? { scale: [1, 0.97, 1], transition: { duration: 0.2 } }
                    : undefined
                }
              >
                {label}
              </Button>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Verify dev**

```bash
pnpm dev
```

Open http://localhost:3000. Expected:
- Robot visible on the right side with dark metallic body
- Head and left arm follow mouse
- Particle network visible on the left
- Buttons work and trigger arm press animation
- Navigation occurs after ~300ms

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: replace landing page with interactive 3D robot"
```

---

### Task 11: Visual Tuning + Verification

- [ ] **Step 1: Test all interactions on desktop**

1. Move mouse around — head and left arm follow smoothly at 60fps
2. Hover each button — arm reaches toward button position
3. Click each button — arm press animation plays, navigation occurs after 300ms
4. Check no jank/stuttering in Chrome DevTools Performance tab

- [ ] **Step 2: Test mobile layout**

Resize browser to <768px:
1. Only robot head renders (no body/arms/particles)
2. Buttons stack vertically
3. Eyes track touch position
4. No arm press interactions

- [ ] **Step 3: Test WebGL fallback**

Chrome DevTools → Rendering → check "Disable WebGL":
1. Current BackgroundBoxes page renders
2. All three buttons navigate correctly

- [ ] **Step 4: Test cross-browser**

Test on Firefox and Safari:
1. Robot renders correctly
2. Arm tracking works
3. No WebGL errors in console

- [ ] **Step 5: Tune IK parameters if needed**

If the left arm looks awkward:
- Adjust clamp range in `RobotArms.tsx` (x: [-3, 0.2], y: [-1.5, 1.5])
- Adjust lerp factors (0.08 for mouse, 0.12 for button hover)
- Adjust `screenToWorld` scale factors in `page.tsx` (3.5 for X, 2.5 for Y)

If the head movement feels off:
- Adjust slerp factor in `RobotHead.tsx` (currently 0.06)
- Adjust rotation clamp angles (currently ±30° H, ±20° V)

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: tune robot interactions and verify cross-browser"
```

---

## Notes

**Performance:** All animation state is in refs (no React re-renders during animation). Canvas DPR clamped to [1, 2]. Dynamic import code-splits Three.js to landing page only. Total scene polygon count under 10k.

**Screen-to-world mapping:** The `screenToWorld` function uses an approximate NDC-to-world mapping (not camera unprojection). This works because the arm lerps toward the target, smoothing minor inaccuracies. Adjust scale factors (3.5x, 2.5y) if the arm consistently misses buttons.

**Bundle impact:** Three.js adds ~150KB gzipped. `next/dynamic` with `ssr: false` ensures it only loads on the landing page.

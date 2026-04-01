"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

interface CubeProps {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
  onContextMenu?: (id: string, screenX: number, screenY: number, worldPos: [number, number, number], size: number) => void;
  gravityOn?: boolean;
  explodeSignal?: number;
  boundsX?: number;
  boundsY?: number;
}

const LEFT_BUTTON = 0;

const Cube = ({ id, position, rotation = [0, 0, 0], size = 0.6, onContextMenu, gravityOn = false, explodeSignal = 0, boundsX = 7, boundsY = 5 }: CubeProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const dragOffset = useRef(new THREE.Vector3());

  const floatSeed = useRef({
    xFreq: 0.15 + Math.random() * 0.2,
    yFreq: 0.1 + Math.random() * 0.15,
    zFreq: 0.05 + Math.random() * 0.1,
    xPhase: Math.random() * Math.PI * 2,
    yPhase: Math.random() * Math.PI * 2,
    zPhase: Math.random() * Math.PI * 2,
    rotSpeed: 0.05 + Math.random() * 0.08,
  });

  const lastExplodeSignal = useRef(explodeSignal);

  useEffect(() => {
    if (explodeSignal > lastExplodeSignal.current && rigidBodyRef.current) {
      lastExplodeSignal.current = explodeSignal;
      const pos = rigidBodyRef.current.translation();
      const dir = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
      if (dir.length() < 0.1) dir.set(Math.random() - 0.5, Math.random() - 0.5, 0).normalize();
      const strength = 3 + Math.random() * 2;
      rigidBodyRef.current.applyImpulse(
        { x: dir.x * strength, y: dir.y * strength, z: dir.z * strength * 0.3 },
        true
      );
      rigidBodyRef.current.applyTorqueImpulse(
        { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5, z: (Math.random() - 0.5) * 0.5 },
        true
      );
    }
  }, [explodeSignal]);

  useFrame((state) => {
    if (!rigidBodyRef.current) return;

    if (isDragging) {
      const intersection = new THREE.Vector3();
      state.raycaster.ray.intersectPlane(dragPlane.current, intersection);
      intersection.add(dragOffset.current);

      rigidBodyRef.current.setTranslation(
        { x: intersection.x, y: intersection.y, z: intersection.z },
        true
      );
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    const angVel = rigidBodyRef.current.angvel();
    const maxAngVel = 0.3;
    if (Math.abs(angVel.x) > maxAngVel || Math.abs(angVel.y) > maxAngVel || Math.abs(angVel.z) > maxAngVel) {
      rigidBodyRef.current.setAngvel(
        {
          x: THREE.MathUtils.clamp(angVel.x, -maxAngVel, maxAngVel),
          y: THREE.MathUtils.clamp(angVel.y, -maxAngVel, maxAngVel),
          z: THREE.MathUtils.clamp(angVel.z, -maxAngVel, maxAngVel),
        },
        true
      );
    }

    const linVel = rigidBodyRef.current.linvel();
    const maxLinVel = 1.0;
    if (Math.abs(linVel.x) > maxLinVel || Math.abs(linVel.y) > maxLinVel || Math.abs(linVel.z) > maxLinVel) {
      rigidBodyRef.current.setLinvel(
        {
          x: THREE.MathUtils.clamp(linVel.x, -maxLinVel, maxLinVel),
          y: THREE.MathUtils.clamp(linVel.y, -maxLinVel, maxLinVel),
          z: THREE.MathUtils.clamp(linVel.z, -maxLinVel, maxLinVel),
        },
        true
      );
    }

    const t = state.clock.elapsedTime;
    const s = floatSeed.current;
    const force = 0.002;
    rigidBodyRef.current.applyImpulse(
      {
        x: Math.sin(t * s.xFreq + s.xPhase) * force,
        y: Math.cos(t * s.yFreq + s.yPhase) * force,
        z: Math.sin(t * s.zFreq + s.zPhase) * force * 0.3,
      },
      true
    );

    const torque = 0.0003 * s.rotSpeed;
    rigidBodyRef.current.applyTorqueImpulse(
      {
        x: Math.sin(t * 0.3 + s.xPhase) * torque,
        y: Math.cos(t * 0.2 + s.yPhase) * torque,
        z: Math.sin(t * 0.25 + s.zPhase) * torque,
      },
      true
    );

    if (gravityOn) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: -0.008, z: 0 }, true);
    }

    const mouseVec = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
    mouseVec.unproject(state.camera);
    const mouseDir = mouseVec.sub(state.camera.position).normalize();
    const mousePos = state.camera.position.clone().add(mouseDir.multiplyScalar(5));

    const cubePos = rigidBodyRef.current.translation();
    const toMouse = new THREE.Vector3(
      mousePos.x - cubePos.x,
      mousePos.y - cubePos.y,
      0
    );
    const dist = toMouse.length();
    if (dist < 4) {
      const attractionForce = 0.0008 * (1 - dist / 4);
      toMouse.normalize().multiplyScalar(attractionForce);
      rigidBodyRef.current.applyImpulse(
        { x: toMouse.x, y: toMouse.y, z: 0 },
        true
      );
    }

    const pos = rigidBodyRef.current.translation();
    const boundsZ = 4;
    if (Math.abs(pos.x) > boundsX || Math.abs(pos.y) > boundsY || Math.abs(pos.z) > boundsZ) {
      const clamped = {
        x: THREE.MathUtils.clamp(pos.x, -boundsX, boundsX),
        y: THREE.MathUtils.clamp(pos.y, -boundsY, boundsY),
        z: THREE.MathUtils.clamp(pos.z, -boundsZ, boundsZ),
      };
      rigidBodyRef.current.setTranslation(clamped, true);
      const vel = rigidBodyRef.current.linvel();
      rigidBodyRef.current.setLinvel(
        { x: vel.x * -0.5, y: vel.y * -0.5, z: vel.z * -0.5 },
        true
      );
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.nativeEvent.button !== LEFT_BUTTON) return;
    e.stopPropagation();
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    document.body.style.cursor = "grabbing";

    if (rigidBodyRef.current) {
      rigidBodyRef.current.setBodyType(2, true);

      const pos = rigidBodyRef.current.translation();
      const bodyPos = new THREE.Vector3(pos.x, pos.y, pos.z);

      dragPlane.current.setFromNormalAndCoplanarPoint(
        e.camera.getWorldDirection(new THREE.Vector3()).negate(),
        bodyPos
      );

      const intersection = new THREE.Vector3();
      e.ray.intersectPlane(dragPlane.current, intersection);
      dragOffset.current.copy(bodyPos).sub(intersection);
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (e.nativeEvent.button !== LEFT_BUTTON) return;
    (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    setIsDragging(false);
    document.body.style.cursor = "";

    if (rigidBodyRef.current) {
      rigidBodyRef.current.setBodyType(0, true);

      const throwDirection = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1,
      );
      rigidBodyRef.current.applyImpulse(
        { x: throwDirection.x, y: throwDirection.y, z: throwDirection.z },
        true
      );
    }
  };

  const handleRightClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();

    const pos = rigidBodyRef.current?.translation();
    if (pos && onContextMenu) {
      onContextMenu(
        id,
        e.nativeEvent.clientX,
        e.nativeEvent.clientY,
        [pos.x, pos.y, pos.z],
        size
      );
    }
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      rotation={rotation}
      linearDamping={3.0}
      angularDamping={4.0}
      gravityScale={0}
      colliders="cuboid"
      restitution={0.5}
      friction={0.2}
    >
      <RoundedBox
        args={[size, size, size]}
        radius={0.08}
        smoothness={4}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={() => {
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          if (!isDragging) document.body.style.cursor = "";
          if (isDragging) {
            setIsDragging(false);
            if (rigidBodyRef.current) {
              rigidBodyRef.current.setBodyType(0, true);
            }
          }
        }}
        onContextMenu={handleRightClick}
      >
        <meshStandardMaterial
          color="#444450"
          metalness={0.15}
          roughness={0.5}
        />
      </RoundedBox>
    </RigidBody>
  );
};

export { Cube };

"use client";

import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useCanvasTexture } from "./useCanvasTexture";

interface TechCubeProps {
  name: string;
  color: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}

const TechCube = ({ name, color, position, rotation = [0, 0, 0] }: TechCubeProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const dragOffset = useRef(new THREE.Vector3());
  const texture = useCanvasTexture(name, color);

  const floatSeed = useRef({
    xFreq: 0.3 + Math.random() * 0.4,
    yFreq: 0.2 + Math.random() * 0.3,
    zFreq: 0.1 + Math.random() * 0.2,
    xPhase: Math.random() * Math.PI * 2,
    yPhase: Math.random() * Math.PI * 2,
    zPhase: Math.random() * Math.PI * 2,
    rotSpeed: 0.1 + Math.random() * 0.2,
  });

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

    const t = state.clock.elapsedTime;
    const s = floatSeed.current;
    const force = 0.015;
    rigidBodyRef.current.applyImpulse(
      {
        x: Math.sin(t * s.xFreq + s.xPhase) * force,
        y: Math.cos(t * s.yFreq + s.yPhase) * force,
        z: Math.sin(t * s.zFreq + s.zPhase) * force * 0.5,
      },
      true
    );

    const torque = 0.003 * s.rotSpeed;
    rigidBodyRef.current.applyTorqueImpulse(
      {
        x: Math.sin(t * 0.5 + s.xPhase) * torque,
        y: Math.cos(t * 0.3 + s.yPhase) * torque,
        z: Math.sin(t * 0.4 + s.zPhase) * torque,
      },
      true
    );

    const pos = rigidBodyRef.current.translation();
    const maxDist = 12;
    if (Math.abs(pos.x) > maxDist || Math.abs(pos.y) > maxDist || Math.abs(pos.z) > maxDist) {
      rigidBodyRef.current.setTranslation(
        {
          x: THREE.MathUtils.clamp(pos.x, -maxDist, maxDist),
          y: THREE.MathUtils.clamp(pos.y, -maxDist, maxDist),
          z: THREE.MathUtils.clamp(pos.z, -maxDist, maxDist),
        },
        true
      );
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    setIsDragging(true);

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
    (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    setIsDragging(false);

    if (rigidBodyRef.current) {
      rigidBodyRef.current.setBodyType(0, true);

      const throwDirection = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      rigidBodyRef.current.applyImpulse(
        { x: throwDirection.x, y: throwDirection.y, z: throwDirection.z },
        true
      );
    }
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      rotation={rotation}
      linearDamping={1.5}
      angularDamping={1.0}
      gravityScale={0}
      colliders="cuboid"
      restitution={0.6}
      friction={0.3}
    >
      <RoundedBox
        ref={meshRef}
        args={[0.75, 0.75, 0.75]}
        radius={0.1}
        smoothness={4}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => {
          setIsHovered(false);
          if (isDragging) {
            setIsDragging(false);
            if (rigidBodyRef.current) {
              rigidBodyRef.current.setBodyType(0, true);
            }
          }
        }}
      >
        <meshStandardMaterial
          map={texture}
          color={isHovered ? color : "#ffffff"}
          metalness={0.2}
          roughness={0.3}
          transparent
          opacity={isHovered ? 0.95 : 0.85}
        />
      </RoundedBox>
    </RigidBody>
  );
};

export { TechCube };

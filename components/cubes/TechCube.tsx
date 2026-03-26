"use client";

import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

interface TechCubeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
}

const TechCube = ({ position, rotation = [0, 0, 0], size = 0.6 }: TechCubeProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const dragOffset = useRef(new THREE.Vector3());

  const floatSeed = useRef({
    xFreq: 0.15 + Math.random() * 0.2,
    yFreq: 0.1 + Math.random() * 0.15,
    zFreq: 0.05 + Math.random() * 0.1,
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
    const force = 0.003;
    rigidBodyRef.current.applyImpulse(
      {
        x: Math.sin(t * s.xFreq + s.xPhase) * force,
        y: Math.cos(t * s.yFreq + s.yPhase) * force,
        z: Math.sin(t * s.zFreq + s.zPhase) * force * 0.3,
      },
      true
    );

    const torque = 0.0006 * s.rotSpeed;
    rigidBodyRef.current.applyTorqueImpulse(
      {
        x: Math.sin(t * 0.5 + s.xPhase) * torque,
        y: Math.cos(t * 0.3 + s.yPhase) * torque,
        z: Math.sin(t * 0.4 + s.zPhase) * torque,
      },
      true
    );

    const pos = rigidBodyRef.current.translation();
    const boundsX = 7;
    const boundsY = 5;
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

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      rotation={rotation}
      linearDamping={3.0}
      angularDamping={2.5}
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
          setIsHovered(true);
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          setIsHovered(false);
          if (!isDragging) document.body.style.cursor = "";
          if (isDragging) {
            setIsDragging(false);
            if (rigidBodyRef.current) {
              rigidBodyRef.current.setBodyType(0, true);
            }
          }
        }}
      >
        <meshStandardMaterial
          color={isHovered ? "#555560" : "#404048"}
          metalness={0.85}
          roughness={0.15}
          emissive={isHovered ? "#ffffff" : "#000000"}
          emissiveIntensity={isHovered ? 0.03 : 0}
        />
      </RoundedBox>
    </RigidBody>
  );
};

export { TechCube };

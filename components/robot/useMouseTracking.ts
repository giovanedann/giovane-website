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

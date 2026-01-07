"use client";

import { useRef, useCallback, useEffect } from "react";

interface UseGameLoopOptions {
  onUpdate: (deltaTime: number) => void;
  isRunning: boolean;
}

export function useGameLoop({ onUpdate, isRunning }: UseGameLoopOptions) {
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!isRunning) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      return;
    }

    lastTimeRef.current = 0;

    const loop = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      onUpdateRef.current(deltaTime);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, [isRunning]);

  const reset = useCallback(() => {
    lastTimeRef.current = 0;
  }, []);

  return { reset };
}

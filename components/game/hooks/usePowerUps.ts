"use client";

import { useCallback } from "react";
import { PowerUpType, ActivePowerUp, POWER_UP_DURATIONS } from "../types";

interface UsePowerUpsOptions {
  activePowerUps: ActivePowerUp[];
  onActivate: (powerUp: ActivePowerUp) => void;
  onNuke: () => void;
  onShield: () => void;
  onHeal: () => void;
  onLifeSurge: () => void;
  onScoreBoost: () => void;
  onComboSaver: () => void;
}

export function usePowerUps({
  activePowerUps,
  onActivate,
  onNuke,
  onShield,
  onHeal,
  onLifeSurge,
  onScoreBoost,
  onComboSaver,
}: UsePowerUpsOptions) {
  const activatePowerUp = useCallback(
    (type: PowerUpType) => {
      if (type === "nuke") {
        onNuke();
        return;
      }

      if (type === "shield") {
        onShield();
        return;
      }

      if (type === "heal") {
        onHeal();
        return;
      }

      if (type === "lifeSurge") {
        onLifeSurge();
        return;
      }

      if (type === "scoreBoost") {
        onScoreBoost();
        return;
      }

      if (type === "comboSaver") {
        onComboSaver();
        return;
      }

      const duration = POWER_UP_DURATIONS[type];
      const powerUp: ActivePowerUp = {
        type,
        expiresAt: Date.now() + duration,
      };

      onActivate(powerUp);
    },
    [onActivate, onNuke, onShield, onHeal, onLifeSurge, onScoreBoost, onComboSaver]
  );

  const isActive = useCallback(
    (type: PowerUpType): boolean => {
      return activePowerUps.some(
        (p) => p.type === type && p.expiresAt > Date.now()
      );
    },
    [activePowerUps]
  );

  const getSpeedMultiplier = useCallback((): number => {
    if (isActive("freeze") || isActive("timeStop")) return 0;
    if (isActive("slow")) return 0.5;
    return 1;
  }, [isActive]);

  return {
    activatePowerUp,
    isActive,
    getSpeedMultiplier,
  };
}

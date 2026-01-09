import { ScoreResult, ActivePowerUp, SkillLevel } from "../types";
import { getDeviceFingerprint } from "@/lib/fingerprint";

export function calculateScore(
  wordLength: number,
  layers: number,
  combo: number,
  activePowerUps: ActivePowerUp[]
): ScoreResult {
  const basePoints = wordLength * 10;
  const layerBonus = (layers - 1) * 25;
  const comboMultiplier = Math.min(1 + combo * 0.1, 3);

  const hasDoublePoints = activePowerUps.some(
    (p) => p.type === "doublePoints" && p.expiresAt > Date.now()
  );
  const doublePointsMultiplier = hasDoublePoints ? 2 : 1;

  const total = Math.floor(
    (basePoints + layerBonus) * comboMultiplier * doublePointsMultiplier
  );

  return {
    basePoints,
    layerBonus,
    comboMultiplier,
    doublePointsMultiplier,
    total,
  };
}

interface BestScoreResponse {
  bestScore: number | null;
  skillLevel: SkillLevel;
}

export async function fetchBestScore(
  gameId: string,
  skillLevel: SkillLevel
): Promise<number> {
  try {
    const fingerprint = await getDeviceFingerprint();
    const response = await fetch(
      `/api/games/${gameId}/my-best?skillLevel=${skillLevel}`,
      {
        headers: {
          "x-device-fingerprint": fingerprint,
        },
      }
    );

    if (response.ok) {
      const data: BestScoreResponse = await response.json();
      return data.bestScore ?? 0;
    }
  } catch (error) {
    console.error("Failed to fetch best score:", error);
  }
  return 0;
}

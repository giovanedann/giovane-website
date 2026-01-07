import { ScoreResult, ActivePowerUp } from "../types";

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

const HIGH_SCORE_KEY = "typing-game-high-score";

export function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(HIGH_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function setHighScore(score: number): void {
  if (typeof window === "undefined") return;
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  }
}

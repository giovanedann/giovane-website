import { PerformanceMetrics, SkillLevel, SKILL_TIER_CONFIGS } from "../types";

const CHARS_PER_WORD = 5;
const TARGET_KILL_RATE = 0.85;
const TARGET_AVG_COMBO = 5;
const MAX_RECENT_COMBOS = 10;

export function calculateRollingWpm(
  correctCharsTyped: number,
  gameStartTime: number,
  currentTime: number
): number {
  const elapsedMinutes = (currentTime - gameStartTime) / 60000;
  if (elapsedMinutes < 0.1) return 0;

  const wordsTyped = correctCharsTyped / CHARS_PER_WORD;
  return Math.round(wordsTyped / elapsedMinutes);
}

export function calculateKillRate(
  monstersKilled: number,
  monstersEscaped: number
): number {
  const total = monstersKilled + monstersEscaped;
  if (total === 0) return 1.0;
  return monstersKilled / total;
}

export function calculateAverageCombo(recentCombos: number[]): number {
  if (recentCombos.length === 0) return 0;
  const sum = recentCombos.reduce((a, b) => a + b, 0);
  return sum / recentCombos.length;
}

export function calculatePerformanceScore(
  metrics: PerformanceMetrics,
  monstersKilled: number,
  skillLevel: SkillLevel
): number {
  const tierConfig = SKILL_TIER_CONFIGS[skillLevel];
  const targetWpm = tierConfig.targetWpm;

  const wpmScore = Math.min(metrics.rollingWpm / targetWpm, 1.5);

  const killRate = calculateKillRate(monstersKilled, metrics.monstersEscaped);
  const killRateScore = Math.min(killRate / TARGET_KILL_RATE, 1.2);

  const avgCombo = calculateAverageCombo(metrics.recentCombos);
  const comboScore = Math.min(avgCombo / TARGET_AVG_COMBO, 1.3);

  const weightedScore = wpmScore * 0.5 + killRateScore * 0.35 + comboScore * 0.15;

  return Math.max(0.5, Math.min(1.5, weightedScore));
}

export function updatePerformanceMetrics(
  metrics: PerformanceMetrics,
  monstersKilled: number,
  currentCombo: number,
  skillLevel: SkillLevel,
  currentTime: number
): PerformanceMetrics {
  const rollingWpm = calculateRollingWpm(
    metrics.correctCharactersTyped,
    metrics.gameStartTime,
    currentTime
  );

  const performanceScore = calculatePerformanceScore(
    { ...metrics, rollingWpm },
    monstersKilled,
    skillLevel
  );

  return {
    ...metrics,
    rollingWpm,
    performanceScore,
  };
}

export function addComboToHistory(
  recentCombos: number[],
  combo: number
): number[] {
  const updated = [...recentCombos, combo];
  if (updated.length > MAX_RECENT_COMBOS) {
    return updated.slice(-MAX_RECENT_COMBOS);
  }
  return updated;
}

export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

const SMOOTHING_FACTOR = 0.02;

export function updateDifficultyMultiplier(
  currentMultiplier: number,
  targetMultiplier: number,
  deltaTime: number
): number {
  const smoothingPerFrame = SMOOTHING_FACTOR * (deltaTime / 16.67);
  return lerp(currentMultiplier, targetMultiplier, smoothingPerFrame);
}

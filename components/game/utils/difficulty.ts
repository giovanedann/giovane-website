import { DifficultyConfig, SkillLevel, SKILL_TIER_CONFIGS } from "../types";
import { lerp } from "./performanceTracker";

const COLD_START_DURATION = 15000;
const FULL_PROGRESSION_TIME = 300000;

export function getAdaptiveDifficultyConfig(
  skillLevel: SkillLevel,
  elapsedTime: number,
  performanceMultiplier: number
): DifficultyConfig {
  const tierConfig = SKILL_TIER_CONFIGS[skillLevel];

  if (elapsedTime < COLD_START_DURATION) {
    return {
      minWordLength: tierConfig.baseMinWordLength,
      maxWordLength: tierConfig.baseMaxWordLength,
      spawnInterval: tierConfig.baseSpawnInterval,
      monsterSpeed: tierConfig.baseMonsterSpeed,
      maxLayers: 1,
      powerUpChance: tierConfig.basePowerUpChance,
    };
  }

  const timeProgression = Math.min(elapsedTime / FULL_PROGRESSION_TIME, 1);
  const effectiveProgression = Math.max(0, Math.min(1, timeProgression * performanceMultiplier));

  const minWordLength = Math.round(
    lerp(tierConfig.baseMinWordLength, tierConfig.baseMinWordLength + 2, effectiveProgression)
  );

  const maxWordLength = Math.round(
    lerp(tierConfig.baseMaxWordLength, tierConfig.maxWordLength, effectiveProgression)
  );

  const spawnInterval = Math.round(
    lerp(tierConfig.baseSpawnInterval, tierConfig.minSpawnInterval, effectiveProgression)
  );

  const monsterSpeed = Math.round(
    lerp(tierConfig.baseMonsterSpeed, tierConfig.maxMonsterSpeed, effectiveProgression)
  );

  const maxLayers = Math.min(
    Math.floor(1 + effectiveProgression * (tierConfig.maxLayers - 1)),
    tierConfig.maxLayers
  );

  const powerUpChance = lerp(
    tierConfig.basePowerUpChance,
    tierConfig.basePowerUpChance * 0.6,
    effectiveProgression
  );

  return {
    minWordLength,
    maxWordLength,
    spawnInterval,
    monsterSpeed,
    maxLayers,
    powerUpChance,
  };
}

export function getMonsterSpeed(
  skillLevel: SkillLevel,
  elapsedTime: number,
  performanceMultiplier: number
): number {
  const config = getAdaptiveDifficultyConfig(skillLevel, elapsedTime, performanceMultiplier);
  const variance = 0.2;
  const randomFactor = 1 + (Math.random() * variance * 2 - variance);
  return config.monsterSpeed * randomFactor;
}

export function getDifficultyConfig(elapsedTime: number): DifficultyConfig {
  return getAdaptiveDifficultyConfig("intermediate", elapsedTime, 1.0);
}

export function getSpawnInterval(elapsedTime: number): number {
  return getDifficultyConfig(elapsedTime).spawnInterval;
}

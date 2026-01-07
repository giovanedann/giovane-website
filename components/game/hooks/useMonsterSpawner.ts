"use client";

import { useRef, useCallback } from "react";
import { Monster, PowerUpType, PowerUpRarity, SkillLevel, POWER_UP_CONFIGS } from "../types";
import { getWordByDifficulty, getMaxLayers, getGibberishWord } from "../utils/wordLists";
import { getAdaptiveDifficultyConfig, getMonsterSpeed } from "../utils/difficulty";

let monsterId = 0;

interface UseMonsterSpawnerOptions {
  gameWidth: number;
  skillLevel: SkillLevel;
  performanceMultiplier: number;
  currentScore: number;
  onSpawn: (monster: Monster) => void;
}

function selectWeightedPowerUp(): { type: PowerUpType; word: string; rarity: PowerUpRarity } {
  const totalWeight = POWER_UP_CONFIGS.reduce((sum, config) => sum + config.spawnWeight, 0);
  let random = Math.random() * totalWeight;

  for (const config of POWER_UP_CONFIGS) {
    random -= config.spawnWeight;
    if (random <= 0) {
      return { type: config.type, word: config.word, rarity: config.rarity };
    }
  }

  const fallback = POWER_UP_CONFIGS[0];
  return { type: fallback.type, word: fallback.word, rarity: fallback.rarity };
}

function shouldSpawnGibberish(score: number): boolean {
  if (score < 30000) return false;

  let chance = 0;
  if (score >= 50000) {
    chance = 0.12;
  } else if (score >= 40000) {
    chance = 0.08;
  } else {
    chance = 0.05;
  }

  return Math.random() < chance;
}

export function useMonsterSpawner({
  gameWidth,
  skillLevel,
  performanceMultiplier,
  currentScore,
  onSpawn,
}: UseMonsterSpawnerOptions) {
  const lastSpawnRef = useRef<number>(0);

  const spawnMonster = useCallback(
    (elapsedTime: number) => {
      const config = getAdaptiveDifficultyConfig(skillLevel, elapsedTime, performanceMultiplier);
      const isPowerUp = Math.random() < config.powerUpChance;
      const spawnGibberish = !isPowerUp && shouldSpawnGibberish(currentScore);

      let word: string;
      let powerUpType: PowerUpType | undefined;
      let powerUpRarity: PowerUpRarity | undefined;
      let isGibberish = false;

      if (isPowerUp) {
        const selected = selectWeightedPowerUp();
        powerUpType = selected.type;
        powerUpRarity = selected.rarity;
        word = selected.word;
      } else if (spawnGibberish) {
        word = getGibberishWord(5, 10);
        isGibberish = true;
      } else {
        word = getWordByDifficulty(elapsedTime, config.minWordLength, config.maxWordLength);
      }

      const padding = 100;
      const x = padding + Math.random() * (gameWidth - padding * 2);

      const layers = isPowerUp || isGibberish ? 1 : getMaxLayers(elapsedTime, config.maxLayers);

      const monster: Monster = {
        id: `monster-${++monsterId}`,
        word,
        x,
        y: -30,
        speed: getMonsterSpeed(skillLevel, elapsedTime, performanceMultiplier),
        layers,
        currentLayer: layers,
        type: "basic",
        isPowerUp,
        powerUpType,
        powerUpRarity,
        isGibberish,
      };

      onSpawn(monster);
    },
    [gameWidth, skillLevel, performanceMultiplier, currentScore, onSpawn]
  );

  const trySpawn = useCallback(
    (currentTime: number, elapsedTime: number) => {
      const config = getAdaptiveDifficultyConfig(skillLevel, elapsedTime, performanceMultiplier);

      if (currentTime - lastSpawnRef.current >= config.spawnInterval) {
        spawnMonster(elapsedTime);
        lastSpawnRef.current = currentTime;
      }
    },
    [skillLevel, performanceMultiplier, spawnMonster]
  );

  const reset = useCallback(() => {
    lastSpawnRef.current = 0;
    monsterId = 0;
  }, []);

  return { trySpawn, spawnMonster, reset };
}

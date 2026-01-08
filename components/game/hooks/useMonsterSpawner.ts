"use client";

import { useRef, useCallback } from "react";
import { Monster, PowerUpType, PowerUpRarity, SkillLevel, POWER_UP_CONFIGS, BOSS_CONFIG, BOSS_NAMES } from "../types";
import { getWordByDifficulty, getMaxLayers, getGibberishWord, getWordsForLayers, getRandomWordInRange } from "../utils/wordLists";
import { getAdaptiveDifficultyConfig, getMonsterSpeed } from "../utils/difficulty";

let monsterId = 0;

interface UseMonsterSpawnerOptions {
  gameWidth: number;
  skillLevel: SkillLevel;
  performanceMultiplier: number;
  currentScore: number;
  monsterCount: number;
  layeredMonsterCount: number;
  onSpawn: (monster: Monster) => void;
}

function selectWeightedPowerUp(monsterCount: number): { type: PowerUpType; word: string; rarity: PowerUpRarity } {
  const availableConfigs = POWER_UP_CONFIGS.filter((config) => {
    if ((config.type === "freeze" || config.type === "timeStop") && monsterCount === 0) {
      return false;
    }
    return true;
  });

  const totalWeight = availableConfigs.reduce((sum, config) => sum + config.spawnWeight, 0);
  let random = Math.random() * totalWeight;

  for (const config of availableConfigs) {
    random -= config.spawnWeight;
    if (random <= 0) {
      return { type: config.type, word: config.word, rarity: config.rarity };
    }
  }

  const fallback = availableConfigs[0] || POWER_UP_CONFIGS[0];
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

function getLayerSpeedMultiplier(layers: number): number {
  if (layers <= 1) return 1;
  if (layers === 2) return 0.75;
  if (layers === 3) return 0.6;
  return Math.max(0.3, 1 - layers * 0.1);
}

export function useMonsterSpawner({
  gameWidth,
  skillLevel,
  performanceMultiplier,
  currentScore,
  monsterCount,
  layeredMonsterCount,
  onSpawn,
}: UseMonsterSpawnerOptions) {
  const lastSpawnRef = useRef<number>(0);
  const lastPowerUpSpawnRef = useRef<number>(0);

  const spawnMonster = useCallback(
    (elapsedTime: number) => {
      const config = getAdaptiveDifficultyConfig(skillLevel, elapsedTime, performanceMultiplier);
      const spawnGibberish = shouldSpawnGibberish(currentScore);

      let word: string;
      let words: string[];
      let isGibberish = false;

      const hasLayeredMonster = layeredMonsterCount > 0;
      const baseLayers = spawnGibberish ? 1 : getMaxLayers(elapsedTime, config.maxLayers);
      const layers = hasLayeredMonster ? 1 : baseLayers;

      if (spawnGibberish) {
        word = getGibberishWord(5, 10);
        words = [word];
        isGibberish = true;
      } else {
        const firstWord = getWordByDifficulty(elapsedTime, config.minWordLength, config.maxWordLength);
        if (layers > 1) {
          words = getWordsForLayers(layers, firstWord.length);
          if (words.length < layers) {
            const remaining = layers - words.length;
            for (let i = 0; i < remaining; i++) {
              words.push(getWordByDifficulty(elapsedTime, config.minWordLength, config.maxWordLength));
            }
          }
        } else {
          words = [firstWord];
        }
        word = words[layers - 1];
      }

      const padding = 100;
      const x = padding + Math.random() * (gameWidth - padding * 2);

      const monster: Monster = {
        id: `monster-${++monsterId}`,
        word,
        words,
        x,
        y: -30,
        speed: getMonsterSpeed(skillLevel, elapsedTime, performanceMultiplier) * getLayerSpeedMultiplier(layers),
        layers,
        currentLayer: layers,
        type: "basic",
        isPowerUp: false,
        isGibberish,
      };

      onSpawn(monster);
    },
    [gameWidth, skillLevel, performanceMultiplier, currentScore, layeredMonsterCount, onSpawn]
  );

  const spawnPowerUp = useCallback(
    (elapsedTime: number) => {
      const selected = selectWeightedPowerUp(monsterCount);

      const padding = 100;
      const x = padding + Math.random() * (gameWidth - padding * 2);

      const monster: Monster = {
        id: `powerup-${++monsterId}`,
        word: selected.word,
        words: [selected.word],
        x,
        y: -30,
        speed: getMonsterSpeed(skillLevel, elapsedTime, performanceMultiplier) * 0.8,
        layers: 1,
        currentLayer: 1,
        type: "basic",
        isPowerUp: true,
        powerUpType: selected.type,
        powerUpRarity: selected.rarity,
      };

      onSpawn(monster);
    },
    [gameWidth, skillLevel, performanceMultiplier, monsterCount, onSpawn]
  );

  const spawnBoss = useCallback(
    (bossNumber: number) => {
      const config = getAdaptiveDifficultyConfig(skillLevel, 0, performanceMultiplier);
      const wordCount = BOSS_CONFIG.baseWordCount + (bossNumber - 1) * BOSS_CONFIG.wordCountIncrement;

      const words: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        const word = getRandomWordInRange(config.minWordLength, config.maxWordLength);
        words.push(word);
      }

      const x = gameWidth / 2;
      const speed = BOSS_CONFIG.baseSpeed * (1 + (bossNumber - 1) * BOSS_CONFIG.speedIncrement);
      const bossName = BOSS_NAMES[Math.floor(Math.random() * BOSS_NAMES.length)];

      const boss: Monster = {
        id: `boss-${bossNumber}`,
        word: words[wordCount - 1],
        words,
        x,
        y: -50,
        speed,
        layers: wordCount,
        currentLayer: wordCount,
        type: "boss",
        isPowerUp: false,
        bossName,
      };

      onSpawn(boss);
    },
    [gameWidth, skillLevel, performanceMultiplier, onSpawn]
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

  const trySpawnPowerUp = useCallback(
    (currentTime: number, elapsedTime: number) => {
      const config = getAdaptiveDifficultyConfig(skillLevel, elapsedTime, performanceMultiplier);
      const powerUpInterval = config.spawnInterval;

      if (currentTime - lastPowerUpSpawnRef.current >= powerUpInterval) {
        if (Math.random() < config.powerUpChance) {
          spawnPowerUp(elapsedTime);
        }
        lastPowerUpSpawnRef.current = currentTime;
      }
    },
    [skillLevel, performanceMultiplier, spawnPowerUp]
  );

  const reset = useCallback(() => {
    lastSpawnRef.current = 0;
    lastPowerUpSpawnRef.current = 0;
    monsterId = 0;
  }, []);

  return { trySpawn, trySpawnPowerUp, spawnMonster, spawnBoss, reset };
}

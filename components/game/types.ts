export type PowerUpType =
  | "freeze"
  | "slow"
  | "nuke"
  | "shield"
  | "doublePoints"
  | "heal"
  | "timeStop"
  | "lifeSurge"
  | "scoreBoost"
  | "comboSaver";

export type PowerUpRarity = "common" | "rare" | "epic" | "legendary";

export interface PowerUpConfig {
  type: PowerUpType;
  word: string;
  rarity: PowerUpRarity;
  duration: number;
  spawnWeight: number;
}

export type MonsterType = "basic" | "armored" | "boss";

export type SkillLevel = "beginner" | "intermediate" | "expert";

export interface SkillTierConfig {
  baseMinWordLength: number;
  baseMaxWordLength: number;
  baseSpawnInterval: number;
  baseMonsterSpeed: number;
  maxWordLength: number;
  minSpawnInterval: number;
  maxMonsterSpeed: number;
  maxLayers: number;
  basePowerUpChance: number;
  targetWpm: number;
}

export interface PerformanceMetrics {
  correctCharactersTyped: number;
  gameStartTime: number;
  rollingWpm: number;
  monstersEscaped: number;
  recentCombos: number[];
  performanceScore: number;
}

export interface AdaptiveDifficultyState {
  currentMultiplier: number;
  targetMultiplier: number;
  lastUpdateTime: number;
}

export interface BossState {
  isActive: boolean;
  bossNumber: number;
  lastBossSpawnTime: number;
  warningActive: boolean;
  warningStartTime: number;
  defeatAnimation: boolean;
  shieldsAwarded: number;
}

export interface Monster {
  id: string;
  word: string;
  words: string[];
  x: number;
  y: number;
  speed: number;
  layers: number;
  currentLayer: number;
  type: MonsterType;
  isPowerUp: boolean;
  powerUpType?: PowerUpType;
  powerUpRarity?: PowerUpRarity;
  isGibberish?: boolean;
  bossName?: string;
}

export interface ActivePowerUp {
  type: PowerUpType;
  expiresAt: number;
}

export interface GameState {
  status: "idle" | "playing" | "gameOver";
  score: number;
  highScore: number;
  lives: number;
  combo: number;
  maxCombo: number;
  monstersKilled: number;
  monstersEscaped: number;
  activePowerUps: ActivePowerUp[];
  shieldCount: number;
  elapsedTime: number;
  skillLevel: SkillLevel;
  performanceMetrics: PerformanceMetrics;
}

export interface DifficultyConfig {
  minWordLength: number;
  maxWordLength: number;
  spawnInterval: number;
  monsterSpeed: number;
  maxLayers: number;
  powerUpChance: number;
}

export interface ScoreResult {
  basePoints: number;
  layerBonus: number;
  comboMultiplier: number;
  doublePointsMultiplier: number;
  total: number;
}

export interface GameConfig {
  width: number;
  height: number;
  initialLives: number;
  baseSpawnInterval: number;
  baseMonsterSpeed: number;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  width: 800,
  height: 600,
  initialLives: 5,
  baseSpawnInterval: 2500,
  baseMonsterSpeed: 80,
};

export const POWER_UP_DURATIONS: Record<PowerUpType, number> = {
  freeze: 3000,
  slow: 6000,
  nuke: 0,
  shield: 0,
  doublePoints: 10000,
  heal: 0,
  timeStop: 8000,
  lifeSurge: 0,
  scoreBoost: 0,
  comboSaver: 0,
};

export const POWER_UP_WORDS: Record<PowerUpType, string> = {
  freeze: "freeze",
  slow: "slowmo",
  nuke: "nuke",
  shield: "shield",
  doublePoints: "double",
  heal: "heal",
  timeStop: "timestop",
  lifeSurge: "maxlife",
  scoreBoost: "bonus",
  comboSaver: "combo",
};

export const POWER_UP_CONFIGS: PowerUpConfig[] = [
  { type: "slow", word: "slowmo", rarity: "common", duration: 6000, spawnWeight: 50 },
  { type: "freeze", word: "freeze", rarity: "rare", duration: 3000, spawnWeight: 20 },
  { type: "shield", word: "shield", rarity: "rare", duration: 0, spawnWeight: 15 },
  { type: "scoreBoost", word: "bonus", rarity: "rare", duration: 0, spawnWeight: 10 },
  { type: "doublePoints", word: "double", rarity: "epic", duration: 10000, spawnWeight: 8 },
  { type: "heal", word: "heal", rarity: "epic", duration: 0, spawnWeight: 7 },
  { type: "comboSaver", word: "combo", rarity: "epic", duration: 0, spawnWeight: 5 },
  { type: "nuke", word: "nuke", rarity: "legendary", duration: 0, spawnWeight: 3 },
  { type: "timeStop", word: "timestop", rarity: "legendary", duration: 8000, spawnWeight: 2 },
  { type: "lifeSurge", word: "maxlife", rarity: "legendary", duration: 0, spawnWeight: 1 },
];

export const RARITY_COLORS: Record<PowerUpRarity, { border: string; glow: string; text: string }> = {
  common: { border: "border-gray-400", glow: "shadow-gray-400/30", text: "text-gray-400" },
  rare: { border: "border-blue-500", glow: "shadow-blue-500/40", text: "text-blue-500" },
  epic: { border: "border-purple-500", glow: "shadow-purple-500/50", text: "text-purple-500" },
  legendary: { border: "border-amber-500", glow: "shadow-amber-500/60", text: "text-amber-500" },
};

export const SKILL_TIER_CONFIGS: Record<SkillLevel, SkillTierConfig> = {
  beginner: {
    baseMinWordLength: 2,
    baseMaxWordLength: 4,
    baseSpawnInterval: 3500,
    baseMonsterSpeed: 50,
    maxWordLength: 6,
    minSpawnInterval: 2500,
    maxMonsterSpeed: 90,
    maxLayers: 1,
    basePowerUpChance: 0.2,
    targetWpm: 25,
  },
  intermediate: {
    baseMinWordLength: 3,
    baseMaxWordLength: 6,
    baseSpawnInterval: 2500,
    baseMonsterSpeed: 80,
    maxWordLength: 9,
    minSpawnInterval: 1800,
    maxMonsterSpeed: 130,
    maxLayers: 2,
    basePowerUpChance: 0.12,
    targetWpm: 45,
  },
  expert: {
    baseMinWordLength: 5,
    baseMaxWordLength: 8,
    baseSpawnInterval: 2000,
    baseMonsterSpeed: 110,
    maxWordLength: 14,
    minSpawnInterval: 1200,
    maxMonsterSpeed: 180,
    maxLayers: 3,
    basePowerUpChance: 0.08,
    targetWpm: 70,
  },
};

export const DEFAULT_PERFORMANCE_METRICS: PerformanceMetrics = {
  correctCharactersTyped: 0,
  gameStartTime: 0,
  rollingWpm: 0,
  monstersEscaped: 0,
  recentCombos: [],
  performanceScore: 1.0,
};

export const DEFAULT_ADAPTIVE_STATE: AdaptiveDifficultyState = {
  currentMultiplier: 1.0,
  targetMultiplier: 1.0,
  lastUpdateTime: 0,
};

export const DEFAULT_BOSS_STATE: BossState = {
  isActive: false,
  bossNumber: 0,
  lastBossSpawnTime: 0,
  warningActive: false,
  warningStartTime: 0,
  defeatAnimation: false,
  shieldsAwarded: 0,
};

export const BOSS_CONFIG = {
  spawnInterval: 120000,
  warningDuration: 3000,
  baseWordCount: 15,
  wordCountIncrement: 5,
  baseSpeed: 12,
  speedIncrement: 0.05,
  shieldsPerBoss: 3,
  scoreBonus: 1000,
  defeatAnimationDuration: 2000,
};

export const BOSS_NAMES = [
  "Leet Code",
  "Memory Leak",
  "Friday Deploy",
  "Merge Conflict",
  "PHP",
  "Java",
];

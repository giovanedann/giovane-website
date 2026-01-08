"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Monster as MonsterType,
  GameState,
  ActivePowerUp,
  SkillLevel,
  DEFAULT_GAME_CONFIG,
  DEFAULT_PERFORMANCE_METRICS,
  DEFAULT_ADAPTIVE_STATE,
  AdaptiveDifficultyState,
} from "./types";
import { useGameLoop } from "./hooks/useGameLoop";
import { useTypingInput } from "./hooks/useTypingInput";
import { useMonsterSpawner } from "./hooks/useMonsterSpawner";
import { usePowerUps } from "./hooks/usePowerUps";
import { calculateScore, getHighScore, setHighScore } from "./utils/scoring";
import {
  updatePerformanceMetrics,
  updateDifficultyMultiplier,
  addComboToHistory,
} from "./utils/performanceTracker";
import { HUD } from "./HUD";
import { InputDisplay } from "./InputDisplay";
import { Monster } from "./Monster";
import { StartScreen } from "./StartScreen";
import { GameOverScreen } from "./GameOverScreen";
import { PowerUpEffects } from "./PowerUpEffects";

const GAME_HEIGHT = 650;
const PERFORMANCE_UPDATE_INTERVAL = 5000;

export function Game() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(DEFAULT_GAME_CONFIG.width);
  const gameStartTimeRef = useRef<number>(0);
  const lastPerformanceUpdateRef = useRef<number>(0);
  const processedEscapesRef = useRef<Set<string>>(new Set());

  const [adaptiveState, setAdaptiveState] = useState<AdaptiveDifficultyState>(
    DEFAULT_ADAPTIVE_STATE
  );

  const [gameState, setGameState] = useState<GameState>({
    status: "idle",
    score: 0,
    highScore: getHighScore(),
    lives: DEFAULT_GAME_CONFIG.initialLives,
    combo: 0,
    maxCombo: 0,
    monstersKilled: 0,
    monstersEscaped: 0,
    activePowerUps: [],
    shieldCount: 0,
    elapsedTime: 0,
    skillLevel: "intermediate",
    performanceMetrics: DEFAULT_PERFORMANCE_METRICS,
  });

  const [monsters, setMonsters] = useState<MonsterType[]>([]);
  const monstersRef = useRef<MonsterType[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [nukeTriggered, setNukeTriggered] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleSpawn = useCallback((monster: MonsterType) => {
    monstersRef.current = [...monstersRef.current, monster];
    setMonsters(monstersRef.current);
  }, []);

  const { trySpawn, trySpawnPowerUp, reset: resetSpawner } = useMonsterSpawner({
    gameWidth: containerWidth,
    skillLevel: gameState.skillLevel,
    performanceMultiplier: adaptiveState.currentMultiplier,
    currentScore: gameState.score,
    monsterCount: monsters.length,
    layeredMonsterCount: monsters.filter((m) => m.layers > 1).length,
    onSpawn: handleSpawn,
  });

  const { activatePowerUp, getSpeedMultiplier, isActive: isPowerUpActive } = usePowerUps({
    activePowerUps: gameState.activePowerUps,
    onActivate: (powerUp: ActivePowerUp) => {
      setGameState((prev) => ({
        ...prev,
        activePowerUps: [...prev.activePowerUps, powerUp],
      }));
    },
    onNuke: () => {
      setNukeTriggered(true);

      let killedCount = 0;
      const surviving = monstersRef.current
        .map((monster) => {
          if (monster.currentLayer <= 1) {
            killedCount++;
            return null;
          }
          return { ...monster, currentLayer: monster.currentLayer - 1 };
        })
        .filter((m): m is MonsterType => m !== null);

      monstersRef.current = surviving;
      setMonsters(surviving);

      if (killedCount > 0) {
        setGameState((state) => ({
          ...state,
          monstersKilled: state.monstersKilled + killedCount,
          score: state.score + killedCount * 50,
        }));
      }
    },
    onShield: () => {
      setGameState((prev) => ({ ...prev, shieldCount: prev.shieldCount + 1 }));
    },
    onHeal: () => {
      setGameState((prev) => ({
        ...prev,
        lives: Math.min(prev.lives + 1, DEFAULT_GAME_CONFIG.initialLives),
      }));
    },
    onLifeSurge: () => {
      setGameState((prev) => ({
        ...prev,
        lives: DEFAULT_GAME_CONFIG.initialLives,
      }));
    },
    onScoreBoost: () => {
      setGameState((prev) => ({
        ...prev,
        score: prev.score + 100,
      }));
    },
    onComboSaver: () => {
      const powerUp: ActivePowerUp = {
        type: "comboSaver",
        expiresAt: Date.now() + 30000,
      };
      setGameState((prev) => ({
        ...prev,
        activePowerUps: [...prev.activePowerUps, powerUp],
      }));
    },
  });

  const handleCorrectCharacter = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      performanceMetrics: {
        ...prev.performanceMetrics,
        correctCharactersTyped: prev.performanceMetrics.correctCharactersTyped + 1,
      },
    }));
  }, []);

  const handleWordComplete = useCallback(
    (monsterId: string) => {
      const monster = monstersRef.current.find((m) => m.id === monsterId);
      if (!monster) return;

      if (monster.isPowerUp && monster.powerUpType) {
        activatePowerUp(monster.powerUpType);
        monstersRef.current = monstersRef.current.filter((m) => m.id !== monsterId);
        setMonsters(monstersRef.current);
        return;
      }

      if (monster.currentLayer > 1) {
        const newLayer = monster.currentLayer - 1;
        monstersRef.current = monstersRef.current.map((m) =>
          m.id === monsterId
            ? { ...m, currentLayer: newLayer, word: m.words[newLayer - 1] }
            : m
        );
        setMonsters(monstersRef.current);
        return;
      }

      const scoreResult = calculateScore(
        monster.word.length,
        monster.layers,
        gameState.combo,
        gameState.activePowerUps
      );

      setGameState((prev) => ({
        ...prev,
        score: prev.score + scoreResult.total,
        combo: prev.combo + 1,
        maxCombo: Math.max(prev.maxCombo, prev.combo + 1),
        monstersKilled: prev.monstersKilled + 1,
      }));

      monstersRef.current = monstersRef.current.filter((m) => m.id !== monsterId);
      setMonsters(monstersRef.current);
    },
    [activatePowerUp, gameState.combo, gameState.activePowerUps]
  );

  const {
    currentInput,
    targetMonsterId,
    matchingMonster,
    handleCharacterInput,
    handleBackspace,
    reset: resetInput,
  } = useTypingInput({
    monsters,
    onWordComplete: handleWordComplete,
    onCorrectCharacter: handleCorrectCharacter,
    isActive: gameState.status === "playing",
  });

  const handleGameUpdate = useCallback(
    (deltaTime: number) => {
      const now = performance.now();
      const elapsedTime = now - gameStartTimeRef.current;

      setGameState((prev) => {
        const shouldUpdatePerformance =
          now - lastPerformanceUpdateRef.current >= PERFORMANCE_UPDATE_INTERVAL;

        let updatedMetrics = prev.performanceMetrics;
        if (shouldUpdatePerformance) {
          updatedMetrics = updatePerformanceMetrics(
            prev.performanceMetrics,
            prev.monstersKilled,
            prev.combo,
            prev.skillLevel,
            now
          );
          lastPerformanceUpdateRef.current = now;

          setAdaptiveState((adaptState) => ({
            ...adaptState,
            targetMultiplier: updatedMetrics.performanceScore,
            lastUpdateTime: now,
          }));
        }

        return {
          ...prev,
          elapsedTime,
          performanceMetrics: updatedMetrics,
          activePowerUps: prev.activePowerUps.filter((p) => p.expiresAt > Date.now()),
        };
      });

      setAdaptiveState((prev) => ({
        ...prev,
        currentMultiplier: updateDifficultyMultiplier(
          prev.currentMultiplier,
          prev.targetMultiplier,
          deltaTime
        ),
      }));

      const isFrozen = isPowerUpActive("freeze") || isPowerUpActive("timeStop");
      if (!isFrozen) {
        trySpawn(now, elapsedTime);
        trySpawnPowerUp(now, elapsedTime);
      }

      const speedMultiplier = getSpeedMultiplier();

      const escaped: MonsterType[] = [];
      const remaining: MonsterType[] = [];

      monstersRef.current.forEach((monster) => {
        const newY = monster.y + (monster.speed * deltaTime * speedMultiplier) / 1000;

        if (newY > GAME_HEIGHT) {
          if (!processedEscapesRef.current.has(monster.id)) {
            escaped.push(monster);
            processedEscapesRef.current.add(monster.id);
          }
        } else {
          remaining.push({ ...monster, y: newY });
        }
      });

      monstersRef.current = remaining;
      setMonsters(remaining);
      if (escaped.length > 0) {
        setGameState((state) => {
          let newLives = state.lives;
          let newShieldCount = state.shieldCount;
          let shieldsUsed = 0;

          for (let i = 0; i < escaped.length; i++) {
            if (escaped[i].isPowerUp) continue;

            if (newShieldCount > 0) {
              newShieldCount--;
              shieldsUsed++;
              continue;
            }
            newLives--;
          }

          const actualLivesLost = state.lives - newLives;

          if (actualLivesLost > 0) {
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 300);
          }

          const newStatus = newLives <= 0 ? "gameOver" : state.status;

          if (newStatus === "gameOver") {
            setHighScore(state.score);
          }

          const now = Date.now();
          const hasComboSaver = state.activePowerUps.some(
            (p) => p.type === "comboSaver" && p.expiresAt > now
          );

          const newCombo = hasComboSaver ? state.combo : 0;
          const newActivePowerUps = hasComboSaver
            ? state.activePowerUps.filter((p) => p.type !== "comboSaver")
            : state.activePowerUps;

          const updatedCombos = !hasComboSaver && state.combo > 0
            ? addComboToHistory(state.performanceMetrics.recentCombos, state.combo)
            : state.performanceMetrics.recentCombos;

          return {
            ...state,
            lives: Math.max(0, newLives),
            combo: newCombo,
            status: newStatus,
            shieldCount: newShieldCount,
            activePowerUps: newActivePowerUps,
            highScore: newStatus === "gameOver" ? Math.max(state.highScore, state.score) : state.highScore,
            monstersEscaped: state.monstersEscaped + escaped.length,
            performanceMetrics: {
              ...state.performanceMetrics,
              monstersEscaped: state.performanceMetrics.monstersEscaped + escaped.length,
              recentCombos: updatedCombos,
            },
          };
        });
      }
    },
    [trySpawn, trySpawnPowerUp, getSpeedMultiplier, isPowerUpActive]
  );

  const { reset: resetGameLoop } = useGameLoop({
    onUpdate: handleGameUpdate,
    isRunning: gameState.status === "playing",
  });

  const startGame = useCallback(
    (skillLevel: SkillLevel) => {
      const now = performance.now();
      monstersRef.current = [];
      setMonsters([]);
      resetSpawner();
      resetGameLoop();
      resetInput();
      gameStartTimeRef.current = now;
      lastPerformanceUpdateRef.current = now;
      processedEscapesRef.current.clear();

      setAdaptiveState(DEFAULT_ADAPTIVE_STATE);

      setGameState({
        status: "playing",
        score: 0,
        highScore: getHighScore(),
        lives: DEFAULT_GAME_CONFIG.initialLives,
        combo: 0,
        maxCombo: 0,
        monstersKilled: 0,
        monstersEscaped: 0,
        activePowerUps: [],
        shieldCount: 0,
        elapsedTime: 0,
        skillLevel,
        performanceMetrics: {
          ...DEFAULT_PERFORMANCE_METRICS,
          gameStartTime: now,
        },
      });
    },
    [resetSpawner, resetGameLoop, resetInput]
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        animate={screenShake ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="relative border border-border rounded-xl overflow-hidden bg-gradient-to-b from-background to-card"
      >
        <HUD
          lives={gameState.lives}
          maxLives={DEFAULT_GAME_CONFIG.initialLives}
          score={gameState.score}
          highScore={gameState.highScore}
          combo={gameState.combo}
          activePowerUps={gameState.activePowerUps}
          shieldCount={gameState.shieldCount}
          elapsedTime={gameState.elapsedTime}
        />

        <div
          ref={containerRef}
          className="relative overflow-hidden"
          style={{ height: GAME_HEIGHT }}
        >
          <PowerUpEffects
            activePowerUps={gameState.activePowerUps}
            nukeTriggered={nukeTriggered}
            onNukeComplete={() => setNukeTriggered(false)}
          />

          <AnimatePresence>
            {monsters.map((monster) => (
              <Monster
                key={monster.id}
                monster={monster}
                isTarget={monster.id === targetMonsterId}
                currentInput={monster.id === targetMonsterId ? currentInput : ""}
                containerHeight={GAME_HEIGHT}
              />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {gameState.status === "idle" && (
              <StartScreen
                highScore={gameState.highScore}
                onStart={startGame}
              />
            )}

            {gameState.status === "gameOver" && (
              <GameOverScreen
                score={gameState.score}
                highScore={gameState.highScore}
                isNewHighScore={gameState.score >= gameState.highScore && gameState.score > 0}
                monstersKilled={gameState.monstersKilled}
                maxCombo={gameState.maxCombo}
                elapsedTime={gameState.elapsedTime}
                onRestart={() => startGame(gameState.skillLevel)}
              />
            )}
          </AnimatePresence>
        </div>

        <InputDisplay
          currentInput={currentInput}
          targetWord={matchingMonster?.word ?? null}
          isActive={gameState.status === "playing"}
          onInput={handleCharacterInput}
          onBackspace={handleBackspace}
        />
      </motion.div>
    </div>
  );
}

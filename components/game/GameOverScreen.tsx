"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Zap, RotateCcw, Timer } from "lucide-react";
import { ScoreSubmission } from "./ScoreSubmission";
import type { SkillLevel } from "./types";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  monstersKilled: number;
  maxCombo: number;
  elapsedTime: number;
  skillLevel: SkillLevel;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function GameOverScreen({
  score,
  highScore,
  isNewHighScore,
  monstersKilled,
  maxCombo,
  elapsedTime,
  skillLevel,
  onRestart,
  onViewLeaderboard,
}: GameOverScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <div className="max-w-md w-full mx-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Game Over
          </h1>

          {isNewHighScore && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-amber-500/20 text-amber-500 font-bold"
            >
              <Trophy className="h-5 w-5" />
              New High Score!
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-6xl font-bold text-primary mb-2 tabular-nums">
            {score.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Best: {highScore.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="p-4 rounded-lg bg-card border border-border">
            <Target className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {monstersKilled}
            </div>
            <div className="text-xs text-muted-foreground">
              Killed
            </div>
          </div>

          <div className="p-4 rounded-lg bg-card border border-border">
            <Zap className="h-5 w-5 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {maxCombo}x
            </div>
            <div className="text-xs text-muted-foreground">
              Max Combo
            </div>
          </div>

          <div className="p-4 rounded-lg bg-card border border-border">
            <Timer className="h-5 w-5 text-cyan-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground font-mono">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-xs text-muted-foreground">
              Time
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 p-4 rounded-lg bg-card border border-border"
        >
          <ScoreSubmission
            gameId="typing-roguelike"
            score={score}
            skillLevel={skillLevel}
            monstersKilled={monstersKilled}
            maxCombo={maxCombo}
            elapsedTimeMs={elapsedTime}
            onViewLeaderboard={onViewLeaderboard}
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            onClick={onRestart}
            className="w-full text-lg gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Play Again
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

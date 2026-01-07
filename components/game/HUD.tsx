"use client";

import { motion, AnimatePresence } from "motion/react";
import { Heart, Zap, Shield, Clock, Snowflake, Plus, Timer, Sparkles } from "lucide-react";
import { ActivePowerUp, PowerUpType } from "./types";
import { cn } from "@/lib/utils";

interface HUDProps {
  lives: number;
  maxLives: number;
  score: number;
  highScore: number;
  combo: number;
  activePowerUps: ActivePowerUp[];
  shieldCount?: number;
  elapsedTime?: number;
}

const POWER_UP_ICONS: Record<PowerUpType, React.ReactNode> = {
  freeze: <Snowflake className="h-4 w-4" />,
  slow: <Clock className="h-4 w-4" />,
  nuke: <Zap className="h-4 w-4" />,
  shield: <Shield className="h-4 w-4" />,
  doublePoints: <span className="text-xs font-bold">2x</span>,
  heal: <Plus className="h-4 w-4" />,
  timeStop: <Timer className="h-4 w-4" />,
  lifeSurge: <Sparkles className="h-4 w-4" />,
  scoreBoost: <span className="text-xs font-bold">+</span>,
  comboSaver: <span className="text-xs font-bold">C</span>,
};

const POWER_UP_COLORS: Record<PowerUpType, string> = {
  freeze: "bg-cyan-500",
  slow: "bg-amber-500",
  nuke: "bg-red-500",
  shield: "bg-blue-500",
  doublePoints: "bg-green-500",
  heal: "bg-pink-500",
  timeStop: "bg-purple-500",
  lifeSurge: "bg-amber-400",
  scoreBoost: "bg-emerald-500",
  comboSaver: "bg-orange-500",
};

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function HUD({
  lives,
  maxLives,
  score,
  highScore,
  combo,
  activePowerUps,
  shieldCount = 0,
  elapsedTime = 0,
}: HUDProps) {
  const now = Date.now();
  const activeOnes = activePowerUps.filter((p) => p.expiresAt > now);
  const hasShield = shieldCount > 0;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "relative flex items-center gap-1 px-2 py-1 rounded-lg transition-all",
            hasShield && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-background"
          )}
        >
          {hasShield && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-lg bg-cyan-400/20 pointer-events-none"
            />
          )}
          {Array.from({ length: maxLives }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              animate={{
                scale: i < lives ? 1 : 0.8,
                opacity: i < lives ? 1 : 0.3,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  i < lives
                    ? "fill-red-500 text-red-500"
                    : "fill-transparent text-muted-foreground"
                )}
              />
            </motion.div>
          ))}
          <AnimatePresence>
            {hasShield && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="ml-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400"
              >
                <Shield className="h-4 w-4 text-cyan-400" />
                {shieldCount > 1 && (
                  <span className="text-xs font-bold text-cyan-400">x{shieldCount}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {activeOnes.map((powerUp) => (
            <motion.div
              key={`${powerUp.type}-${powerUp.expiresAt}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-white",
                POWER_UP_COLORS[powerUp.type]
              )}
            >
              {POWER_UP_ICONS[powerUp.type]}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Timer className="h-4 w-4" />
          <span className="font-mono text-sm tabular-nums">{formatTime(elapsedTime)}</span>
        </div>

        <AnimatePresence>
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-1 text-primary font-bold"
            >
              <Zap className="h-4 w-4" />
              <span>{combo}x Combo</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-right">
          <motion.div
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-xl font-bold text-foreground tabular-nums"
          >
            {score.toLocaleString()}
          </motion.div>
          <div className="text-xs text-muted-foreground">
            Best: {highScore.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

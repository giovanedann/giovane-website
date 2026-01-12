"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Monster as MonsterType, RARITY_COLORS, PowerUpRarity } from "./types";
import { Skull } from "lucide-react";

interface MonsterProps {
  monster: MonsterType;
  isTarget: boolean;
  currentInput: string;
  containerHeight: number;
}

function getRarityIcon(rarity: PowerUpRarity) {
  switch (rarity) {
    case "legendary":
      return "👑";
    case "epic":
      return "💎";
    case "rare":
      return "✦";
    default:
      return "•";
  }
}

export function Monster({
  monster,
  isTarget,
  currentInput,
  containerHeight,
}: MonsterProps) {
  const progress = monster.y / containerHeight;
  const urgency = progress > 0.7 ? "urgent" : progress > 0.5 ? "warning" : "normal";
  const rarity = monster.powerUpRarity;
  const rarityColors = rarity ? RARITY_COLORS[rarity] : null;
  const isGibberish = monster.isGibberish;
  const isBoss = monster.type === "boss";
  const bossNumber = isBoss ? parseInt(monster.id.replace("boss-", "")) : 0;
  const maxWordLength = isBoss
    ? Math.max(...monster.words.map((w) => w.length))
    : 0;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.5, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute -translate-x-1/2"
      style={{ left: monster.x, top: monster.y }}
    >
      <motion.div
        animate={
          isBoss
            ? {
                scale: [1, 1.03, 1],
                boxShadow: [
                  "0 0 20px rgba(239,68,68,0.4)",
                  "0 0 40px rgba(239,68,68,0.7)",
                  "0 0 20px rgba(239,68,68,0.4)",
                ],
              }
            : isTarget
            ? { scale: [1, 1.05, 1] }
            : urgency === "urgent"
            ? { y: [0, -2, 0] }
            : {}
        }
        transition={{
          duration: isBoss ? 1.2 : isTarget ? 0.5 : 0.3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "relative px-4 py-2 rounded-lg border-2 transition-colors",
          isBoss
            ? "bg-gradient-to-b from-red-900/60 to-red-950/80 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]"
            : isGibberish
            ? "bg-gradient-to-b from-emerald-900/40 to-green-950/60 border-emerald-500 shadow-md shadow-emerald-500/30"
            : monster.isPowerUp && rarityColors
            ? cn(
                "bg-gradient-to-b from-background/90 to-card/90",
                rarityColors.border,
                rarity === "legendary" && "shadow-lg",
                rarity === "epic" && "shadow-md",
                rarityColors.glow
              )
            : monster.isPowerUp
            ? "bg-gradient-to-b from-amber-500/20 to-amber-600/20 border-amber-500"
            : isTarget
            ? "bg-card/90 border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
            : urgency === "urgent"
            ? "bg-red-500/20 border-red-500"
            : urgency === "warning"
            ? "bg-amber-500/20 border-amber-500/50"
            : "bg-card/80 border-border"
        )}
      >

        {isBoss && monster.bossName && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
              {monster.bossName}
            </span>
          </motion.div>
        )}

        {isBoss && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-lg bg-red-500/10 pointer-events-none"
          />
        )}

        {monster.isPowerUp && rarity && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute -top-2 -left-2 text-xs",
              rarityColors?.text
            )}
          >
            {getRarityIcon(rarity)}
          </motion.div>
        )}

        {monster.isPowerUp && rarity === "legendary" && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-lg bg-amber-500/10 pointer-events-none"
          />
        )}

        {isGibberish && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-lg bg-emerald-500/10 pointer-events-none"
          />
        )}

        <span
          className="font-mono text-sm tracking-wider whitespace-nowrap inline-block text-center"
          style={isBoss ? { minWidth: `${maxWordLength}ch` } : undefined}
        >
          {monster.word.split("").map((char, i) => {
            const isTyped = isTarget && i < currentInput.length;
            const isCorrect =
              isTyped && char.toLowerCase() === currentInput[i]?.toLowerCase();

            return (
              <span
                key={i}
                className={cn(
                  "transition-colors",
                  isTyped
                    ? isCorrect
                      ? "text-primary font-bold"
                      : "text-destructive"
                    : isBoss
                    ? "text-red-300"
                    : isGibberish
                    ? "text-emerald-400"
                    : monster.isPowerUp && rarityColors
                    ? rarityColors.text
                    : monster.isPowerUp
                    ? "text-amber-400"
                    : isTarget
                    ? "text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {char}
              </span>
            );
          })}
        </span>

        {!monster.isPowerUp && (
          <div className="mt-1.5 flex items-center justify-center gap-0.5">
            {isBoss ? (
              <motion.div
                key="boss-hp"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1"
              >
                <Skull className="h-4 w-4 text-red-400" />
                <span className="text-sm font-bold text-red-400">
                  ×{monster.currentLayer}
                </span>
              </motion.div>
            ) : (
              Array.from({ length: monster.layers }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: i < monster.currentLayer ? 1 : 0.7,
                    opacity: i < monster.currentLayer ? 1 : 0.3,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Skull
                    className={cn(
                      "h-3 w-3",
                      i < monster.currentLayer
                        ? isGibberish
                          ? "text-emerald-400"
                          : "text-red-400"
                        : "text-muted-foreground"
                    )}
                  />
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

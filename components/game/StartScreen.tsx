"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Keyboard, Heart, Zap, Trophy } from "lucide-react";
import { SkillLevel } from "./types";
import { cn } from "@/lib/utils";

interface StartScreenProps {
  highScore: number;
  onStart: (skillLevel: SkillLevel) => void;
  onViewLeaderboard: () => void;
}

const SKILL_OPTIONS: {
  level: SkillLevel;
  label: string;
  description: string;
  wordLength: string;
}[] = [
  {
    level: "beginner",
    label: "Beginner",
    description: "Short words, slower pace",
    wordLength: "2-4 chars",
  },
  {
    level: "intermediate",
    label: "Intermediate",
    description: "Balanced challenge",
    wordLength: "3-6 chars",
  },
  {
    level: "expert",
    label: "Expert",
    description: "Long words, fast pace",
    wordLength: "5-8 chars",
  },
];

export function StartScreen({ highScore, onStart, onViewLeaderboard }: StartScreenProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillLevel>("intermediate");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm overflow-y-auto py-8"
    >
      <div className="max-w-lg w-full mx-4 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Type to Survive
          </h1>
          <p className="text-muted-foreground mb-6">
            A typing roguelike game
          </p>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <p className="text-sm font-medium text-foreground mb-3">
            Choose Your Difficulty
          </p>
          <div className="grid grid-cols-3 gap-2">
            {SKILL_OPTIONS.map((option, index) => (
              <motion.button
                key={option.level}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => setSelectedSkill(option.level)}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all text-left",
                  selectedSkill === option.level
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div className="font-semibold text-sm text-foreground">
                  {option.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </div>
                <div className="text-xs text-primary mt-1 font-mono">
                  {option.wordLength}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-6"
        >
          <div className="flex items-center gap-3 text-left p-3 rounded-lg bg-card border border-border">
            <Keyboard className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              Type the words to destroy monsters before they reach the bottom
            </p>
          </div>

          <div className="flex items-center gap-3 text-left p-3 rounded-lg bg-card border border-border">
            <Heart className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-muted-foreground">
              You have 5 lives. Lose one each time a monster escapes
            </p>
          </div>

          <div className="flex items-center gap-3 text-left p-3 rounded-lg bg-card border border-border">
            <Zap className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-sm text-muted-foreground">
              Collect power-ups for special abilities like freeze and nuke
            </p>
          </div>
        </motion.div>

        {highScore > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-center gap-2 mb-4 text-muted-foreground"
          >
            <Trophy className="h-4 w-4" />
            <span>High Score: {highScore.toLocaleString()}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button
            size="lg"
            onClick={() => onStart(selectedSkill)}
            className="w-full text-lg"
          >
            Start Game
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onViewLeaderboard}
            className="w-full text-lg gap-2"
          >
            <Trophy className="h-5 w-5" />
            Leaderboard
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-xs text-muted-foreground"
        >
          Difficulty adapts to your typing speed
        </motion.p>
      </div>
    </motion.div>
  );
}

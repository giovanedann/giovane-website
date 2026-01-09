"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Medal, Award, Clock, Target, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDeviceFingerprint } from "@/lib/fingerprint";
import type { LeaderboardResponse, LeaderboardEntry, SkillLevel } from "@/types/dynamodb";

interface LeaderboardProps {
  gameId: string;
  onClose: () => void;
  currentSkillLevel?: SkillLevel;
}

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Trophy className="size-5 text-amber-500" />;
  }
  if (rank === 2) {
    return <Medal className="size-5 text-slate-400" />;
  }
  if (rank === 3) {
    return <Award className="size-5 text-amber-700" />;
  }
  return <span className="text-sm text-muted-foreground w-5 text-center">{rank}</span>;
}

export function Leaderboard({ gameId, onClose, currentSkillLevel = "intermediate" }: LeaderboardProps) {
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(currentSkillLevel);
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getDeviceFingerprint().then(setCurrentUserId);
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/games/${gameId}/scores?skillLevel=${skillLevel}&limit=50`
      );

      if (response.ok) {
        const data: LeaderboardResponse = await response.json();
        setScores(data.scores);
      } else {
        setError("Failed to load leaderboard");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  }, [gameId, skillLevel]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-amber-500" />
            <h2 className="text-xl font-bold text-foreground">Leaderboard</h2>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex gap-1 p-2 bg-secondary/50">
          {SKILL_LEVELS.map((level) => (
            <Button
              key={level.value}
              variant={skillLevel === level.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setSkillLevel(level.value)}
              className="flex-1"
            >
              {level.label}
            </Button>
          ))}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchLeaderboard}>
                Retry
              </Button>
            </div>
          ) : scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Trophy className="size-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No scores yet</p>
              <p className="text-sm text-muted-foreground/70">Be the first to play!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {scores.map((entry, index) => {
                  const isCurrentUser = currentUserId === entry.userId;
                  return (
                    <motion.div
                      key={`${entry.rank}-${entry.createdAt}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      className={`flex items-center gap-3 p-3 hover:bg-secondary/30 ${
                        isCurrentUser ? "bg-primary/10" : ""
                      }`}
                    >
                      <div className="w-8 flex justify-center">
                        <RankIcon rank={entry.rank} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground truncate">
                            {entry.playerName}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            #{entry.discriminator}
                          </span>
                          {isCurrentUser && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-medium">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Target className="size-3" />
                            {entry.monstersKilled}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="size-3" />
                            {entry.maxCombo}x
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatTime(entry.elapsedTimeMs)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-foreground tabular-nums">
                          {entry.score.toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-secondary/30">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

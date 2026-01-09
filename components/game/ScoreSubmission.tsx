"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Trophy, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDeviceFingerprint } from "@/lib/fingerprint";
import type { SkillLevel, SubmitScoreResponse } from "@/types/dynamodb";

interface ScoreSubmissionProps {
  gameId: string;
  score: number;
  skillLevel: SkillLevel;
  monstersKilled: number;
  maxCombo: number;
  elapsedTimeMs: number;
  onSubmitted?: (rank?: number) => void;
  onViewLeaderboard?: () => void;
}

const PLAYER_NAME_KEY = "typing-game-player-name";

export function ScoreSubmission({
  gameId,
  score,
  skillLevel,
  monstersKilled,
  maxCombo,
  elapsedTimeMs,
  onSubmitted,
  onViewLeaderboard,
}: ScoreSubmissionProps) {
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rank, setRank] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem(PLAYER_NAME_KEY);
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = playerName.trim();
    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 20) {
      setError("Name must be 3-20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9 ]+$/.test(trimmedName)) {
      setError("Only letters, numbers, and spaces allowed");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const fingerprint = await getDeviceFingerprint();

      const response = await fetch(`/api/games/${gameId}/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-fingerprint": fingerprint,
        },
        body: JSON.stringify({
          playerName: trimmedName,
          score,
          skillLevel,
          monstersKilled,
          maxCombo,
          elapsedTimeMs,
        }),
      });

      if (response.ok) {
        const data: SubmitScoreResponse = await response.json();
        localStorage.setItem(PLAYER_NAME_KEY, trimmedName);
        setIsSubmitted(true);
        setRank(data.rank);
        onSubmitted?.(data.rank);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit score");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-500">
          <Check className="size-4" />
          Score submitted!
        </div>
        {rank && rank <= 50 && (
          <div className="flex items-center justify-center gap-2 text-amber-500">
            <Trophy className="size-4" />
            You ranked #{rank}!
          </div>
        )}
        {onViewLeaderboard && (
          <Button variant="outline" size="sm" onClick={onViewLeaderboard}>
            View Leaderboard
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <p className="text-sm text-muted-foreground text-center">
        Submit your score to the leaderboard
      </p>

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Your name"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            setError(null);
          }}
          maxLength={20}
          disabled={isSubmitting}
          className="flex-1"
        />
        <Button type="submit" disabled={isSubmitting || !playerName.trim()}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Send className="size-4" />
              Submit
            </>
          )}
        </Button>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive text-center"
        >
          {error}
        </motion.p>
      )}

      {onViewLeaderboard && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onViewLeaderboard}
          className="w-full"
        >
          <Trophy className="size-4" />
          View Leaderboard
        </Button>
      )}
    </motion.form>
  );
}

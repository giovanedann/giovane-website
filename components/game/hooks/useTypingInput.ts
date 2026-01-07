"use client";

import { useState, useCallback, useEffect } from "react";
import { Monster } from "../types";

interface UseTypingInputOptions {
  monsters: Monster[];
  onWordComplete: (monsterId: string) => void;
  onCorrectCharacter?: () => void;
  isActive: boolean;
}

export function useTypingInput({
  monsters,
  onWordComplete,
  onCorrectCharacter,
  isActive,
}: UseTypingInputOptions) {
  const [currentInput, setCurrentInput] = useState("");
  const [targetMonsterId, setTargetMonsterId] = useState<string | null>(null);

  const findMatchingMonster = useCallback(
    (input: string): Monster | null => {
      if (!input) return null;

      const matching = monsters.filter((m) =>
        m.word.toLowerCase().startsWith(input.toLowerCase())
      );

      if (matching.length === 0) return null;

      if (targetMonsterId) {
        const current = matching.find((m) => m.id === targetMonsterId);
        if (current) return current;
      }

      return matching.reduce((closest, monster) =>
        monster.y > closest.y ? monster : closest
      );
    },
    [monsters, targetMonsterId]
  );

  const matchingMonster = findMatchingMonster(currentInput);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCurrentInput("");
        setTargetMonsterId(null);
        return;
      }

      if (e.key === "Backspace") {
        setCurrentInput((prev) => prev.slice(0, -1));
        if (currentInput.length <= 1) {
          setTargetMonsterId(null);
        }
        return;
      }

      if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        const newInput = currentInput + e.key.toLowerCase();
        const monster = findMatchingMonster(newInput);

        if (monster) {
          setCurrentInput(newInput);
          setTargetMonsterId(monster.id);
          onCorrectCharacter?.();

          if (newInput.toLowerCase() === monster.word.toLowerCase()) {
            onWordComplete(monster.id);
            setCurrentInput("");
            setTargetMonsterId(null);
          }
        } else if (!currentInput) {
          const potentialMatch = monsters.find((m) =>
            m.word.toLowerCase().startsWith(e.key.toLowerCase())
          );
          if (potentialMatch) {
            setCurrentInput(e.key.toLowerCase());
            setTargetMonsterId(potentialMatch.id);
            onCorrectCharacter?.();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, currentInput, findMatchingMonster, monsters, onWordComplete]);

  const reset = useCallback(() => {
    setCurrentInput("");
    setTargetMonsterId(null);
  }, []);

  return {
    currentInput,
    targetMonsterId,
    matchingMonster,
    reset,
  };
}

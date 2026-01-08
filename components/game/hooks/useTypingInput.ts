"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  const currentInputRef = useRef(currentInput);
  const targetMonsterIdRef = useRef(targetMonsterId);

  useEffect(() => {
    currentInputRef.current = currentInput;
  }, [currentInput]);

  useEffect(() => {
    targetMonsterIdRef.current = targetMonsterId;
  }, [targetMonsterId]);

  const findMatchingMonster = useCallback(
    (input: string): Monster | null => {
      if (!input) return null;

      const matching = monsters.filter((m) =>
        m.word.toLowerCase().startsWith(input.toLowerCase())
      );

      if (matching.length === 0) return null;

      const currentTargetId = targetMonsterIdRef.current;
      if (currentTargetId) {
        const current = matching.find((m) => m.id === currentTargetId);
        if (current) return current;
      }

      return matching.reduce((closest, monster) =>
        monster.y > closest.y ? monster : closest
      );
    },
    [monsters]
  );

  const matchingMonster = findMatchingMonster(currentInput);

  const handleCharacterInput = useCallback(
    (char: string) => {
      const newInput = currentInputRef.current + char;
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
      } else if (!currentInputRef.current) {
        const potentialMatch = monsters.find((m) =>
          m.word.toLowerCase().startsWith(char.toLowerCase())
        );
        if (potentialMatch) {
          setCurrentInput(char);
          setTargetMonsterId(potentialMatch.id);
          onCorrectCharacter?.();
        }
      }
    },
    [findMatchingMonster, monsters, onWordComplete, onCorrectCharacter]
  );

  const handleBackspace = useCallback(() => {
    setCurrentInput((prev) => prev.slice(0, -1));
    if (currentInputRef.current.length <= 1) {
      setTargetMonsterId(null);
    }
  }, []);

  const handleEscape = useCallback(() => {
    setCurrentInput("");
    setTargetMonsterId(null);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleEscape();
        return;
      }

      if (e.key === "Backspace") {
        handleBackspace();
        return;
      }

      if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        handleCharacterInput(e.key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, handleCharacterInput, handleBackspace, handleEscape]);

  const reset = useCallback(() => {
    setCurrentInput("");
    setTargetMonsterId(null);
  }, []);

  return {
    currentInput,
    targetMonsterId,
    matchingMonster,
    handleCharacterInput,
    handleBackspace,
    reset,
  };
}

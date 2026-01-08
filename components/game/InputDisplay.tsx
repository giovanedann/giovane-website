"use client";

import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface InputDisplayProps {
  currentInput: string;
  targetWord: string | null;
  isActive: boolean;
  onInput: (char: string) => void;
  onBackspace: () => void;
}

export function InputDisplay({
  currentInput,
  targetWord,
  isActive,
  onInput,
  onBackspace,
}: InputDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    if (value.length > 0) {
      const lastChar = value.slice(-1);
      if (/^[a-zA-Z]$/.test(lastChar)) {
        onInput(lastChar.toLowerCase());
      }
    }
    target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      onBackspace();
    }
  };

  const handleContainerClick = () => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className="px-4 py-3 bg-background/80 backdrop-blur-sm border-t border-border cursor-text"
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        className="sr-only"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        aria-label="Type to attack monsters"
      />
      <div className="flex items-center justify-center gap-2">
        <div className="font-mono text-xl tracking-wider min-h-[2rem] flex items-center">
          {targetWord ? (
            <span>
              {targetWord.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0.5 }}
                  animate={{
                    opacity: i < currentInput.length ? 1 : 0.4,
                    color:
                      i < currentInput.length
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))",
                  }}
                  className={cn(
                    "inline-block transition-colors",
                    i < currentInput.length && "font-bold"
                  )}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ) : currentInput ? (
            <span className="text-muted-foreground">{currentInput}</span>
          ) : (
            <span className="text-muted-foreground/50">Type to attack...</span>
          )}
        </div>

        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-0.5 h-6 bg-primary"
        />
      </div>
    </div>
  );
}

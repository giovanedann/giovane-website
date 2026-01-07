"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface InputDisplayProps {
  currentInput: string;
  targetWord: string | null;
}

export function InputDisplay({ currentInput, targetWord }: InputDisplayProps) {
  return (
    <div className="px-4 py-3 bg-background/80 backdrop-blur-sm border-t border-border">
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

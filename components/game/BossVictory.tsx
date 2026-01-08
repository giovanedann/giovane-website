"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Shield } from "lucide-react";
import { BOSS_CONFIG } from "./types";

interface BossVictoryProps {
  isActive: boolean;
  shieldsAwarded: number;
  bossNumber: number;
  onComplete: () => void;
}

export function BossVictory({
  isActive,
  shieldsAwarded,
  bossNumber,
  onComplete,
}: BossVictoryProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onCompleteRef.current();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-amber-500/20"
          />

          <motion.div
            initial={{ scale: 0, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="relative flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 20px rgba(34,197,94,0.5)",
                  "0 0 40px rgba(34,197,94,0.8)",
                  "0 0 20px rgba(34,197,94,0.5)",
                ],
              }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="text-4xl md:text-5xl font-black text-green-400 uppercase tracking-wider drop-shadow-[0_0_30px_rgba(34,197,94,0.7)]"
            >
              Boss Defeated!
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 bg-card/90 px-6 py-3 rounded-full border border-cyan-500/50 shadow-lg shadow-cyan-500/20"
            >
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">
                +{shieldsAwarded}
              </span>
              <span className="text-sm text-muted-foreground">shields</span>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-amber-400 font-semibold"
            >
              +{BOSS_CONFIG.scoreBonus} bonus points
            </motion.div>
          </motion.div>

          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 150,
                y: Math.sin((i / 8) * Math.PI * 2) * 150,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 0.8,
                delay: 0.1 + i * 0.05,
                ease: "easeOut",
              }}
              className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

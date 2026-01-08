"use client";

import { AnimatePresence, motion } from "motion/react";

interface BossWarningProps {
  isActive: boolean;
}

export function BossWarning({ isActive }: BossWarningProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 20px rgba(239,68,68,0.5)",
                  "0 0 40px rgba(239,68,68,0.8)",
                  "0 0 20px rgba(239,68,68,0.5)",
                ],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-5xl md:text-6xl font-black text-red-500 uppercase tracking-wider drop-shadow-[0_0_30px_rgba(239,68,68,0.7)]"
            >
              Boss Incoming!
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"
            />
          </motion.div>

          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 bg-red-500/5 pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

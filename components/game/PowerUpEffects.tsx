"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ActivePowerUp } from "./types";

interface PowerUpEffectsProps {
  activePowerUps: ActivePowerUp[];
  nukeTriggered: boolean;
  onNukeComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  delay: number;
}

function generateNukeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50,
    y: 50,
    angle: (360 / count) * i + Math.random() * 20,
    speed: 80 + Math.random() * 40,
    size: 4 + Math.random() * 4,
    delay: Math.random() * 0.1,
  }));
}

function generateSnowParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 80,
    angle: 0,
    speed: 30 + Math.random() * 20,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 1.5,
  }));
}

function NukeEffect({ onComplete }: { onComplete: () => void }) {
  const particles = useMemo(() => generateNukeParticles(12), []);

  useEffect(() => {
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-orange-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 0.3, times: [0, 0.3, 1] }}
      />

      {particles.map((particle) => {
        const radians = (particle.angle * Math.PI) / 180;
        const endX = 50 + Math.cos(radians) * particle.speed;
        const endY = 50 + Math.sin(radians) * particle.speed;

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-orange-400"
            style={{
              width: particle.size,
              height: particle.size,
              left: "50%",
              top: "50%",
            }}
            initial={{
              x: "-50%",
              y: "-50%",
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: `calc(${endX - 50}vw - 50%)`,
              y: `calc(${endY - 50}vh - 50%)`,
              opacity: 0,
              scale: 0.5,
            }}
            transition={{
              duration: 0.5,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </motion.div>
  );
}

function TimeStopEffect() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-purple-600/15"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(147, 51, 234, 0.15) 100%)",
        }}
      />
    </motion.div>
  );
}

function FreezeEffect() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(generateSnowParticles(25));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-sky-400/10"
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-sky-100/70"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, 150],
            x: [0, Math.sin(particle.id) * 15, 0],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: 2.5 + particle.delay,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  );
}

export function PowerUpEffects({
  activePowerUps,
  nukeTriggered,
  onNukeComplete,
}: PowerUpEffectsProps) {
  const isTimeStopActive = activePowerUps.some(
    (p) => p.type === "timeStop" && p.expiresAt > Date.now()
  );

  const isFreezeActive = activePowerUps.some(
    (p) => p.type === "freeze" && p.expiresAt > Date.now()
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <AnimatePresence>
        {nukeTriggered && <NukeEffect key="nuke" onComplete={onNukeComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {isTimeStopActive && <TimeStopEffect key="timestop" />}
      </AnimatePresence>

      <AnimatePresence>
        {isFreezeActive && <FreezeEffect key="freeze" />}
      </AnimatePresence>
    </div>
  );
}

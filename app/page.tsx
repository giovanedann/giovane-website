"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const FloatingCubesScene = dynamic(
  () =>
    import("@/components/cubes/FloatingCubesScene").then((mod) => ({
      default: mod.FloatingCubesScene,
    })),
  { ssr: false }
);

const JOURNEYS = [
  { label: "I am an engineer", href: "/blog" },
  { label: "I am a recruiter", href: "/about" },
  { label: "I am a wanderer", href: "/game" },
] as const;

export default function Home() {
  const [cubeAction, setCubeAction] = useState<string | null>(null);
  const [sceneVisible, setSceneVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setCubeAction("explode");
        setTimeout(() => setCubeAction(null), 100);
      } else if (e.code === "KeyR") {
        setSceneVisible(false);
        setTimeout(() => {
          setCubeAction("reset");
          setTimeout(() => setCubeAction(null), 100);
          setSceneVisible(true);
        }, 400);
      } else if (e.code === "KeyG") {
        setCubeAction("gravity");
        setTimeout(() => setCubeAction(null), 100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <motion.div
        animate={{ opacity: sceneVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
      >
        <FloatingCubesScene keyboardAction={cubeAction} />
      </motion.div>
      <div className="relative z-20 flex flex-col items-center gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-foreground md:text-7xl"
        >
          Giovane Saes
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl font-medium text-muted-foreground md:text-2xl"
        >
          Product & AI Engineer
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg text-foreground/80"
        >
          Who are <span className="font-bold">you</span>?
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-4"
        >
          {JOURNEYS.map(({ label, href }) => (
            <Link key={href} href={href}>
              <ShimmerButton>{label}</ShimmerButton>
            </Link>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="absolute bottom-6 right-6 z-20 flex flex-col gap-1.5 text-[11px] text-white/25"
      >
        <span><kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-white/40">Space</kbd> Explode</span>
        <span><kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-white/40">G</kbd> Gravity</span>
        <span><kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-white/40">R</kbd> Reset</span>
        <span><kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-white/40">Right click</kbd> Cube menu</span>
      </motion.div>
    </div>
  );
}

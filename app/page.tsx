"use client";

import Link from "next/link";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const FloatingCubesScene = dynamic(
  () =>
    import("@/components/cubes/FloatingCubesScene").then((mod) => ({
      default: mod.FloatingCubesScene,
    })),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />
      <FloatingCubesScene />
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
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/blog">
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50"
            >
              I am an engineer
            </Button>
          </Link>
          <Link href="/about">
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50"
            >
              I am a recruiter
            </Button>
          </Link>
          <Link href="/game">
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50"
            >
              I am a wanderer
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

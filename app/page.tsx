"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BackgroundBoxes } from "@/components/aceternity/background-boxes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900">
      {/* Gradient mask overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />

      <BackgroundBoxes />

      <div className="relative z-20 flex flex-col items-center gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "text-5xl font-bold text-white md:text-7xl",
            "bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          )}
        >
          Giovane Saes
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-neutral-300 md:text-xl"
        >
          Software & AI Engineer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/blog">
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[200px] border-slate-600 bg-slate-800/50 text-white backdrop-blur-sm hover:border-slate-500 hover:bg-slate-700/50 hover:text-white"
            >
              I am an engineer
            </Button>
          </Link>

          <Link href="/about">
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[200px] border-slate-600 bg-slate-800/50 text-white backdrop-blur-sm hover:border-slate-500 hover:bg-slate-700/50 hover:text-white"
            >
              I am a recruiter
            </Button>
          </Link>

          <Link href="/game">
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[200px] border-slate-600 bg-slate-800/50 text-white backdrop-blur-sm hover:border-slate-500 hover:bg-slate-700/50 hover:text-white"
            >
              I am a wanderer
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

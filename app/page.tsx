"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BackgroundBoxes } from "@/components/aceternity/background-boxes";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-background [mask-image:radial-gradient(transparent,white)]" />

      <BackgroundBoxes />

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
          Software & AI Engineer
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

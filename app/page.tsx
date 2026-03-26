"use client";

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
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
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
          {JOURNEYS.map(({ label, href }) => (
            <Link key={href} href={href}>
              <ShimmerButton>{label}</ShimmerButton>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

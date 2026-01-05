"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { TextHoverEffect } from "@/components/aceternity/text-hover-effect";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="relative z-20 flex flex-col items-center gap-4">
        <div className="h-40 w-full md:h-64 lg:h-96">
          <TextHoverEffect text="404" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-muted-foreground md:text-xl"
        >
          Oops, sounds like that page doesn&apos;t exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="w-full min-w-[180px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50 sm:w-auto"
          >
            Go back
          </Button>

          <Link href="/game">
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[180px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50 sm:w-auto"
            >
              Play a game
            </Button>
          </Link>

          <Link href="/blog">
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[180px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50 sm:w-auto"
            >
              Read blog posts
            </Button>
          </Link>

          <Link href="/about">
            <Button
              variant="outline"
              size="lg"
              className="w-full min-w-[180px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50 sm:w-auto"
            >
              Know about me
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

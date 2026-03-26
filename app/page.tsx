"use client";

import { useRef, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { BackgroundBoxes } from "@/components/aceternity/background-boxes";
import { Button } from "@/components/ui/button";
import { useWebGLSupport } from "@/components/robot/useWebGLSupport";
import { useMobileDetect } from "@/components/robot/useMobileDetect";
import type { RobotHandRef } from "@/components/robot/RobotHand";
import * as THREE from "three";

const RobotScene = dynamic(
  () =>
    import("@/components/robot/RobotScene").then((mod) => ({
      default: mod.RobotScene,
    })),
  { ssr: false }
);

const FallbackPage = () => (
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
          <Button variant="outline" size="lg" className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50">
            I am an engineer
          </Button>
        </Link>
        <Link href="/about">
          <Button variant="outline" size="lg" className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50">
            I am a recruiter
          </Button>
        </Link>
        <Link href="/game">
          <Button variant="outline" size="lg" className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50">
            I am a wanderer
          </Button>
        </Link>
      </motion.div>
    </div>
  </div>
);

const BUTTON_CONFIG = [
  { label: "I am an engineer", href: "/blog" },
  { label: "I am a recruiter", href: "/about" },
  { label: "I am a wanderer", href: "/game" },
] as const;

export default function Home() {
  const webglSupported = useWebGLSupport();
  const isMobile = useMobileDetect();
  const router = useRouter();

  const leftHandRef = useRef<RobotHandRef | null>(null);
  const hoveredButtonPosition = useRef<THREE.Vector3 | null>(null);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const screenToWorld = useCallback(
    (element: HTMLElement): THREE.Vector3 => {
      const rect = element.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
      const y = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
      return new THREE.Vector3(x * 3.5, y * 2.5, 1);
    },
    []
  );

  const handleButtonHover = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isMobile) return;
      hoveredButtonPosition.current = screenToWorld(e.currentTarget);
    },
    [screenToWorld, isMobile]
  );

  const handleButtonLeave = useCallback(() => {
    hoveredButtonPosition.current = null;
  }, []);

  const handleButtonClick = useCallback(
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isMobile) return;
      e.preventDefault();
      setPressedButton(href);
      leftHandRef.current?.triggerPress();
      setTimeout(() => {
        router.push(href);
      }, 300);
    },
    [isMobile, router]
  );

  if (webglSupported === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background" />
    );
  }

  if (!webglSupported) {
    return <FallbackPage />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <RobotScene
        leftHandRef={leftHandRef}
        hoveredButtonPosition={hoveredButtonPosition}
        isMobile={isMobile}
      />

      <div
        className={
          isMobile
            ? "relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6"
            : "relative z-10 flex h-full flex-col justify-center gap-8 pl-[10%] md:pl-[15%] lg:pl-[20%]"
        }
        style={isMobile ? undefined : { maxWidth: "50%" }}
      >
        {isMobile && <div className="h-32" />}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={
            isMobile
              ? "text-center text-4xl font-bold text-foreground"
              : "text-5xl font-bold text-foreground md:text-7xl"
          }
        >
          Giovane Saes
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={
            isMobile
              ? "text-center text-lg font-medium text-muted-foreground"
              : "text-xl font-medium text-muted-foreground md:text-2xl"
          }
        >
          Product & AI Engineer
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={
            isMobile
              ? "text-center text-base text-foreground/80"
              : "mt-4 text-lg text-foreground/80"
          }
        >
          Who are <span className="font-bold">you</span>?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={isMobile ? "flex w-full flex-col gap-3" : "flex flex-col gap-4"}
        >
          {BUTTON_CONFIG.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
              onClick={handleButtonClick(href)}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full min-w-[200px] border-border bg-secondary/50 text-foreground backdrop-blur-sm hover:bg-accent/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                animate={
                  pressedButton === href
                    ? { scale: [1, 0.97, 1], transition: { duration: 0.2 } }
                    : undefined
                }
              >
                {label}
              </Button>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

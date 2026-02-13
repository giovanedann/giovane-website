"use client";

import { motion, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";
import { SocialLinks } from "@/components/social-links";

export function AboutSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-16">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.h1
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold text-foreground md:text-5xl"
        >
          About Me
        </motion.h1>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 flex items-center justify-center gap-2 text-muted-foreground"
        >
          <MapPin className="h-4 w-4" />
          <span>São Paulo, Brazil</span>
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-lg leading-relaxed text-muted-foreground"
        >
          Product-minded engineer who builds products, not just features. Solo-built and
          monetized a financial control app from zero; led full-stack infrastructure migrations
          and shipped AI-assisted workflows that halved PR cycle time. Cares as much about
          what to build and why as how to build it.
        </motion.p>

        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-lg leading-relaxed text-muted-foreground"
        >
          I thrive on complex challenges. What brought me to programming was automating
          Excel spreadsheets, first with formulas, then with VBA. My Mechanical Engineering
          background, especially the physics and math, didn't lead me here, but it made me
          better at it. Calculating air resistance or modeling systems taught me to break
          down problems logically, a skill I apply to every technical challenge today.
        </motion.p>

        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 text-lg leading-relaxed text-muted-foreground"
        >
          Strong product intuition with hands-on cloud, distributed systems, and modern
          web expertise. I also love writing and sharing what I learn—because building great
          products is only half the fun if you can't communicate why they matter.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <SocialLinks size="lg" />
        </motion.div>
      </motion.div>
    </section>
  );
}

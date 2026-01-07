"use client";

import { motion, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";

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
          I'm a Software Engineer passionate about building scalable systems and
          developer experiences. With a background spanning IoT platforms, integrations,
          and full-stack development, I thrive on tackling complex technical challenges
          and delivering impactful solutions.
        </motion.p>

        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-lg leading-relaxed text-muted-foreground"
        >
          My Mechanical Engineering background gives me a unique perspective on
          problem-solving, combining analytical thinking with software craftsmanship.
          I'm particularly excited about AI-assisted development and teaching teams
          how to leverage AI tools effectively.
        </motion.p>
      </motion.div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { GraduationCap } from "lucide-react";

export function EducationSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-16">
      <motion.h2
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl font-bold text-foreground md:text-4xl"
      >
        Education
      </motion.h2>

      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        className="mx-auto mt-12 max-w-xl rounded-xl border border-border bg-card/50 p-8 backdrop-blur-sm"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              B.Sc. Mechanical Engineering
            </h3>
            <p className="mt-1 text-muted-foreground">Paulista University (UNIP)</p>
            <p className="mt-1 text-sm text-muted-foreground/70">São Paulo, Brazil</p>
            <p className="mt-1 text-sm text-muted-foreground/70">Jan 2016 – Dec 2021</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

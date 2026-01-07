"use client";

import { motion, useReducedMotion } from "motion/react";

interface TimelineItem {
  title: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
  tech?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-px bg-border" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={`${item.company}-${item.period}`}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.5,
              delay: prefersReducedMotion ? 0 : index * 0.1,
            }}
            className="relative pl-12"
          >
            <div className="absolute left-4 top-1 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background" />

            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm"
            >
              <div className="mb-2">
                <span className="text-sm font-medium text-primary">{item.period}</span>
              </div>

              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-muted-foreground">{item.company}</p>
              <p className="mt-1 text-sm text-muted-foreground/70">{item.location}</p>

              {item.highlights.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {item.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground list-inside list-disc"
                    >
                      {highlight}
                    </li>
                  ))}
                  {item.period.includes("Present") && (
                    <li className="text-sm text-primary list-inside list-disc italic font-semibold">
                      ...and shipping more cool things
                    </li>
                  )}
                </ul>
              )}

              {item.tech && item.tech.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface TechnologyCategory {
  name: string;
  items: string[];
}

const technologies: TechnologyCategory[] = [
  {
    name: "Programming Languages",
    items: ["TypeScript", "JavaScript", "Python"],
  },
  {
    name: "AI & Tools",
    items: ["Claude Code", "Cursor", "LLM Orchestration", "Prompt Engineering"],
  },
  {
    name: "Front-end Development",
    items: ["React", "NextJS", "ShadcnUI", "RadixUI", "BaseUI", "Zustand", "React Query"],
  },
  {
    name: "Databases",
    items: ["MySQL", "MongoDB", "DynamoDB", "PostgreSQL", "Redis"],
  },
  {
    name: "Cloud & Infra",
    items: ["AWS (EKS, Lambda, S3, SQS, Cognito)", "Docker", "Kubernetes", "Terraform", "Serverless Framework", "Cloudflare", "Supabase"],
  },
  {
    name: "Languages",
    items: ["English (Professional Proficiency)", "Portuguese (Native)"],
  },
];

export function TechnologiesSection() {
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
        Technologies
      </motion.h2>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {technologies.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: prefersReducedMotion ? 0 : categoryIndex * 0.1,
            }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm"
          >
            <h3 className="mb-4 text-lg font-semibold text-foreground">{category.name}</h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item, itemIndex) => (
                <motion.span
                  key={item}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: prefersReducedMotion ? 0 : categoryIndex * 0.1 + itemIndex * 0.05,
                  }}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm",
                    "bg-secondary text-secondary-foreground",
                    "transition-colors hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface Project {
  name: string;
  tagline: string;
  url: string;
  highlights: string[];
  tech: {
    frontend: string[];
    backend: string[];
    database: string[];
  };
}

const projects: Project[] = [
  {
    name: "Plim",
    tagline: "Financial Control App for Brazilians",
    url: "https://plim.app.br",
    highlights: [
      "Solo-built finance app for Brazilians who track spending in spreadsheets and lack financial predictability. Designed around Brazil-specific patterns — installment purchases, multi-card management, and PIX — prioritizing simplicity over feature bloat",
      "Built an AI assistant that lets users manage finances through text, voice, and photo inputs — the model selects and executes tools (SQL queries, expense creation, spending forecasts). pgvector embedding cache skips redundant LLM calls, keeping AI costs near zero",
      "Integrated MercadoPago payments (PIX + card subscriptions) with HMAC-verified webhooks to monetize from day one",
      "Architected for $0 infrastructure cost up to ~1,000 users by composing free tiers (Cloudflare Workers, Supabase, MercadoPago) — validating product-market fit before scaling spend",
      "Data isolation and protection at the database layer (column-level encryption + RLS), not just auth-level separation",
    ],
    tech: {
      frontend: ["React 19", "TypeScript", "TanStack Router/Query", "Zustand", "Tailwind"],
      backend: ["TypeScript", "Hono", "Cloudflare Workers"],
      database: ["Supabase PostgreSQL"],
    },
  },
];

export function ProjectsSection() {
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
        Projects
      </motion.h2>

      <div className="mt-12 space-y-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.name}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: prefersReducedMotion ? 0 : index * 0.1,
            }}
            className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm md:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{project.name}</h3>
                <p className="mt-1 text-muted-foreground">{project.tagline}</p>
              </div>
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Visit
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <ul className="mt-6 space-y-2">
              {project.highlights.map((highlight, i) => (
                <motion.li
                  key={i}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: prefersReducedMotion ? 0 : 0.2 + i * 0.05,
                  }}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {highlight}
                </motion.li>
              ))}
            </ul>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Frontend</h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tech.frontend.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Backend</h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tech.backend.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Database</h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tech.database.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

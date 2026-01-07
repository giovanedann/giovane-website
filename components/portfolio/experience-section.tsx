"use client";

import { motion, useReducedMotion } from "motion/react";
import { Timeline } from "./timeline";

const experiences = [
  {
    title: "Senior Software Engineer",
    company: "BWS IoT",
    location: "Remote",
    period: "Nov 2025 - Present",
    highlights: [
      "Led the stabilization and operation of Kubernetes-based infrastructure, configuring Traefik ingress, automated TLS (ACME), CI/CD pipelines, and observability tooling",
      "Resolved a critical reliability issue causing recurring service outages. Rebuilt gRPC connection handling to be resilient under heavy traffic, cutting 100% of downtime",
      "Significantly improved FTPR and sprint delivery time by teaching the software team how to use AI Agents & AI tools like Claude Code and Cursor",
    ],
    tech: ["TypeScript", "React", "NextJS", "TailwindCSS", "ShadCN", "NodeJS", "AWS", "Docker", "Kubernetes", "EKS", "Claude Code"],
  },
  {
    title: "Software Engineer",
    company: "IntegrateIQ",
    location: "Remote",
    period: "Dec 2024 - Nov 2025",
    highlights: [
      "Reduced customer manual data entry by 90%, eliminated sync delays, and improved data accuracy by building 15+ system integrations (e.g., HubSpot ↔ other CRMs)",
      "Developed new endpoints for the Integration API with token refresh and authentication flows that increased uptime and cut authentication-related errors",
      "Improved web app page load speed by 80%, reduced technical debt by 50%, enabled new feature delivery 2× faster by redesigning architecture with modern technologies",
      "Cut development time for new apps authorization by 90% by designing and implementing a reusable RBAC system using Serverless Framework and AWS Cognito",
    ],
    tech: ["JavaScript", "VueJS", "NodeJS", "AWS", "Serverless", "Python", ".NET", "C#", "MySQL", "MongoDB"],
  },
  {
    title: "Software Engineer",
    company: "BWS IoT",
    location: "Remote",
    period: "Aug 2022 - Dec 2024",
    highlights: [
      "Led development of an internal design system reused across 3+ projects, cutting UI development time by 70% and reducing visual inconsistencies",
      "Created 50+ Storybook stories and 300+ automated unit tests, boosting release confidence",
      "Reduced manual QA time by 80% and cut pre-release bugs by 50% with automated critical test flows using Cypress and Playwright",
      "Reduced code duplication by 70%, improved onboarding time by 50%, enabled 2x faster feature delivery by redesigning front-end architecture",
      "Developed a stock and delivery control module for internal ERP, integrating with Omie ERP in real-time, implementing Kanban workflow that tripled delivery speed",
    ],
    tech: ["TypeScript", "ReactJS", "NextJS", "TailwindCSS", "ShadCN", "Storybook", "React Testing Library", "Cypress", "Playwright", "React Query", "Zod", "NestJS", "NodeJS", "MySQL", "MongoDB", "Styled Components"],
  },
];

export function ExperienceSection() {
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
        Professional Experience
      </motion.h2>

      <div className="mt-12">
        <Timeline items={experiences} />
      </div>
    </section>
  );
}

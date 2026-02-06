"use client";

import { motion, useReducedMotion } from "motion/react";
import { Timeline } from "./timeline";

const experiences = [
  {
    title: "Senior Software Engineer",
    company: "BWS IoT",
    location: "Remote",
    period: "Oct 2025 - Present",
    highlights: [
      "Orchestrated the stabilization of **Kubernetes-based infrastructure** using EKS. Configured Traefik ingress, automated TLS (ACME), and implemented **Prometheus/Grafana observability**, resolving complex RBAC and pod scheduling bottlenecks",
      "Diagnosed and re-engineered a critical gRPC connection handling flaw that caused intermittent service failures. Achieved **99.9% system availability** and eliminated recurring downtime incidents under peak traffic conditions",
      "Spearheaded the integration of **AI-assisted workflows** (Claude Code, Cursor) into the software development lifecycle. Reduced average PR cycle time by **~55%** and improved First Time Pass Rate (FTPR) by mentoring the team on effective prompt engineering and agentic coding tools",
      "Migrated a **56-page internal platform** from a Next.js monolith to a decoupled monorepo, reducing build time from **35s to 4s** (8x faster), shrinking the deploy artifact from **105MB to 562KB**, and eliminating 1.4GB of server-side build output in favor of static serving — with zero-downtime deployments, automated rollback, and a fully tested backend with **zero feature regression**",
    ],
    tech: ["TypeScript", "React", "NextJS", "TailwindCSS", "ShadCN", "NodeJS", "AWS", "Docker", "Kubernetes", "EKS", "Claude Code"],
  },
  {
    title: "Software Engineer",
    company: "IntegrateIQ",
    location: "Remote",
    period: "Dec 2024 - Oct 2025",
    highlights: [
      "Developed **15+ complex system integrations** (HubSpot, Salesforce, etc.), automating data synchronization for **100k+ records daily** and eliminating manual entry errors for enterprise clients",
      "Built middleware endpoints with robust token refresh and authentication logic, resulting in a **40% reduction** in integration-related support tickets",
      "Led the **architectural overhaul** of a legacy web app using Vue and Node.js. Improved Lighthouse performance scores by **65 points** and reduced initial page load time from **7.2s to 1.8s**",
      "Designed and deployed a reusable **RBAC system** using AWS Cognito and Serverless Framework, cutting the security configuration overhead for new applications by roughly **85%**",
    ],
    tech: ["JavaScript", "VueJS", "NodeJS", "AWS", "Serverless", "Python", "C#", "MySQL", "MongoDB"],
  },
  {
    title: "Software Engineer",
    company: "BWS IoT",
    location: "Remote",
    period: "Aug 2022 - Dec 2024",
    highlights: [
      "Built a centralized **design system** and Storybook library across **3+ core products**, increasing feature delivery speed by **~60%** through component reuse and standardized UI patterns",
      "Implemented a comprehensive **end-to-end testing strategy** with Cypress and Playwright. Achieved **85% coverage** on critical user paths, leading to a **48% decrease** in production bugs identified per release",
      "Developed a **real-time stock and delivery module** integrated with Omie ERP. Introduced a Kanban-based workflow that increased order processing throughput by **2.4x** and provided cross-departmental visibility into stage-by-stage lead times",
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

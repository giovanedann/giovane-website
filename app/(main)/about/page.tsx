import { Metadata } from "next";
import { AboutSection } from "@/components/portfolio/about-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { TechnologiesSection } from "@/components/portfolio/technologies-section";
import { EducationSection } from "@/components/portfolio/education-section";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "About | Giovane Saes",
  description:
    "Giovane Saes - Product-minded engineer with 4 years of experience building products, not just features. São Paulo, Brazil.",
  openGraph: {
    title: "About | Giovane Saes",
    description:
      "Giovane Saes - Product-minded engineer with 4 years of experience building products, not just features. São Paulo, Brazil.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Who is Giovane Saes?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Giovane Saes is a Product & AI Engineer based in São Paulo, Brazil, with 4 years of experience building products, not just features.",
              },
            },
            {
              "@type": "Question",
              name: "What technologies does Giovane work with?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Giovane works with TypeScript, React, Next.js, Node.js, Python, AWS, and AI/ML technologies to build scalable products.",
              },
            },
            {
              "@type": "Question",
              name: "What is giovanes.dev about?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "giovanes.dev is Giovane's personal website featuring a technical blog, a professional portfolio, and a typing roguelike game called Type to Survive.",
              },
            },
          ],
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <TechnologiesSection />
        <EducationSection />
      </div>
    </main>
  );
}

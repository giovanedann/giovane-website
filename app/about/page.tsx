import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AboutSection } from "@/components/portfolio/about-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { TechnologiesSection } from "@/components/portfolio/technologies-section";
import { EducationSection } from "@/components/portfolio/education-section";

export const metadata: Metadata = {
  title: "About | Giovane Daniel",
  description:
    "Learn about Giovane Daniel - Software Engineer based in São Paulo, Brazil. Professional experience, technologies, and education.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <AboutSection />
        <ExperienceSection />
        <TechnologiesSection />
        <EducationSection />
      </div>
    </main>
  );
}

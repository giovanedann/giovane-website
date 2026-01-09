import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Game } from "@/components/game";

export const metadata: Metadata = {
  title: "Type to Survive | Giovane Saes",
  description:
    "A typing roguelike game. Type words to destroy monsters before they reach the bottom. How long can you survive?",
};

export default function GamePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Game />
      </div>
    </main>
  );
}

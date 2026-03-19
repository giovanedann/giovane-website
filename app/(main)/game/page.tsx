import { Metadata } from "next";
import { Game } from "@/components/game";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Type to Survive | Giovane Saes",
  description:
    "A typing roguelike game. Type words to destroy monsters before they reach the bottom. How long can you survive?",
  openGraph: {
    title: "Type to Survive | Giovane Saes",
    description:
      "A typing roguelike game. Type words to destroy monsters before they reach the bottom. How long can you survive?",
  },
  alternates: {
    canonical: "/game",
  },
};

export default function GamePage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Type to Survive | Giovane Saes",
          description:
            "A typing roguelike game. Type words to destroy monsters before they reach the bottom.",
          url: "https://giovanes.dev/game",
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Game />
      </div>
    </main>
  );
}

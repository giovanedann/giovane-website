import { Metadata } from "next";
import { getBooksByStatus } from "@/lib/books";
import { getPostBySlug } from "@/lib/posts";
import { BookCard } from "@/components/library/book-card";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Library | Giovane Saes",
  description:
    "Books I'm reading and plan to read — on engineering, product thinking, and AI.",
  openGraph: {
    title: "Library | Giovane Saes",
    description:
      "Books I'm reading and plan to read — on engineering, product thinking, and AI.",
  },
  alternates: {
    canonical: "/library",
  },
};

function resolveRelatedPosts(slugs?: string[]) {
  if (!slugs) return undefined;
  return slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      return post ? { slug, title: post.title } : null;
    })
    .filter((p): p is { slug: string; title: string } => p !== null);
}

export default function LibraryPage() {
  const reading = getBooksByStatus("reading");
  const notStarted = getBooksByStatus("not-started");
  const completed = getBooksByStatus("completed");

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Library | Giovane Saes",
          description:
            "Books I'm reading and plan to read — on engineering, product thinking, and AI.",
          url: "https://giovanes.dev/library",
        }}
      />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">
            Library
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Books I&apos;m reading and what&apos;s on my list.
          </p>
        </div>

        {reading.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Currently Reading
            </h2>
            <div className="flex flex-col gap-4">
              {reading.map((book) => (
                <BookCard
                  key={book.title}
                  book={book}
                  relatedPostTitles={resolveRelatedPosts(book.relatedPosts)}
                />
              ))}
            </div>
          </section>
        )}

        {notStarted.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Up Next
            </h2>
            <div className="flex flex-col gap-4">
              {notStarted.map((book) => (
                <BookCard
                  key={book.title}
                  book={book}
                  relatedPostTitles={resolveRelatedPosts(book.relatedPosts)}
                />
              ))}
            </div>
          </section>
        )}

        {completed.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              Completed
            </h2>
            <div className="flex flex-col gap-4">
              {completed.map((book) => (
                <BookCard
                  key={book.title}
                  book={book}
                  relatedPostTitles={resolveRelatedPosts(book.relatedPosts)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

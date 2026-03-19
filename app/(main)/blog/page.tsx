import { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { BlogList } from "@/components/blog/blog-list";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Blog | Giovane Saes",
  description:
    "Technical posts about software engineering, AI, and building great products.",
  openGraph: {
    title: "Blog | Giovane Saes",
    description:
      "Technical posts about software engineering, AI, and building great products.",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Blog | Giovane Saes",
          description:
            "Technical posts about software engineering, AI, and building great products.",
          url: "https://giovanes.dev/blog",
        }}
      />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Thoughts on software engineering, AI, and building products.
          </p>
        </div>

        <BlogList posts={posts} />
      </div>
    </div>
  );
}

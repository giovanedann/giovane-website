import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { BlogList } from "@/components/blog/blog-list";

export const metadata: Metadata = {
  title: "Blog | Giovane Saes",
  description: "Technical posts about software engineering, AI, and building great products.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-12">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
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

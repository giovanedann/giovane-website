import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { mdxComponents } from "@/components/blog/mdx-components";
import { FormattedDate } from "@/components/ui/formatted-date";
import { FloatingSocials } from "@/components/blog/floating-socials";
import { LikeButton } from "@/components/blog/like-button";
import { CommentsSection } from "@/components/blog/comments-section";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Giovane Saes`,
    description: post.short_description,
    openGraph: {
      title: post.title,
      description: post.short_description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: ["Giovane Saes"],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          ← Back to blog
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-muted-foreground">
            <time dateTime={post.date}><FormattedDate date={post.date} /></time>
            <span>·</span>
            <span>{post.readingTime}</span>
            {post.updated && (
              <>
                <span>·</span>
                <span>Updated <FormattedDate date={post.updated} /></span>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent/50 px-3 py-1 text-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-foreground prose-a:underline prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-secondary prose-pre:border prose-pre:border-border">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [
                    rehypePrettyCode,
                    {
                      theme: "dracula",
                      keepBackground: true,
                    },
                  ],
                ],
              },
            }}
          />
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <LikeButton slug={slug} />
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <CommentsSection slug={slug} />
        </div>
      </article>
      <FloatingSocials />
    </div>
  );
}

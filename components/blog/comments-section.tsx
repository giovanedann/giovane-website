"use client";

import { useEffect, useRef } from "react";
import { MessageSquare, Mail, Linkedin } from "lucide-react";

interface CommentsSectionProps {
  slug: string;
}

export function CommentsSection({ slug }: CommentsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
    const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

    if (!repo || !repoId || !category || !categoryId) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", `/blog/${slug}`);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "0");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [slug]);

  const hasGiscusConfig =
    process.env.NEXT_PUBLIC_GISCUS_REPO &&
    process.env.NEXT_PUBLIC_GISCUS_REPO_ID;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Comments</h2>
      </div>

      {hasGiscusConfig ? (
        <div ref={containerRef} className="giscus-container" />
      ) : (
        <div className="p-6 rounded-lg bg-card border border-border text-center">
          <p className="text-muted-foreground mb-4">
            Comments are powered by GitHub Discussions.
          </p>
          <p className="text-sm text-muted-foreground">
            Configuration pending - check back soon!
          </p>
        </div>
      )}

      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
        <p className="text-sm text-muted-foreground mb-3">
          No GitHub account? Reach out directly:
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://linkedin.com/in/giovanesaes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="size-4" />
            LinkedIn
          </a>
          <a
            href="mailto:giovane@giovane.dev"
            className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
          >
            <Mail className="size-4" />
            Email
          </a>
        </div>
      </div>
    </div>
  );
}

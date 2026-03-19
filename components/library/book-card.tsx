"use client";

import { useState, useCallback, type MouseEvent } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Book } from "@/types";
import { getReadingProgress } from "@/lib/books";

interface BookCardProps {
  book: Book;
  relatedPostTitles?: { slug: string; title: string }[];
}

const statusLabels: Record<Book["status"], string> = {
  reading: "Reading",
  "not-started": "Not started",
  completed: "Completed",
};

const statusColors: Record<Book["status"], string> = {
  reading: "bg-green-500/20 text-green-400",
  "not-started": "bg-muted text-muted-foreground",
  completed: "bg-blue-500/20 text-blue-400",
};

export const BookCard = ({ book, relatedPostTitles }: BookCardProps) => {
  const hasRelatedPosts = relatedPostTitles && relatedPostTitles.length > 0;
  const [isFlipped, setIsFlipped] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const progress = getReadingProgress(book);
  const isReading = book.status === "reading";

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (isFlipped) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setSpotlightPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [isFlipped],
  );

  return (
    <>
      {isReading && (
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      )}
      <div
        className="cursor-pointer [perspective:1000px]"
        style={{ height: 240 }}
        onClick={() => setIsFlipped((f) => !f)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative h-full w-full [transform-style:preserve-3d]"
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-xl bg-secondary/30 p-6 backdrop-blur-sm [backface-visibility:hidden]"
          >
            <div className="pointer-events-none absolute inset-0 rounded-xl border border-border" />
            <div
              className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
              style={{
                background: `radial-gradient(300px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(120, 119, 198, 0.15), transparent 60%)`,
                opacity: isHovering && !isFlipped ? 1 : 0,
              }}
            />

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {book.author}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusColors[book.status]}`}
                >
                  {statusLabels[book.status]}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {book.description}
              </p>

              <div className="mt-auto">
                <div className="h-1.5 overflow-hidden rounded-full bg-accent/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="h-full rounded-full"
                    style={
                      isReading
                        ? {
                            backgroundImage:
                              "linear-gradient(90deg, rgba(168,139,250,0.4), rgba(196,181,253,0.8), rgba(168,139,250,0.4))",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 4s ease-in-out infinite",
                          }
                        : {
                            background:
                              "linear-gradient(to right, rgba(168,139,250,0.4), rgba(196,181,253,0.6))",
                          }
                    }
                  />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Page {book.currentPage} of {book.totalPages} ({progress}%)
                  </p>
                  <p
                    className="text-[11px] uppercase tracking-wider text-muted-foreground/50 transition-opacity duration-300"
                    style={{ opacity: isHovering && !isFlipped ? 1 : 0 }}
                  >
                    Click to reveal
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 overflow-y-auto rounded-xl border border-border bg-secondary/50 p-6 backdrop-blur-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex h-full flex-col">
              <p className="mb-4 text-sm font-semibold text-foreground">
                Related posts
              </p>
              {hasRelatedPosts ? (
                <div className="flex flex-col gap-2">
                  {relatedPostTitles.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="group flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-purple-500/30 hover:text-foreground"
                    >
                      {post.title}
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/60">
                  No related posts yet.
                </p>
              )}
              <p className="mt-auto self-end text-[11px] uppercase tracking-wider text-muted-foreground/50">
                Click to flip back
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

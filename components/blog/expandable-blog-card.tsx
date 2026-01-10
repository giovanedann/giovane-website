"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { FormattedDate } from "@/components/ui/formatted-date";
import type { PostCard } from "@/types";

interface ExpandableBlogCardProps {
  post: PostCard;
}

export const ExpandableBlogCard = ({ post }: ExpandableBlogCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer overflow-hidden rounded-xl border border-border bg-secondary/30 backdrop-blur-sm"
    >
      <motion.div layout className="p-6">
        <motion.div layout="position" className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <motion.h2
              layout="position"
              className="text-xl font-semibold text-foreground md:text-2xl"
            >
              {post.title}
            </motion.h2>
            <motion.div
              layout="position"
              className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
            >
              <FormattedDate date={post.date} />
              <span>·</span>
              <span>{post.readingTime}</span>
            </motion.div>
          </div>
          {post.image && (
            <motion.div
              layout="position"
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg md:h-20 md:w-20"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </motion.div>
          )}
        </motion.div>

        <motion.p
          layout="position"
          className="mt-4 text-muted-foreground"
        >
          {post.short_description}
        </motion.p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-4 text-foreground"
              >
                {post.long_description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent/50 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-6"
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Button
                    variant="outline"
                    className="border-border bg-secondary/50 text-foreground hover:bg-accent/50"
                  >
                    Read full post
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout="position"
          className="mt-4 flex items-center justify-center"
        >
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

"use client";

import { ExpandableBlogCard } from "./expandable-blog-card";
import type { PostCard } from "@/types";

interface BlogListProps {
  posts: PostCard[];
}

export const BlogList = ({ posts }: BlogListProps) => {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-secondary/30 p-12 text-center">
        <p className="text-muted-foreground">
          No posts yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <ExpandableBlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
};

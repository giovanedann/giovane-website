import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://giovanes.dev/blog/${post.slug}`,
    lastModified: post.updated ?? post.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: "https://giovanes.dev",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://giovanes.dev/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://giovanes.dev/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://giovanes.dev/game",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...blogPosts,
  ];
}

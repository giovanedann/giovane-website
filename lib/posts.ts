import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostCard, PostFrontmatter } from "@/types";

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;

  if (!frontmatter.published) {
    return null;
  }

  return {
    slug,
    content,
    readingTime: readingTime(content).text,
    ...frontmatter,
  };
}

export function getAllPosts(): PostCard[] {
  const slugs = getPostSlugs();

  const posts = slugs
    .map((slug): PostCard | null => {
      const fullPath = path.join(postsDirectory, `${slug}.mdx`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const frontmatter = data as PostFrontmatter;

      if (!frontmatter.published) {
        return null;
      }

      return {
        slug,
        title: frontmatter.title,
        short_description: frontmatter.short_description,
        long_description: frontmatter.long_description,
        date: frontmatter.date,
        tags: frontmatter.tags,
        image: frontmatter.image,
        readingTime: readingTime(content).text,
      };
    })
    .filter((post): post is PostCard => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

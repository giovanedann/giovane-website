export interface PostFrontmatter {
  title: string;
  short_description: string;
  long_description: string;
  date: string;
  updated?: string;
  tags: string[];
  published: boolean;
  image?: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingTime: string;
}

export interface PostCard {
  slug: string;
  title: string;
  short_description: string;
  long_description: string;
  date: string;
  tags: string[];
  updated?: string;
  image?: string;
  readingTime: string;
}

export type BookStatus = "reading" | "not-started" | "completed";

export interface Book {
  title: string;
  author: string;
  description: string;
  status: BookStatus;
  currentPage: number;
  totalPages: number;
  relatedPosts?: string[];
}

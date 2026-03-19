import type { Book, BookStatus } from "@/types";

export const books: Book[] = [
  {
    title: "AI Engineering",
    author: "Chip Huyen",
    description:
      "A comprehensive guide to building applications with foundation models, covering evaluation, RAG, agents, and production deployment of AI systems.",
    status: "reading",
    currentPage: 363,
    totalPages: 528,
    relatedPosts: [
      "ai-concepts-to-know-as-a-software-engineer",
      "how-ais-learn",
    ],
  },
  {
    title: "The Product-Minded Engineer",
    author: "Drew Hoskins",
    description:
      "How software engineers can develop product thinking skills to build features that truly matter to users and the business.",
    status: "not-started",
    currentPage: 0,
    totalPages: 268,
    relatedPosts: ["backend-is-not-enough"],
  },
  {
    title: "The Mom Test",
    author: "Rob Fitzpatrick",
    description:
      "A practical guide to talking to customers and learning if your business idea is good, even when everyone is lying to you.",
    status: "not-started",
    currentPage: 0,
    totalPages: 130,
  },
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    description:
      "The big ideas behind reliable, scalable, and maintainable data systems — from storage engines and replication to stream processing and distributed consensus.",
    status: "not-started",
    currentPage: 0,
    totalPages: 614,
    relatedPosts: [
      "dynamodb-single-table-design-a-practical-guide",
    ],
  },
  {
    title: "User-Centered Design",
    author: "Travis Lowdermilk",
    description:
      "A hands-on guide to understanding users and designing software that meets their real needs through research, testing, and iteration.",
    status: "completed",
    currentPage: 268,
    totalPages: 268,
    relatedPosts: ["backend-is-not-enough"],
  },
];

export function getBooksByStatus(status: BookStatus): Book[] {
  return books.filter((book) => book.status === status);
}

export function getReadingProgress(book: Book): number {
  if (book.totalPages === 0) return 0;
  return Math.round((book.currentPage / book.totalPages) * 100);
}

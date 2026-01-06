import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { CodeBlock } from "./code-block";

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 text-2xl font-bold text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>
  ),
  a: ({ href, children }) => (
    <Link
      href={href ?? "#"}
      className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
    >
      {children}
    </Link>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal text-muted-foreground">{children}</ol>
  ),
  li: ({ children }) => <li className="mb-2">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-border pl-6 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  img: ({ src, alt }) => (
    <span className="my-8 block overflow-hidden rounded-lg">
      <Image
        src={src ?? ""}
        alt={alt ?? ""}
        width={800}
        height={400}
        className="w-full"
      />
    </span>
  ),
  hr: () => <hr className="my-12 border-border" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
};

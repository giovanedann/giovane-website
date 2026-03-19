import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { CodeBlock } from "./code-block";
import { TokenDisplay } from "./token-display";
import { ServerlessExecution, ServerlessScaling } from "./serverless";
import {
  GraphDatabaseVisual,
  ConsistentHashingVisual,
  DynamoDBPartitions,
  SingleTableView,
  DocumentStoreVisual,
  KeyValueStoreVisual,
  WideColumnStoreVisual,
} from "./dynamodb";
import { UIComparison } from "./ui-comparison";
import { WordWithTooltip } from "./word-with-tooltip";
import { RAGVisual, EmbeddingsVisual, ContextWindowVisual } from "./ai-concepts";

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 text-2xl font-bold text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-foreground">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 mb-3 text-lg font-semibold text-foreground">{children}</h4>
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
    <ul className="my-4 ml-6 list-disc space-y-2.5 text-muted-foreground marker:text-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2.5 text-muted-foreground marker:font-semibold marker:text-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-border pl-6 italic text-muted-foreground [&_ul]:my-2 [&_ul]:ml-6 [&_ul]:space-y-1">
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
  TokenDisplay,
  ServerlessExecution,
  ServerlessScaling,
  GraphDatabaseVisual,
  ConsistentHashingVisual,
  DynamoDBPartitions,
  SingleTableView,
  DocumentStoreVisual,
  KeyValueStoreVisual,
  WideColumnStoreVisual,
  UIComparison,
  WordWithTooltip,
  RAGVisual,
  EmbeddingsVisual,
  ContextWindowVisual,
};

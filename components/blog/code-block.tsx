import { ReactNode } from "react";

interface CodeBlockProps {
  children: ReactNode;
}

export const CodeBlock = ({ children }: CodeBlockProps) => {
  return (
    <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-secondary p-4 font-mono text-sm">
      {children}
    </pre>
  );
};

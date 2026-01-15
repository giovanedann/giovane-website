"use client";

interface TokenDisplayProps {
  tokens: string[];
  label?: string;
}

const colors = [
  "rgba(16, 185, 129, 0.3)",  // emerald
  "rgba(14, 165, 233, 0.3)",  // sky
  "rgba(139, 92, 246, 0.3)",  // violet
  "rgba(245, 158, 11, 0.3)",  // amber
  "rgba(244, 63, 94, 0.3)",   // rose
  "rgba(20, 184, 166, 0.3)",  // teal
  "rgba(99, 102, 241, 0.3)",  // indigo
  "rgba(249, 115, 22, 0.3)",  // orange
];

export function TokenDisplay({ tokens, label }: TokenDisplayProps) {
  return (
    <div className="my-4">
      {label && (
        <span className="mr-3 font-mono text-sm text-muted-foreground">
          {label}
        </span>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        {tokens.map((token, index) => (
          <span
            key={index}
            style={{ backgroundColor: colors[index % colors.length] }}
            className="rounded px-2 py-1 font-mono text-sm"
          >
            {token.replace(/ /g, "␣")}
          </span>
        ))}
      </div>
    </div>
  );
}

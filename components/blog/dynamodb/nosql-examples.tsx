"use client";

import { motion } from "motion/react";

function JsonKey({ children }: { children: React.ReactNode }) {
  return <span className="text-sky-400">{children}</span>;
}

function JsonString({ children }: { children: React.ReactNode }) {
  return <span className="text-emerald-400">{children}</span>;
}

function JsonBracket({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

export function DocumentStoreVisual() {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          Document Store
        </span>
      </div>
      <div className="p-4">
        <motion.pre
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-x-auto font-mono text-sm leading-relaxed"
        >
          <JsonBracket>{"{"}</JsonBracket>{"\n"}
          {"  "}<JsonKey>&quot;_id&quot;</JsonKey>: <JsonString>&quot;12345&quot;</JsonString>,{"\n"}
          {"  "}<JsonKey>&quot;name&quot;</JsonKey>: <JsonString>&quot;Giovane Saes&quot;</JsonString>,{"\n"}
          {"  "}<JsonKey>&quot;email&quot;</JsonKey>: <JsonString>&quot;giovanes.dev@gmail.com&quot;</JsonString>,{"\n"}
          {"  "}<JsonKey>&quot;role&quot;</JsonKey>: <JsonString>&quot;product-engineer&quot;</JsonString>,{"\n"}
          {"  "}<JsonKey>&quot;title&quot;</JsonKey>: <JsonString>&quot;One of the best product engineers out there!&quot;</JsonString>,{"\n"}
          {"  "}<JsonKey>&quot;hobbies&quot;</JsonKey>: <JsonBracket>[</JsonBracket><JsonString>&quot;games&quot;</JsonString>, <JsonString>&quot;software&quot;</JsonString>, <JsonString>&quot;coding&quot;</JsonString>, <JsonString>&quot;writing&quot;</JsonString><JsonBracket>]</JsonBracket>{"\n"}
          <JsonBracket>{"}"}</JsonBracket>
        </motion.pre>
      </div>
    </div>
  );
}

type KVEntry = {
  key: string;
  value: string;
};

const kvEntries: KVEntry[] = [
  { key: "user:12345", value: '{ "name": "Giovane Saes", "email": "giovanes.dev@...", ... }' },
  { key: "session:abc", value: '{ "userId": "12345", "expiresAt": "2026-02-10T00:00:00Z" }' },
  { key: "config:app", value: '{ "theme": "dark", "locale": "en-US" }' },
];

export function KeyValueStoreVisual() {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          Key-Value Store
        </span>
      </div>
      <div className="divide-y divide-border/50">
        {kvEntries.map((entry, i) => (
          <motion.div
            key={entry.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="flex flex-col gap-1 px-4 py-3 transition-colors duration-200 hover:bg-muted/30 sm:flex-row sm:items-center sm:gap-3"
          >
            <span className="shrink-0 rounded bg-violet-500/15 px-2 py-0.5 font-mono text-sm text-violet-400">
              {entry.key}
            </span>
            <span className="hidden text-muted-foreground/40 sm:inline">&rarr;</span>
            <span className="min-w-0 truncate font-mono text-sm text-muted-foreground">
              {entry.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

type WideColumnRow = {
  rowKey: string;
  columns: Record<string, string | null>;
};

const wideColumnHeaders = ["name", "email", "role", "hobbies"];

const wideColumnRows: WideColumnRow[] = [
  {
    rowKey: "user:12345",
    columns: {
      name: '"Giovane Saes"',
      email: '"giovanes.dev@..."',
      role: '"product-eng"',
      hobbies: '["games", ...]',
    },
  },
  {
    rowKey: "user:67890",
    columns: {
      name: '"John Doe"',
      email: '"john@..."',
      role: null,
      hobbies: null,
    },
  },
  {
    rowKey: "event:001",
    columns: {
      name: '"Tech Meetup"',
      email: null,
      role: null,
      hobbies: null,
    },
  },
];

export function WideColumnStoreVisual() {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          Wide-Column Store
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-muted-foreground">
                Row Key
              </th>
              {wideColumnHeaders.map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-left text-xs uppercase tracking-wider text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wideColumnRows.map((row, i) => (
              <motion.tr
                key={row.rowKey}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="border-b border-border/50 transition-colors duration-200 hover:bg-muted/30"
              >
                <td className="px-3 py-2">
                  <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-xs text-amber-400">
                    {row.rowKey}
                  </span>
                </td>
                {wideColumnHeaders.map((header) => {
                  const value = row.columns[header];
                  return (
                    <td key={header} className="px-3 py-2">
                      {value ? (
                        <span className="font-mono text-xs text-emerald-400">
                          {value}
                        </span>
                      ) : (
                        <span className="inline-block h-px w-4 rounded bg-muted-foreground/20" />
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

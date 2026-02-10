"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

type EntityType = "Tenant" | "Branch" | "Account" | "Transaction" | "Report";

type PartitionItem = {
  pk: string;
  entity: EntityType;
  label: string;
};

type Partition = {
  id: number;
  label: string;
  items: PartitionItem[];
};

type Query = {
  id: string;
  label: string;
  targetPartition: number;
  matchingItems: string[];
};

const entityColors: Record<EntityType, string> = {
  Tenant: "bg-emerald-500",
  Branch: "bg-sky-500",
  Account: "bg-violet-500",
  Transaction: "bg-amber-500",
  Report: "bg-rose-500",
};

const entityBadgeColors: Record<EntityType, string> = {
  Tenant: "bg-emerald-500/15 text-emerald-400",
  Branch: "bg-sky-500/15 text-sky-400",
  Account: "bg-violet-500/15 text-violet-400",
  Transaction: "bg-amber-500/15 text-amber-400",
  Report: "bg-rose-500/15 text-rose-400",
};

const partitions: Partition[] = [
  {
    id: 0,
    label: "Partition 1",
    items: [
      { pk: "TENANT#abc123", entity: "Tenant", label: "Tenant Metadata" },
      { pk: "TENANT#abc123#BRANCH", entity: "Branch", label: "Branch: branch-001" },
      { pk: "TENANT#abc123#BRANCH", entity: "Branch", label: "Branch: branch-002" },
      { pk: "TENANT#abc123#ACCOUNT", entity: "Account", label: "Account: acc-001" },
    ],
  },
  {
    id: 1,
    label: "Partition 2",
    items: [
      { pk: "TENANT#...#TRANSACTION", entity: "Transaction", label: "Txn: 2026-01-15" },
      { pk: "TENANT#...#TRANSACTION", entity: "Transaction", label: "Txn: 2026-01-16" },
      { pk: "TENANT#...#TRANSACTION", entity: "Transaction", label: "Txn: 2026-01-17" },
    ],
  },
  {
    id: 2,
    label: "Partition 3",
    items: [
      { pk: "TENANT#...#REPORTING", entity: "Report", label: "Monthly: 2026-01" },
      { pk: "TENANT#...#REPORTING", entity: "Report", label: "Monthly: 2025-12" },
    ],
  },
];

const queries: Query[] = [
  {
    id: "metadata",
    label: "Get Tenant Metadata",
    targetPartition: 0,
    matchingItems: ["Tenant Metadata"],
  },
  {
    id: "transactions",
    label: "Get Branch Transactions",
    targetPartition: 1,
    matchingItems: ["Txn: 2026-01-15", "Txn: 2026-01-16", "Txn: 2026-01-17"],
  },
  {
    id: "reports",
    label: "Get Monthly Report",
    targetPartition: 2,
    matchingItems: ["Monthly: 2026-01"],
  },
];

function HashIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-muted-foreground/50"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
    </svg>
  );
}

export function DynamoDBPartitions() {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [animatingPartition, setAnimatingPartition] = useState<number | null>(null);
  const [highlightedItems, setHighlightedItems] = useState<Set<string>>(new Set());

  const runQuery = useCallback((query: Query) => {
    if (activeQuery) return;
    setActiveQuery(query.id);
    setAnimatingPartition(query.targetPartition);

    setTimeout(() => {
      setHighlightedItems(new Set(query.matchingItems));
    }, 500);

    setTimeout(() => {
      setActiveQuery(null);
      setAnimatingPartition(null);
      setHighlightedItems(new Set());
    }, 2500);
  }, [activeQuery]);

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          How DynamoDB Stores Your Data
        </span>
      </div>

      <div className="p-4">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          {queries.map((query) => (
            <button
              key={query.id}
              onClick={() => runQuery(query)}
              disabled={activeQuery !== null}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                activeQuery === query.id
                  ? "border-sky-500 bg-sky-500/10 text-sky-400"
                  : activeQuery !== null
                    ? "cursor-not-allowed border-border text-muted-foreground/50"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {query.label}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {activeQuery && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto mb-4 h-0.5 w-16 rounded-full bg-sky-500"
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        <div className="grid gap-3 md:grid-cols-3">
          {partitions.map((partition, pi) => {
            const isTarget = animatingPartition === partition.id;
            const isDimmed = animatingPartition !== null && !isTarget;

            return (
              <motion.div
                key={partition.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: isDimmed ? 0.4 : 1,
                  y: 0,
                }}
                transition={{ delay: pi * 0.1, duration: 0.4 }}
                className={`rounded-lg border bg-background p-3 transition-shadow duration-500 ${
                  isTarget
                    ? "border-sky-500/50 shadow-[0_0_16px_-4px] shadow-sky-500/30"
                    : "border-border"
                }`}
              >
                <div className="mb-2.5 flex items-center gap-1.5">
                  <HashIcon />
                  <span className="text-xs font-medium text-foreground">
                    {partition.label}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {partition.items.map((item, ii) => {
                    const isHighlighted = highlightedItems.has(item.label);
                    return (
                      <motion.div
                        key={item.label}
                        animate={
                          isHighlighted
                            ? { scale: [1, 1.03, 1] }
                            : {}
                        }
                        transition={
                          isHighlighted
                            ? { delay: ii * 0.08, duration: 0.3 }
                            : {}
                        }
                        className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 transition-colors duration-300 ${
                          isHighlighted
                            ? "border-sky-500/40 bg-sky-500/10"
                            : "border-border/50 bg-card"
                        }`}
                      >
                        <div
                          className={`h-full w-0.5 self-stretch rounded-full ${entityColors[item.entity]}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-mono text-muted-foreground">
                            {item.pk}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${entityBadgeColors[item.entity]}`}
                        >
                          {item.entity}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border bg-muted/30 px-4 py-2.5">
        <p className="text-center text-xs text-muted-foreground">
          Click a query to see how DynamoDB routes to the right partition
        </p>
      </div>
    </div>
  );
}

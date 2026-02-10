"use client";

import { motion } from "motion/react";

type Entity = "Tenant" | "Branch" | "Account" | "Transaction" | "Report";

type TableItem = {
  pk: string;
  sk: string;
  entity: Entity;
};

const entityColors: Record<Entity, { badge: string; border: string }> = {
  Tenant: {
    badge: "bg-emerald-500/15 text-emerald-400",
    border: "border-l-emerald-500",
  },
  Branch: {
    badge: "bg-sky-500/15 text-sky-400",
    border: "border-l-sky-500",
  },
  Account: {
    badge: "bg-violet-500/15 text-violet-400",
    border: "border-l-violet-500",
  },
  Transaction: {
    badge: "bg-amber-500/15 text-amber-400",
    border: "border-l-amber-500",
  },
  Report: {
    badge: "bg-rose-500/15 text-rose-400",
    border: "border-l-rose-500",
  },
};

const defaultItems: TableItem[] = [
  { pk: "TENANT#abc123", sk: "METADATA", entity: "Tenant" },
  { pk: "TENANT#abc123#BRANCH", sk: "branch-001", entity: "Branch" },
  { pk: "TENANT#abc123#BRANCH", sk: "branch-002", entity: "Branch" },
  { pk: "TENANT#abc123#ACCOUNT", sk: "acc-001", entity: "Account" },
  {
    pk: "TENANT#abc123#BRANCH#branch-001#TRANSACTION",
    sk: "2026-01-15#txn-001",
    entity: "Transaction",
  },
  {
    pk: "TENANT#abc123#BRANCH#branch-001#TRANSACTION",
    sk: "2026-01-16#txn-002",
    entity: "Transaction",
  },
  {
    pk: "TENANT#abc123#BRANCH#branch-001#REPORTING",
    sk: "MONTHLY#2026-01",
    entity: "Report",
  },
];

export function SingleTableView({ items }: { items?: TableItem[] }) {
  const data = items ?? defaultItems;

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          Single Table View
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted-foreground">
                PK
              </th>
              <th className="px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted-foreground">
                SK
              </th>
              <th className="px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted-foreground">
                Entity
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => {
              const colors = entityColors[item.entity];
              return (
                <motion.tr
                  key={`${item.pk}-${item.sk}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className={`border-l-3 border-b border-b-border transition-colors duration-200 hover:bg-muted/30 ${colors.border}`}
                  style={{ borderLeftWidth: "3px" }}
                >
                  <td className="max-w-[260px] truncate px-4 py-2.5 font-mono text-sm text-foreground">
                    {item.pk}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-sm text-foreground">
                    {item.sk}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}
                    >
                      {item.entity}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

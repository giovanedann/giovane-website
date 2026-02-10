"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

const RING_SLOTS = 12;
const CX = 200;
const CY = 170;
const RADIUS_DESKTOP = 130;

type PartitionNode = {
  id: string;
  label: string;
  position: number;
  color: string;
};

type DataItem = {
  id: string;
  label: string;
  position: number;
};

const partitionColors = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#f43f5e"];

const initialPartitions: PartitionNode[] = [
  { id: "p0", label: "P0", position: 0, color: partitionColors[0] },
  { id: "p1", label: "P1", position: 4, color: partitionColors[1] },
  { id: "p2", label: "P2", position: 8, color: partitionColors[2] },
];

const initialData: DataItem[] = [
  { id: "d1", label: "user:001", position: 1 },
  { id: "d2", label: "order:042", position: 5 },
  { id: "d3", label: "sess:abc", position: 10 },
];

function slotToAngle(slot: number): number {
  return (slot / RING_SLOTS) * Math.PI * 2 - Math.PI / 2;
}

function slotToXY(slot: number, radius: number = RADIUS_DESKTOP) {
  const angle = slotToAngle(slot);
  return {
    x: CX + Math.cos(angle) * radius,
    y: CY + Math.sin(angle) * radius,
  };
}

function findOwner(position: number, sortedPartitions: PartitionNode[]): PartitionNode | null {
  if (sortedPartitions.length === 0) return null;
  for (const p of sortedPartitions) {
    if (p.position >= position) return p;
  }
  return sortedPartitions[0];
}

function TickMark({ slot }: { slot: number }) {
  const outerR = RADIUS_DESKTOP + 12;
  const innerR = RADIUS_DESKTOP + 6;
  const outer = slotToXY(slot, outerR);
  const inner = slotToXY(slot, innerR);
  const labelPos = slotToXY(slot, outerR + 10);

  return (
    <g>
      <line
        x1={inner.x}
        y1={inner.y}
        x2={outer.x}
        y2={outer.y}
        stroke="currentColor"
        className="text-muted-foreground/20"
        strokeWidth={1}
      />
      <text
        x={labelPos.x}
        y={labelPos.y}
        textAnchor="middle"
        dominantBaseline="central"
        className="select-none text-[8px] text-muted-foreground/30"
        fill="currentColor"
      >
        {slot}
      </text>
    </g>
  );
}

export function ConsistentHashingVisual() {
  const [partitions, setPartitions] = useState<PartitionNode[]>(initialPartitions);
  const [dataItems, setDataItems] = useState<DataItem[]>(initialData);
  const [hoveredPartition, setHoveredPartition] = useState<string | null>(null);
  const [nextDataId, setNextDataId] = useState(4);

  const sortedPartitions = useMemo(
    () => [...partitions].sort((a, b) => a.position - b.position),
    [partitions]
  );

  const dataOwnership = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of dataItems) {
      const owner = findOwner(item.position, sortedPartitions);
      if (owner) map.set(item.id, owner.id);
    }
    return map;
  }, [dataItems, sortedPartitions]);

  const addData = useCallback(() => {
    const usedPositions = new Set([
      ...partitions.map((p) => p.position),
      ...dataItems.map((d) => d.position),
    ]);
    const available = Array.from({ length: RING_SLOTS }, (_, i) => i).filter(
      (s) => !usedPositions.has(s)
    );
    if (available.length === 0) return;

    const position = available[Math.floor(Math.random() * available.length)];
    const labels = ["item:" + String(nextDataId).padStart(3, "0"), "key:" + Math.random().toString(36).slice(2, 5), "doc:" + String(nextDataId).padStart(2, "0")];
    const label = labels[nextDataId % labels.length];

    setDataItems((prev) => [...prev, { id: `d${nextDataId}`, label, position }]);
    setNextDataId((prev) => prev + 1);
  }, [partitions, dataItems, nextDataId]);

  const addPartition = useCallback(() => {
    if (partitions.length >= 5) return;
    const usedPositions = new Set([
      ...partitions.map((p) => p.position),
      ...dataItems.map((d) => d.position),
    ]);
    const available = Array.from({ length: RING_SLOTS }, (_, i) => i).filter(
      (s) => !usedPositions.has(s)
    );
    if (available.length === 0) return;

    const position = available[Math.floor(Math.random() * available.length)];
    const id = `p${partitions.length}`;
    const label = `P${partitions.length}`;
    const color = partitionColors[partitions.length];

    setPartitions((prev) => [...prev, { id, label, position, color }]);
  }, [partitions, dataItems]);

  const removePartition = useCallback(() => {
    if (partitions.length <= 1) return;
    setPartitions((prev) => prev.slice(0, -1));
  }, [partitions]);

  const reset = useCallback(() => {
    setPartitions(initialPartitions);
    setDataItems(initialData);
    setNextDataId(4);
    setHoveredPartition(null);
  }, []);

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          Consistent Hashing
        </span>
      </div>

      <div className="p-4">
        <svg viewBox="0 0 400 340" className="mx-auto w-full max-w-md">
          {Array.from({ length: RING_SLOTS }).map((_, i) => (
            <TickMark key={i} slot={i} />
          ))}

          <circle
            cx={CX}
            cy={CY}
            r={RADIUS_DESKTOP}
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth={1.5}
          />

          <AnimatePresence>
            {dataItems.map((item) => {
              const pos = slotToXY(item.position);
              const ownerId = dataOwnership.get(item.id);
              const ownerPartition = partitions.find((p) => p.id === ownerId);
              const color = ownerPartition?.color ?? "#666";
              const isGlowing =
                hoveredPartition !== null && ownerId === hoveredPartition;
              const isDimmed =
                hoveredPartition !== null && ownerId !== hoveredPartition;

              return (
                <motion.g key={item.id}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isGlowing ? 6 : 5}
                    fill={color}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: isDimmed ? 0.2 : 1,
                      fillOpacity: isDimmed ? 0.2 : 0.8,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      transformOrigin: `${pos.x}px ${pos.y}px`,
                      filter: isGlowing ? `drop-shadow(0 0 6px ${color})` : "none",
                    }}
                  />
                  <motion.text
                    x={pos.x}
                    y={pos.y - 12}
                    textAnchor="middle"
                    fill={color}
                    className="pointer-events-none select-none text-[8px]"
                    animate={{ opacity: isDimmed ? 0.15 : 0.7 }}
                  >
                    {item.label}
                  </motion.text>
                </motion.g>
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {partitions.map((partition) => {
              const pos = slotToXY(partition.position);
              const isHovered = hoveredPartition === partition.id;

              return (
                <motion.g
                  key={partition.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                  onMouseEnter={() => setHoveredPartition(partition.id)}
                  onMouseLeave={() => setHoveredPartition(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 11 : 9}
                    fill={partition.color}
                    fillOpacity={0.25}
                    stroke={partition.color}
                    strokeWidth={2}
                    style={{
                      filter: isHovered
                        ? `drop-shadow(0 0 10px ${partition.color})`
                        : `drop-shadow(0 0 4px ${partition.color}40)`,
                      transition: "all 0.2s",
                    }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={partition.color}
                    className="pointer-events-none select-none text-[9px] font-bold"
                  >
                    {partition.label}
                  </text>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={addData}
            disabled={dataItems.length + partitions.length >= RING_SLOTS}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            Add Data
          </button>
          <button
            onClick={addPartition}
            disabled={partitions.length >= 5 || dataItems.length + partitions.length >= RING_SLOTS}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            Add Partition
          </button>
          <button
            onClick={removePartition}
            disabled={partitions.length <= 1}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            Remove Partition
          </button>
          <button
            onClick={reset}
            className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground/60 transition-all hover:border-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground/60">
          Each data item is assigned to the nearest partition going clockwise. Hover a partition to see its data.
        </p>
      </div>
    </div>
  );
}

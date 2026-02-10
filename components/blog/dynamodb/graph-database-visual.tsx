"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";

type Node = {
  id: string;
  label: string;
  type: string;
  color: string;
  x: number;
  y: number;
};

type Edge = {
  from: string;
  to: string;
  label: string;
};

const nodes: Node[] = [
  { id: "giovane", label: "Giovane", type: "person", color: "#0ea5e9", x: 160, y: 90 },
  { id: "engineer", label: "Sw. Engineer", type: "role", color: "#10b981", x: 45, y: 30 },
  { id: "games", label: "Games", type: "interest", color: "#8b5cf6", x: 275, y: 30 },
  { id: "writing", label: "Writing", type: "interest", color: "#8b5cf6", x: 275, y: 150 },
  { id: "brazil", label: "Brazil", type: "location", color: "#f59e0b", x: 45, y: 150 },
];

const edges: Edge[] = [
  { from: "giovane", to: "engineer", label: "HAS_ROLE" },
  { from: "giovane", to: "games", label: "LIKES" },
  { from: "giovane", to: "writing", label: "LIKES" },
  { from: "giovane", to: "brazil", label: "LIVES_IN" },
];

function getNodeById(id: string) {
  return nodes.find((n) => n.id === id)!;
}

function getConnectedIds(nodeId: string): Set<string> {
  const connected = new Set<string>();
  connected.add(nodeId);
  for (const edge of edges) {
    if (edge.from === nodeId) connected.add(edge.to);
    if (edge.to === nodeId) connected.add(edge.from);
  }
  return connected;
}

function EdgePath({ edge, active, dimmed }: { edge: Edge; active: boolean; dimmed: boolean }) {
  const from = getNodeById(edge.from);
  const to = getNodeById(edge.to);

  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx = mx + dy * 0.15;
  const cy = my - dx * 0.15;

  const activeNode = active ? getNodeById(edge.to) : null;
  const strokeColor = activeNode ? activeNode.color : "currentColor";

  return (
    <g>
      <motion.path
        d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
        fill="none"
        stroke={strokeColor}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: dimmed ? 0.1 : active ? 0.8 : 0.2,
          strokeWidth: active ? 2 : 1.5,
        }}
        transition={{
          pathLength: { duration: 0.8, delay: 0.3 },
          opacity: { duration: 0.3 },
          strokeWidth: { duration: 0.3 },
        }}
        className={active ? "" : "text-muted-foreground"}
      />
      <motion.text
        x={(from.x + cx) / 2 + (to.x - from.x) * 0.15}
        y={(from.y + cy) / 2 + (to.y - from.y) * 0.15}
        textAnchor="middle"
        fill={strokeColor}
        animate={{ opacity: dimmed ? 0.1 : active ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
        className="select-none text-[9px] font-medium"
      >
        {edge.label}
      </motion.text>
    </g>
  );
}

function NodeCircle({
  node,
  index,
  active,
  dimmed,
  onSelect,
}: {
  node: Node;
  index: number;
  active: boolean;
  dimmed: boolean;
  onSelect: (id: string | null) => void;
}) {
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: dimmed ? 0.15 : 1,
      }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 20, delay: index * 0.05 },
        opacity: { duration: 0.3 },
      }}
      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(active ? null : node.id);
      }}
    >
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={20}
        fill={node.color}
        animate={{
          fillOpacity: dimmed ? 0.1 : active ? 0.25 : 0.15,
          r: active ? 22 : 20,
        }}
        transition={{ duration: 0.2 }}
        style={{
          filter: active
            ? `drop-shadow(0 0 8px ${node.color})`
            : `drop-shadow(0 0 3px ${node.color}40)`,
        }}
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={20}
        fill="none"
        stroke={node.color}
        strokeWidth={active ? 2 : 1}
        animate={{ opacity: dimmed ? 0.1 : active ? 0.9 : 0.4 }}
        transition={{ duration: 0.3 }}
      />
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={node.color}
        className="pointer-events-none select-none text-[9px] font-semibold"
        style={{ opacity: dimmed ? 0.2 : 1 }}
      >
        {node.label.length > 12 ? node.label.slice(0, 11) + "…" : node.label}
      </text>
      <text
        x={node.x}
        y={node.y + 28}
        textAnchor="middle"
        className="pointer-events-none select-none text-[8px] text-muted-foreground"
        fill="currentColor"
        style={{ opacity: dimmed ? 0.1 : 0.6 }}
      >
        {node.type}
      </text>
    </motion.g>
  );
}

export function GraphDatabaseVisual() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const connectedIds = selectedNode ? getConnectedIds(selectedNode) : null;

  const handleSelect = useCallback((id: string | null) => {
    setSelectedNode(id);
  }, []);

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          Graph Database
        </span>
      </div>

      <div className="p-4">
        <svg
          viewBox="0 0 320 190"
          className="mx-auto w-full max-w-md"
          onClick={() => setSelectedNode(null)}
        >
          {edges.map((edge) => {
            const isActive =
              connectedIds !== null &&
              connectedIds.has(edge.from) &&
              connectedIds.has(edge.to);
            const isDimmed = connectedIds !== null && !isActive;
            return (
              <EdgePath
                key={`${edge.from}-${edge.to}`}
                edge={edge}
                active={isActive}
                dimmed={isDimmed}
              />
            );
          })}
          {nodes.map((node, i) => {
            const isActive = connectedIds === null || connectedIds.has(node.id);
            const isDimmed = connectedIds !== null && !connectedIds.has(node.id);
            return (
              <NodeCircle
                key={node.id}
                node={node}
                index={i}
                active={selectedNode === node.id || (connectedIds !== null && connectedIds.has(node.id))}
                dimmed={isDimmed}
                onSelect={handleSelect}
              />
            );
          })}
        </svg>
      </div>

      <div className="border-t border-border bg-muted/30 px-4 py-2.5">
        <p className="text-center text-xs text-muted-foreground">
          Click a node to highlight its relationships
        </p>
      </div>
    </div>
  );
}

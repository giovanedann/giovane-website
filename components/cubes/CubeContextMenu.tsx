"use client";

import { motion, AnimatePresence } from "motion/react";
import { Maximize2, Copy, Zap, Minimize2 } from "lucide-react";

interface CubeContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onAction: (action: "augment" | "shatter" | "duplicate" | "shrink") => void;
  onClose: () => void;
}

const actions = [
  { id: "augment" as const, label: "Augment", icon: Maximize2 },
  { id: "shatter" as const, label: "Shatter", icon: Zap },
  { id: "duplicate" as const, label: "Duplicate", icon: Copy },
  { id: "shrink" as const, label: "Shrink", icon: Minimize2 },
];

const CubeContextMenu = ({ x, y, visible, onAction, onClose }: CubeContextMenuProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 min-w-[160px] overflow-hidden rounded-lg border border-white/10 bg-[#141416] p-1 shadow-2xl"
            style={{ left: x, top: y }}
          >
            {actions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onAction(id)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { CubeContextMenu };

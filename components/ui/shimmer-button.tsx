"use client";

import { motion } from "motion/react";

interface ShimmerButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ShimmerButton = ({ children, onClick }: ShimmerButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="group relative min-w-[200px] cursor-pointer overflow-hidden rounded-xl px-8 py-3.5 text-sm font-medium text-foreground transition-colors"
    >
      <span className="absolute inset-0 rounded-xl bg-[#1a1a1a]" />
      <span className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[#222228]" />

      <span className="absolute inset-[-2px] rounded-xl" style={{ padding: "2px" }}>
        <span
          className="absolute inset-[-200%] animate-[shimmer_3s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, #555 10%, transparent 20%, transparent 50%, #555 60%, transparent 70%)",
          }}
        />
      </span>

      <span className="absolute inset-[1px] rounded-[11px] bg-[#0e0e10]" />
      <span className="absolute inset-[1px] rounded-[11px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[#151518]" />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export { ShimmerButton };

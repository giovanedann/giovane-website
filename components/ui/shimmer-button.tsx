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
      whileHover={{
        scale: 1.03,
        rotateX: -2,
        rotateY: 3,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.97 }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
      className="group relative min-w-[260px] cursor-pointer overflow-hidden rounded-xl px-8 py-4 text-sm font-medium text-foreground"
    >
      <span className="absolute inset-[-2px] rounded-xl" style={{ padding: "2px" }}>
        <span
          className="absolute inset-[-200%] animate-[shimmer_3s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, #555 10%, transparent 20%, transparent 50%, #555 60%, transparent 70%)",
          }}
        />
      </span>

      <span className="absolute inset-[1px] rounded-[11px] bg-[#0e0e10] transition-colors duration-300 group-hover:bg-[#151518]" />

      <span
        className="absolute inset-[1px] rounded-[11px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
        }}
      />

      <span
        className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export { ShimmerButton };

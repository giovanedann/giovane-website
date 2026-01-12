"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface BackgroundBoxesProps {
  className?: string;
}

const BoxesCore = ({ className, ...rest }: BackgroundBoxesProps) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(75).fill(1);
  const colors = [
    "#ffffff",
    "#f5f5f5",
    "#e5e5e5",
    "#d4d4d4",
    "#a3a3a3",
    "#fafafa",
    "#f0f0f0",
    "#e0e0e0",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row-${i}`}
          className="relative h-16 w-32 border-l border-border"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col-${j}`}
              className="relative h-16 w-32 border-t border-r border-border"
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const BackgroundBoxes = React.memo(BoxesCore);

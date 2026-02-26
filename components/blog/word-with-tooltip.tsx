"use client";

import { useState, useRef, useEffect } from "react";

interface WordWithTooltipProps {
  children: React.ReactNode;
  tooltip: string;
}

export const WordWithTooltip = ({ children, tooltip }: WordWithTooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (visible && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPosition(rect.top < 60 ? "bottom" : "top");
    }
  }, [visible]);

  return (
    <span
      ref={wrapperRef}
      className="group/tooltip relative inline-block cursor-help border-b border-dotted border-muted-foreground"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible((prev) => !prev)}
    >
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-50 w-max max-w-[250px] -translate-x-1/2 whitespace-normal rounded-md bg-foreground px-2.5 py-1.5 text-xs leading-snug text-background transition-opacity ${
          visible ? "opacity-100" : "opacity-0"
        } ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}
      >
        {tooltip}
      </span>
    </span>
  );
};

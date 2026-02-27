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
  const lastPointerType = useRef<string>("mouse");

  useEffect(() => {
    if (visible && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPosition(rect.top < 60 ? "bottom" : "top");
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const handleOutsideClick = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [visible]);

  return (
    <span
      ref={wrapperRef}
      className="group/tooltip relative inline-block cursor-help border-b border-dotted border-muted-foreground"
      onPointerEnter={(e) => {
        lastPointerType.current = e.pointerType;
        if (e.pointerType !== "touch") setVisible(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") setVisible(false);
      }}
      onClick={() => {
        if (lastPointerType.current === "touch") setVisible((prev) => !prev);
      }}
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

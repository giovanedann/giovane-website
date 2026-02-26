"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Bug } from "lucide-react";

export const UIComparison = () => {
  const [isBeautiful, setIsBeautiful] = useState(false);

  return (
    <div className="my-8 flex flex-col items-center gap-4">
      <div className="w-full overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-secondary/30 px-4 py-2">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs text-muted-foreground">giovanes.dev</span>
        </div>

        <div className="relative h-[400px] sm:h-[450px]">
          <AnimatePresence mode="wait">
            {isBeautiful ? (
              <motion.div
                key="beautiful"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <iframe
                  src="/"
                  className="h-[200%] w-[200%] origin-top-left scale-50 border-none"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </motion.div>
            ) : (
              <motion.div
                key="ugly"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col items-start px-6 pt-16"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <h3
                  style={{
                    fontFamily: "Times New Roman, serif",
                    fontWeight: "normal",
                    fontSize: "0.95rem",
                    color: "#999",
                    margin: 0,
                  }}
                >
                  Giovane Saes
                </h3>

                <p
                  style={{
                    fontFamily: "Times New Roman, serif",
                    fontSize: "0.8rem",
                    color: "#666",
                    margin: 0,
                    marginTop: "2px",
                  }}
                >
                  Product & AI Engineer
                </p>

                <p
                  style={{
                    fontFamily: "Times New Roman, serif",
                    fontSize: "0.8rem",
                    color: "#555",
                    margin: 0,
                    marginTop: "48px",
                  }}
                >
                  Who are you?
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    marginTop: "6px",
                  }}
                >
                  {[
                    "I am an engineer",
                    "I am a recruiter",
                    "I am a wanderer",
                  ].map((label) => (
                    <span
                      key={label}
                      style={{
                        fontFamily: "Times New Roman, serif",
                        fontSize: "0.75rem",
                        color: "#4a7ab5",
                        textDecoration: "underline",
                        cursor: "default",
                        userSelect: "none",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={() => setIsBeautiful((prev) => !prev)}
        className="flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-accent/50"
      >
        {isBeautiful ? (
          <>
            <Bug className="h-4 w-4" />
            Uglify
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Beautify
          </>
        )}
      </button>
    </div>
  );
};

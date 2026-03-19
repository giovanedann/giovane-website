"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Step = {
  id: number;
  title: string;
  description: string;
  sections: {
    label: string;
    color: string;
    bgClass: string;
    width: number;
    dropped?: boolean;
  }[];
  tokensUsed: string;
  percentage: number;
  warning?: string;
};

const steps: Step[] = [
  {
    id: 1,
    title: "Empty Context",
    description: "The context window is completely empty, ready to receive input.",
    sections: [],
    tokensUsed: "0",
    percentage: 0,
  },
  {
    id: 2,
    title: "System Prompt Loaded",
    description:
      "The system prompt defines the model's behavior, personality, and constraints.",
    sections: [
      {
        label: "System Prompt",
        color: "bg-emerald-500",
        bgClass: "bg-emerald-500/20 text-emerald-400",
        width: 10,
      },
    ],
    tokensUsed: "~100K",
    percentage: 10,
  },
  {
    id: 3,
    title: "Conversation Begins",
    description:
      "Messages between user and assistant accumulate in the context window.",
    sections: [
      {
        label: "System Prompt",
        color: "bg-emerald-500",
        bgClass: "bg-emerald-500/20 text-emerald-400",
        width: 10,
      },
      {
        label: "Conversation",
        color: "bg-sky-500",
        bgClass: "bg-sky-500/20 text-sky-400",
        width: 30,
      },
    ],
    tokensUsed: "~400K",
    percentage: 40,
  },
  {
    id: 4,
    title: "Heavy Context Added",
    description:
      "Large codebases or documentation are injected, consuming most of the window.",
    sections: [
      {
        label: "System Prompt",
        color: "bg-emerald-500",
        bgClass: "bg-emerald-500/20 text-emerald-400",
        width: 10,
      },
      {
        label: "Conversation",
        color: "bg-sky-500",
        bgClass: "bg-sky-500/20 text-sky-400",
        width: 30,
      },
      {
        label: "Codebase / Docs",
        color: "bg-violet-500",
        bgClass: "bg-violet-500/20 text-violet-400",
        width: 40,
      },
    ],
    tokensUsed: "~800K",
    percentage: 80,
  },
  {
    id: 5,
    title: "Context Overflow",
    description:
      "The window is full. The oldest content must be dropped to make room for new input.",
    sections: [
      {
        label: "System Prompt",
        color: "bg-emerald-500",
        bgClass: "bg-emerald-500/20 text-emerald-400",
        width: 5,
        dropped: true,
      },
      {
        label: "Conversation",
        color: "bg-sky-500",
        bgClass: "bg-sky-500/20 text-sky-400",
        width: 20,
        dropped: true,
      },
      {
        label: "Conversation",
        color: "bg-sky-500",
        bgClass: "bg-sky-500/20 text-sky-400",
        width: 15,
      },
      {
        label: "Codebase / Docs",
        color: "bg-violet-500",
        bgClass: "bg-violet-500/20 text-violet-400",
        width: 40,
      },
      {
        label: "New Input",
        color: "bg-amber-500",
        bgClass: "bg-amber-500/20 text-amber-400",
        width: 20,
      },
    ],
    tokensUsed: "1M",
    percentage: 100,
  },
];

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border border-border bg-background p-2 transition-all ${
        disabled
          ? "cursor-not-allowed opacity-30"
          : "hover:border-foreground hover:bg-muted"
      }`}
    >
      <svg
        className="h-5 w-5 text-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {direction === "left" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        )}
      </svg>
    </button>
  );
}

function ChatBubbleIcon() {
  return (
    <svg
      className="h-4 w-4 text-sky-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
}

const stripePattern = {
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 8px)",
};

export function ContextWindowVisual() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{step.title}</span>
          <div className="flex items-center gap-2">
            <ArrowButton direction="left" onClick={goPrev} disabled={currentStep === 0} />
            <span className="min-w-[3rem] text-center text-xs text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </span>
            <ArrowButton direction="right" onClick={goNext} disabled={currentStep === steps.length - 1} />
          </div>
        </div>
      </div>

      <div className="min-h-[200px] p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={step.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-5 text-center text-sm text-muted-foreground"
          >
            {step.description}
          </motion.p>
        </AnimatePresence>

        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Context Window</span>
          <span className="text-xs text-muted-foreground">1M tokens</span>
        </div>

        <div className="flex h-10 w-full overflow-hidden rounded-lg border border-border bg-muted/30">
          {step.sections.map((section, i) => (
            <motion.div
              key={`${step.id}-${i}`}
              className={`relative h-full ${section.color} ${section.dropped ? "opacity-40" : ""}`}
              style={section.dropped ? stripePattern : undefined}
              initial={{ width: "0%" }}
              animate={{ width: `${section.width}%` }}
              transition={springTransition}
            >
              {section.width >= 15 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white md:text-xs"
                >
                  {section.label}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.span
              key={step.tokensUsed}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium text-foreground"
            >
              {step.tokensUsed} tokens used
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.span
              key={step.percentage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-medium ${
                step.percentage >= 100
                  ? "text-rose-500"
                  : step.percentage >= 80
                    ? "text-amber-500"
                    : "text-muted-foreground"
              }`}
            >
              {step.percentage}% used
            </motion.span>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-2"
          >
            {step.sections
              .filter(
                (s, i, arr) =>
                  arr.findIndex((x) => x.label === s.label && x.dropped === s.dropped) === i
              )
              .map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${section.bgClass} ${section.dropped ? "line-through opacity-60" : ""}`}
                >
                  {section.label === "Conversation" && !section.dropped && <ChatBubbleIcon />}
                  {section.label}
                  {section.dropped && " (dropped)"}
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {step.warning || step.percentage >= 100 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={springTransition}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5"
            >
              <svg
                className="h-4 w-4 flex-shrink-0 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <span className="text-xs font-medium text-amber-500">
                Oldest content dropped to fit new input
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 border-t border-border bg-muted/30 px-4 py-3">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === currentStep ? "w-4 bg-foreground" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

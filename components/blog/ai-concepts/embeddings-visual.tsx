"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type StepData = {
  id: number;
  title: string;
};

const steps: StepData[] = [
  { id: 1, title: "First Request" },
  { id: 2, title: "Embedding Created" },
  { id: 3, title: "Similar Request Arrives" },
  { id: 4, title: "Similarity Check" },
  { id: 5, title: "Cache Hit!" },
];

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

function ChatBubble({
  text,
  variant,
}: {
  text: string;
  variant: "sky" | "amber";
}) {
  const colors =
    variant === "sky"
      ? "border-sky-500/40 bg-sky-500/10 text-sky-300"
      : "border-amber-500/40 bg-amber-500/10 text-amber-300";

  return (
    <div className={`rounded-lg border px-3 py-2 ${colors}`}>
      <div className="mb-1 flex items-center gap-1.5">
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">
          {variant === "sky" ? "Original" : "New"}
        </span>
      </div>
      <p className="text-xs">{text}</p>
    </div>
  );
}

function LlmIcon({ dimmed, processing }: { dimmed?: boolean; processing?: boolean }) {
  return (
    <motion.div
      animate={
        processing
          ? { scale: [1, 1.1, 1] }
          : {}
      }
      transition={
        processing
          ? { repeat: Infinity, duration: 1, ease: "easeInOut" }
          : {}
      }
      className={`relative flex h-14 w-14 items-center justify-center rounded-xl border ${
        dimmed
          ? "border-muted-foreground/20 bg-muted/30 opacity-40"
          : "border-violet-500/40 bg-violet-500/10"
      }`}
    >
      <svg
        className={`h-7 w-7 ${dimmed ? "text-muted-foreground/40" : "text-violet-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
        />
      </svg>
      {dimmed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[2px] w-10 rotate-45 rounded-full bg-muted-foreground/40" />
        </div>
      )}
    </motion.div>
  );
}

function CacheBox({
  children,
  glowing,
}: {
  children: React.ReactNode;
  glowing?: boolean;
}) {
  return (
    <motion.div
      className={`rounded-lg border-2 border-dashed p-3 ${
        glowing
          ? "border-emerald-500/60 bg-emerald-500/5 shadow-[0_0_20px_-4px] shadow-emerald-500/30"
          : "border-border bg-muted/20"
      }`}
      animate={
        glowing
          ? { borderColor: ["rgba(16,185,129,0.6)", "rgba(16,185,129,0.3)", "rgba(16,185,129,0.6)"] }
          : {}
      }
      transition={glowing ? { repeat: Infinity, duration: 2 } : {}}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <svg
          className={`h-3.5 w-3.5 ${glowing ? "text-emerald-400" : "text-muted-foreground/50"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
          />
        </svg>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${glowing ? "text-emerald-400" : "text-muted-foreground/50"}`}>
          Cache
        </span>
      </div>
      {children}
    </motion.div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={`h-5 w-5 text-muted-foreground/40 ${className ?? ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function VectorDisplay({ values, delay }: { values: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: delay ?? 0 }}
      className="rounded-md border border-violet-500/30 bg-violet-500/5 px-2.5 py-1.5"
    >
      <p className="font-mono text-[11px] text-violet-300">{values}</p>
    </motion.div>
  );
}

function CostBadge({
  cost,
  variant,
  dimmed,
  strikethrough,
}: {
  cost: string;
  variant: "emerald" | "amber";
  dimmed?: boolean;
  strikethrough?: boolean;
}) {
  const colors =
    variant === "emerald"
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-amber-500/20 text-amber-400";

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 font-mono text-xs ${colors} ${
        dimmed ? "opacity-40" : ""
      } ${strikethrough ? "line-through" : ""}`}
    >
      {cost}
    </span>
  );
}

function StepOne() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full max-w-[220px]"
      >
        <ChatBubble text="How much did I spend last month?" variant="sky" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <ArrowRight />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
        className="flex flex-col items-center gap-2"
      >
        <LlmIcon processing />
        <span className="text-xs text-muted-foreground">Processing...</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.6 }}
      >
        <CostBadge cost="$0.003" variant="amber" />
      </motion.div>
    </div>
  );
}

function StepTwo() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-center text-xs text-muted-foreground"
      >
        &quot;How much did I spend last month?&quot;
      </motion.div>

      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="h-6 w-px bg-violet-500/40"
      />

      <VectorDisplay values="[0.82, -0.15, 0.43, ...]" delay={0.4} />

      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="h-6 w-px bg-emerald-500/40"
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.8 }}
        className="w-full max-w-xs"
      >
        <CacheBox>
          <div className="space-y-1.5">
            <div className="rounded border border-border/50 bg-card px-2 py-1">
              <p className="font-mono text-[10px] text-violet-300">[0.82, -0.15, 0.43, ...]</p>
            </div>
            <div className="rounded border border-border/50 bg-card px-2 py-1">
              <p className="text-[10px] text-muted-foreground">→ getSpending(period: &quot;last_month&quot;)</p>
            </div>
          </div>
        </CacheBox>
      </motion.div>
    </div>
  );
}

function StepThree() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 md:gap-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-xs text-muted-foreground"
      >
        Different words, same meaning
      </motion.p>

      <div className="flex w-full flex-col items-center gap-3 md:flex-row md:justify-center md:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full max-w-[220px]"
        >
          <ChatBubble text="How much did I spend last month?" variant="sky" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
          className="text-xs font-medium text-muted-foreground"
        >
          vs
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-full max-w-[220px]"
        >
          <ChatBubble text="How much I spent last month?" variant="amber" />
        </motion.div>
      </div>
    </div>
  );
}

function StepFour() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center gap-3 md:flex-row md:justify-center md:gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <VectorDisplay values="[0.82, -0.15, 0.43, ...]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="flex flex-col items-center gap-1"
        >
          <svg
            className="h-5 w-5 text-muted-foreground/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        >
          <VectorDisplay values="[0.84, -0.13, 0.41, ...]" />
        </motion.div>
      </div>

      <div className="relative flex w-full max-w-xs flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex w-full items-center gap-2"
        >
          <div className="h-px flex-1 border-t border-dashed border-muted-foreground/30" />
          <span className="text-[10px] text-muted-foreground/50">threshold: 0.90</span>
          <div className="h-px flex-1 border-t border-dashed border-muted-foreground/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.7 }}
          className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5"
        >
          <svg
            className="h-4 w-4 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="font-mono text-sm font-semibold text-emerald-400">0.96</span>
        </motion.div>
      </div>
    </div>
  );
}

function StepFive() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-5">
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center gap-2"
        >
          <LlmIcon dimmed />
          <span className="text-[10px] text-muted-foreground/40">Skipped</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-full max-w-[200px]"
        >
          <CacheBox glowing>
            <div className="rounded border border-emerald-500/20 bg-card px-2 py-1">
              <p className="text-[10px] text-emerald-300">→ getSpending(period: &quot;last_month&quot;)</p>
            </div>
          </CacheBox>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
        className="flex flex-col gap-2 md:flex-row md:gap-6"
      >
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <span className="text-[10px] text-muted-foreground">Cost</span>
          <CostBadge cost="$0.0001" variant="emerald" />
          <span className="text-[10px] text-muted-foreground/40">vs</span>
          <CostBadge cost="$0.003" variant="amber" dimmed strikethrough />
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <span className="text-[10px] text-muted-foreground">Speed</span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-xs text-emerald-400">
            ~50ms
          </span>
          <span className="text-[10px] text-muted-foreground/40">vs</span>
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-xs text-amber-400 opacity-40 line-through">
            ~800ms
          </span>
        </div>
      </motion.div>
    </div>
  );
}

const stepComponents = [StepOne, StepTwo, StepThree, StepFour, StepFive];

export function EmbeddingsVisual() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const StepComponent = stepComponents[currentStep];

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {step.title}
          </span>
          <div className="flex items-center gap-2">
            <ArrowButton direction="left" onClick={goPrev} disabled={currentStep === 0} />
            <span className="min-w-[3rem] text-center text-xs text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </span>
            <ArrowButton direction="right" onClick={goNext} disabled={currentStep === steps.length - 1} />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <StepComponent />
          </motion.div>
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

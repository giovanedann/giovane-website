"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Step = {
  id: number;
  title: string;
};

const steps: Step[] = [
  { id: 1, title: "User Asks a Question" },
  { id: 2, title: "Backend Retrieves Data" },
  { id: 3, title: "Data Injected Into Prompt" },
  { id: 4, title: "LLM Generates Response" },
  { id: 5, title: "User Gets the Answer" },
];

const transactions = [
  { name: "Pizza", amount: "$12.50" },
  { name: "Groceries", amount: "$89.00" },
  { name: "Sushi", amount: "$45.00" },
  { name: "Coffee", amount: "$8.50" },
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

function UserIcon({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <svg
      className={`h-10 w-10 transition-colors duration-300 ${
        dimmed ? "text-sky-500/30" : "text-sky-500"
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function DatabaseIcon({ active = false }: { active?: boolean }) {
  return (
    <motion.div
      animate={active ? { scale: [1, 1.08, 1] } : {}}
      transition={{ repeat: active ? Infinity : 0, duration: 1.2 }}
    >
      <svg
        className={`h-10 w-10 transition-colors duration-300 ${
          active ? "text-emerald-500" : "text-muted-foreground/30"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    </motion.div>
  );
}

function LLMIcon({ active = false, processing = false }: { active?: boolean; processing?: boolean }) {
  return (
    <motion.div
      animate={
        processing
          ? { scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }
          : {}
      }
      transition={{ repeat: processing ? Infinity : 0, duration: 1 }}
    >
      <svg
        className={`h-10 w-10 transition-colors duration-300 ${
          processing
            ? "text-violet-500"
            : active
              ? "text-violet-400"
              : "text-muted-foreground/30"
        }`}
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
    </motion.div>
  );
}

function StepOne() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-6 md:flex-row md:gap-10">
      <div className="flex flex-col items-center gap-3">
        <UserIcon />
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.15 }}
          className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-2.5"
        >
          <p className="text-center text-sm text-sky-400">
            &ldquo;How much did I spend on food last month?&rdquo;
          </p>
        </motion.div>
      </div>
      <div className="flex flex-col items-center gap-2 opacity-30">
        <LLMIcon />
        <span className="text-xs text-muted-foreground">LLM</span>
      </div>
    </div>
  );
}

function StepTwo() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-6">
      <DatabaseIcon active />
      <div className="grid w-full max-w-xs gap-2">
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.name}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
              delay: i * 0.12,
            }}
            className="flex items-center justify-between rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5"
          >
            <span className="text-sm text-emerald-400">{tx.name}</span>
            <span className="font-mono text-sm text-emerald-300">{tx.amount}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StepThree() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="w-full max-w-sm rounded-lg border border-border bg-background p-4"
      >
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Prompt
        </p>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.2 }}
          className="mb-3 rounded-md border border-sky-500/20 bg-sky-500/10 px-3 py-2"
        >
          <p className="text-sm text-sky-400">
            &ldquo;How much did I spend on food last month?&rdquo;
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.4 }}
          className="space-y-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2"
        >
          <p className="text-xs font-medium text-emerald-400">Context:</p>
          {transactions.map((tx) => (
            <p key={tx.name} className="text-xs text-emerald-300/80">
              {tx.name}: {tx.amount}
            </p>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function StepFour() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-6 md:flex-row md:gap-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="w-full max-w-[200px] rounded-lg border border-border bg-background p-3"
      >
        <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Prompt
        </p>
        <div className="mb-1.5 rounded bg-sky-500/10 px-2 py-1">
          <p className="truncate text-xs text-sky-400/70">User question</p>
        </div>
        <div className="rounded bg-emerald-500/10 px-2 py-1">
          <p className="truncate text-xs text-emerald-400/70">+ Transaction data</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <svg
          className="h-6 w-6 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.35 }}
        className="flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(139, 92, 246, 0)",
              "0 0 20px 8px rgba(139, 92, 246, 0.3)",
              "0 0 0 0 rgba(139, 92, 246, 0)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="rounded-full border border-violet-500/30 bg-violet-500/10 p-4"
        >
          <LLMIcon active processing />
        </motion.div>
        <span className="text-xs font-medium text-violet-400">Processing...</span>
      </motion.div>
    </div>
  );
}

function StepFive() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="flex items-start gap-3 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-3"
      >
        <LLMIcon active />
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-violet-300"
          >
            &ldquo;You spent <span className="font-semibold text-emerald-400">$155.00</span> on food last month.&rdquo;
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.4 }}
        className="flex items-center gap-2"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.6 }}
        >
          <svg
            className="h-6 w-6 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <span className="text-sm text-emerald-400">Accurate, grounded in real data</span>
      </motion.div>
    </div>
  );
}

const stepComponents = [StepOne, StepTwo, StepThree, StepFour, StepFive];

export function RAGVisual() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const StepContent = stepComponents[currentStep];

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

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
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <StepContent />
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

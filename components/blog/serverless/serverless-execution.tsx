"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Step = {
  id: number;
  title: string;
  description: string;
  vps: {
    serverActive: boolean;
    serverStatus: "idle" | "processing";
    costLabel: string;
    note: string;
  };
  serverless: {
    functionActive: boolean;
    functionStatus: "cold" | "warm" | "processing" | "off";
    costLabel: string;
    note: string;
  };
  showRequest: boolean;
  showResponse: boolean;
};

const steps: Step[] = [
  {
    id: 1,
    title: "Waiting for Requests",
    description: "No traffic yet. Let's see what happens...",
    vps: {
      serverActive: true,
      serverStatus: "idle",
      costLabel: "$0.07/hr",
      note: "Server running, waiting...",
    },
    serverless: {
      functionActive: false,
      functionStatus: "off",
      costLabel: "$0.00",
      note: "Nothing running",
    },
    showRequest: false,
    showResponse: false,
  },
  {
    id: 2,
    title: "Request Arrives",
    description: "A user makes a request to your API.",
    vps: {
      serverActive: true,
      serverStatus: "idle",
      costLabel: "$0.07/hr",
      note: "Ready to process",
    },
    serverless: {
      functionActive: true,
      functionStatus: "cold",
      costLabel: "$0.0000002",
      note: "Cold starting...",
    },
    showRequest: true,
    showResponse: false,
  },
  {
    id: 3,
    title: "Processing",
    description: "Both systems process the request.",
    vps: {
      serverActive: true,
      serverStatus: "processing",
      costLabel: "$0.07/hr",
      note: "Processing request",
    },
    serverless: {
      functionActive: true,
      functionStatus: "processing",
      costLabel: "$0.0000004",
      note: "Executing function",
    },
    showRequest: false,
    showResponse: false,
  },
  {
    id: 4,
    title: "Response Sent",
    description: "The response is returned to the client.",
    vps: {
      serverActive: true,
      serverStatus: "processing",
      costLabel: "$0.07/hr",
      note: "Response sent",
    },
    serverless: {
      functionActive: true,
      functionStatus: "warm",
      costLabel: "$0.0000006",
      note: "Response sent",
    },
    showRequest: false,
    showResponse: true,
  },
  {
    id: 5,
    title: "Back to Idle",
    description: "No more requests. What are you paying for?",
    vps: {
      serverActive: true,
      serverStatus: "idle",
      costLabel: "$0.07/hr",
      note: "Still paying, doing nothing",
    },
    serverless: {
      functionActive: false,
      functionStatus: "off",
      costLabel: "$0.00",
      note: "Scaled to zero",
    },
    showRequest: false,
    showResponse: false,
  },
];

function ClientIcon() {
  return (
    <svg
      className="h-10 w-10 text-sky-500"
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

function ServerIcon({ active, processing }: { active: boolean; processing: boolean }) {
  return (
    <motion.div
      animate={processing ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: processing ? Infinity : 0, duration: 0.8 }}
    >
      <svg
        className={`h-12 w-12 transition-colors duration-300 ${
          active
            ? processing
              ? "text-emerald-500"
              : "text-amber-500"
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
          d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
        />
      </svg>
    </motion.div>
  );
}

function FunctionIcon({ status }: { status: "cold" | "warm" | "processing" | "off" }) {
  const isActive = status !== "off";
  const isProcessing = status === "processing";
  const isCold = status === "cold";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: isActive ? 1 : 0.8,
        opacity: isActive ? 1 : 0.3,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        animate={isProcessing ? { scale: [1, 1.1, 1] } : isCold ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={{ repeat: isProcessing || isCold ? Infinity : 0, duration: isCold ? 0.5 : 0.8 }}
      >
        <svg
          className={`h-10 w-10 transition-colors duration-300 ${
            isProcessing
              ? "text-emerald-500"
              : isCold
                ? "text-amber-500"
                : isActive
                  ? "text-sky-500"
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
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function ConnectionArrow({
  showRequest,
  showResponse,
}: {
  showRequest: boolean;
  showResponse: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Request arrow (left to right) */}
      <div className="relative h-1 w-20 overflow-hidden rounded-full bg-border md:w-32">
        <AnimatePresence>
          {showRequest && (
            <motion.div
              className="absolute inset-y-0 h-full w-6 rounded-full bg-sky-500"
              initial={{ x: -24 }}
              animate={{ x: 140 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </div>
      {/* Response arrow (right to left) */}
      <div className="relative h-1 w-20 overflow-hidden rounded-full bg-border md:w-32">
        <AnimatePresence>
          {showResponse && (
            <motion.div
              className="absolute inset-y-0 h-full w-6 rounded-full bg-emerald-500"
              initial={{ x: 140 }}
              animate={{ x: -24 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

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

function CostBadge({ cost, isWasting }: { cost: string; isWasting: boolean }) {
  return (
    <motion.div
      className={`rounded-full px-2 py-0.5 font-mono text-xs ${
        isWasting
          ? "bg-amber-500/20 text-amber-500"
          : "bg-emerald-500/20 text-emerald-500"
      }`}
      animate={isWasting ? { opacity: [1, 0.6, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      {cost}
    </motion.div>
  );
}

export function ServerlessExecution() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

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

      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={step.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-6 text-center text-sm text-muted-foreground"
          >
            {step.description}
          </motion.p>
        </AnimatePresence>

        <div className="space-y-6">
          {/* VPS Row */}
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">VPS (Traditional)</span>
              <CostBadge
                cost={step.vps.costLabel}
                isWasting={step.vps.serverStatus === "idle" && step.vps.serverActive}
              />
            </div>
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <div className="flex flex-col items-center">
                <ClientIcon />
                <span className="mt-1 text-xs text-muted-foreground">Client</span>
              </div>
              <ConnectionArrow showRequest={step.showRequest} showResponse={step.showResponse} />
              <div className="flex flex-col items-center">
                <ServerIcon
                  active={step.vps.serverActive}
                  processing={step.vps.serverStatus === "processing"}
                />
                <span className="mt-1 text-xs text-muted-foreground">Server</span>
              </div>
            </div>
            <motion.p
              key={`vps-${step.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-center text-xs text-muted-foreground"
            >
              {step.vps.note}
            </motion.p>
          </div>

          {/* Serverless Row */}
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Serverless</span>
              <CostBadge cost={step.serverless.costLabel} isWasting={false} />
            </div>
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <div className="flex flex-col items-center">
                <ClientIcon />
                <span className="mt-1 text-xs text-muted-foreground">Client</span>
              </div>
              <ConnectionArrow showRequest={step.showRequest} showResponse={step.showResponse} />
              <div className="flex flex-col items-center">
                <FunctionIcon status={step.serverless.functionStatus} />
                <span className="mt-1 text-xs text-muted-foreground">Function</span>
              </div>
            </div>
            <motion.p
              key={`serverless-${step.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-center text-xs text-muted-foreground"
            >
              {step.serverless.note}
            </motion.p>
          </div>
        </div>
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Step = {
  id: number;
  title: string;
  description: string;
  requestCount: number;
  vps: {
    servers: number;
    status: "healthy" | "stressed" | "overloaded";
    queuedRequests: number;
    note: string;
  };
  serverless: {
    instances: number;
    status: "healthy" | "scaling";
    note: string;
  };
};

const steps: Step[] = [
  {
    id: 1,
    title: "Normal Traffic",
    description: "A few requests per second. Everything is fine.",
    requestCount: 3,
    vps: {
      servers: 1,
      status: "healthy",
      queuedRequests: 0,
      note: "Handling traffic easily",
    },
    serverless: {
      instances: 3,
      status: "healthy",
      note: "3 concurrent instances",
    },
  },
  {
    id: 2,
    title: "Traffic Increasing",
    description: "More users are coming in. Traffic is growing.",
    requestCount: 8,
    vps: {
      servers: 1,
      status: "stressed",
      queuedRequests: 3,
      note: "Getting busy, some queuing",
    },
    serverless: {
      instances: 8,
      status: "scaling",
      note: "Scaling up automatically",
    },
  },
  {
    id: 3,
    title: "Traffic Spike!",
    description: "You're on the front page of Hacker News!",
    requestCount: 20,
    vps: {
      servers: 1,
      status: "overloaded",
      queuedRequests: 15,
      note: "Overwhelmed! Requests timing out",
    },
    serverless: {
      instances: 20,
      status: "scaling",
      note: "20 instances, all requests served",
    },
  },
  {
    id: 4,
    title: "Traffic Normalizes",
    description: "The spike is over. Traffic returns to normal.",
    requestCount: 4,
    vps: {
      servers: 1,
      status: "healthy",
      queuedRequests: 0,
      note: "Recovering, back to normal",
    },
    serverless: {
      instances: 4,
      status: "healthy",
      note: "Scaled down automatically",
    },
  },
];

function RequestDot({ delay, failed }: { delay: number; failed?: boolean }) {
  return (
    <motion.div
      className={`h-2.5 w-2.5 rounded-full ${failed ? "bg-red-500" : "bg-violet-500"}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay * 0.05, type: "spring", stiffness: 500, damping: 25 }}
    />
  );
}

function ServerIcon({ status }: { status: "healthy" | "stressed" | "overloaded" }) {
  const colorClass =
    status === "healthy"
      ? "text-emerald-500"
      : status === "stressed"
        ? "text-amber-500"
        : "text-red-500";

  return (
    <motion.div
      animate={
        status === "overloaded"
          ? { x: [-1, 1, -1, 1, 0], rotate: [-1, 1, -1, 1, 0] }
          : status === "stressed"
            ? { scale: [1, 1.02, 1] }
            : {}
      }
      transition={{
        repeat: status !== "healthy" ? Infinity : 0,
        duration: status === "overloaded" ? 0.2 : 0.8,
      }}
    >
      <svg
        className={`h-10 w-10 ${colorClass}`}
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

function FunctionIcon({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 400, damping: 20 }}
    >
      <svg
        className="h-6 w-6 text-sky-500"
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

function StatusBadge({ status, label }: { status: "healthy" | "stressed" | "overloaded" | "scaling"; label: string }) {
  const colorClass =
    status === "healthy"
      ? "bg-emerald-500/20 text-emerald-500"
      : status === "scaling"
        ? "bg-sky-500/20 text-sky-500"
        : status === "stressed"
          ? "bg-amber-500/20 text-amber-500"
          : "bg-red-500/20 text-red-500";

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}

export function ServerlessScaling() {
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

      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={step.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-4 text-center text-sm text-muted-foreground"
          >
            {step.description}
          </motion.p>
        </AnimatePresence>

        {/* Incoming Requests */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Incoming requests:</span>
          <div className="flex flex-wrap gap-1">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: step.requestCount }).map((_, i) => (
                <RequestDot key={`req-${step.id}-${i}`} delay={i} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* VPS */}
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">VPS</span>
              <StatusBadge
                status={step.vps.status}
                label={step.vps.status === "healthy" ? "OK" : step.vps.status === "stressed" ? "Busy" : "Down!"}
              />
            </div>

            <div className="flex min-h-[80px] flex-col items-center justify-center">
              <div className="flex items-center gap-2">
                <ServerIcon status={step.vps.status} />
              </div>

              {step.vps.queuedRequests > 0 && (
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Queue:</span>
                  <div className="flex flex-wrap gap-0.5">
                    {Array.from({ length: Math.min(step.vps.queuedRequests, 10) }).map((_, i) => (
                      <RequestDot
                        key={i}
                        delay={i}
                        failed={step.vps.status === "overloaded" && i > 5}
                      />
                    ))}
                    {step.vps.queuedRequests > 10 && (
                      <span className="ml-1 text-xs text-red-500">+{step.vps.queuedRequests - 10}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground">{step.vps.note}</p>
          </div>

          {/* Serverless */}
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Serverless</span>
              <StatusBadge
                status={step.serverless.status}
                label={step.serverless.status === "scaling" ? "Scaling" : "OK"}
              />
            </div>

            <div className="flex min-h-[80px] flex-col items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <AnimatePresence mode="popLayout">
                  {Array.from({ length: step.serverless.instances }).map((_, i) => (
                    <FunctionIcon key={`fn-${step.id}-${i}`} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground">{step.serverless.note}</p>
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

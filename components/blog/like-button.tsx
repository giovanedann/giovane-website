"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { getDeviceFingerprint } from "@/lib/fingerprint";
import type { LikeResponse } from "@/types/dynamodb";

interface LikeButtonProps {
  slug: string;
}

function BurstParticle({ index, total }: { index: number; total: number }) {
  const angle = (index / total) * 360;
  const distance = 30 + Math.random() * 20;
  const size = 4 + Math.random() * 4;

  return (
    <motion.div
      className="absolute rounded-full bg-foreground"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
      }}
      initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 1 }}
      animate={{
        x: `calc(-50% + ${Math.cos((angle * Math.PI) / 180) * distance}px)`,
        y: `calc(-50% + ${Math.sin((angle * Math.PI) / 180) * distance}px)`,
        scale: 0,
        opacity: 0,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
  );
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const fetchLikes = useCallback(async () => {
    try {
      const fingerprint = await getDeviceFingerprint();
      const response = await fetch(`/api/likes/${slug}`, {
        headers: {
          "x-device-fingerprint": fingerprint,
        },
      });

      if (response.ok) {
        const data: LikeResponse = await response.json();
        setLikeCount(data.likeCount);
        setUserLiked(data.userLiked);
      }
    } catch (error) {
      console.error("Failed to fetch likes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const toggleLike = async () => {
    if (isToggling) return;

    const previousCount = likeCount;
    const previousLiked = userLiked;
    const willLike = !userLiked;

    setUserLiked(willLike);
    setLikeCount((prev) => (userLiked ? prev - 1 : prev + 1));
    setIsToggling(true);

    if (willLike) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 600);
    }

    try {
      const fingerprint = await getDeviceFingerprint();
      const response = await fetch(`/api/likes/${slug}`, {
        method: "POST",
        headers: {
          "x-device-fingerprint": fingerprint,
        },
      });

      if (response.ok) {
        const data: LikeResponse = await response.json();
        setLikeCount(data.likeCount);
        setUserLiked(data.userLiked);
      } else {
        setLikeCount(previousCount);
        setUserLiked(previousLiked);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setLikeCount(previousCount);
      setUserLiked(previousLiked);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading || isToggling}
      className="group flex items-center gap-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
      aria-label={userLiked ? "Unlike this post" : "Like this post"}
    >
      <div className="relative">
        <motion.div
          animate={userLiked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Heart
            className={`size-8 transition-all duration-300 ${
              userLiked
                ? "fill-foreground text-foreground"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
            strokeWidth={userLiked ? 0 : 1.5}
          />

          <AnimatePresence>
            {userLiked && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Heart
                  className="size-8 fill-foreground text-foreground"
                  strokeWidth={0}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {showBurst && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <BurstParticle key={i} index={i} total={8} />
              ))}
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBurst && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-foreground"
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.span
          key={likeCount}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold text-foreground tabular-nums"
        >
          {isLoading ? "–" : likeCount}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

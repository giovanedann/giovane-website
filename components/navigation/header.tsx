"use client";

import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useSidebar } from "./sidebar-provider";

export const Header = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </motion.button>
    </header>
  );
};

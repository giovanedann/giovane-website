"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { House, PenLine, User, Gamepad2, BookOpen } from "lucide-react";
import { useSidebar } from "./sidebar-provider";

const navItems = [
  { href: "/", label: "Home", icon: House },
  { href: "/blog", label: "Blog", icon: PenLine },
  { href: "/about", label: "About", icon: User },
  { href: "/game", label: "Game", icon: Gamepad2 },
  { href: "/library", label: "Library", icon: BookOpen },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export const Sidebar = () => {
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-14 z-40 bg-black/40 md:hidden"
            onClick={close}
          />
          <motion.nav
            initial={{ x: -220 }}
            animate={{ x: 0 }}
            exit={{ x: -220 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-14 bottom-0 left-0 z-50 w-[220px] border-r border-border bg-background p-4"
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-accent/50 text-foreground"
                          : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

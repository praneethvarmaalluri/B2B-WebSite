"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SelectPill({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-accent bg-accent text-white"
          : "border-white/10 bg-white/[0.03] text-zinc-300"
      )}
    >
      {label}
    </motion.button>
  );
}
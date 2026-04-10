"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CheckboxCard({
  label,
  checked,
  onToggle
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      className={cn(
        "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors",
        checked
          ? "border-accent bg-accent/10 text-white"
          : "border-white/10 bg-white/[0.03] text-zinc-300"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "h-4 w-4 rounded-full border",
          checked ? "border-accent bg-accent" : "border-white/20"
        )}
      />
    </motion.button>
  );
}
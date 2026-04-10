"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

type AnimatedButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  children: React.ReactNode;
} & Omit<HTMLMotionProps<"button">, "children">;

export function AnimatedButton({
  className,
  variant = "primary",
  fullWidth = false,
  children,
  type = "button",
  ...props
}: AnimatedButtonProps) {
  const variants = {
    primary: "bg-accent text-white shadow-glow",
    secondary: "bg-white text-black",
    outline: "border border-white/15 bg-transparent text-white"
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0.92, y: 8 }}
      transition={{ duration: 0.25 }}
      viewport={{ once: true, amount: 0.4 }}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-colors duration-200",
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
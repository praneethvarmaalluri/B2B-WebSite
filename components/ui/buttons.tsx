import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  fullWidth?: boolean;
}

export function Button({
  className,
  variant = "primary",
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-accent text-white hover:bg-accentDark shadow-glow active:shadow-none",
    secondary:
      "bg-white text-black hover:bg-offwhite",
    ghost:
      "bg-transparent text-white hover:bg-white/5",
    outline:
      "border border-white/15 bg-transparent text-white hover:bg-white/5"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}
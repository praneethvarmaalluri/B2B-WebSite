import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent";
};

export function Badge({
  children,
  className,
  variant = "default"
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white shadow-lg backdrop-blur-md",
        variant === "accent"
          ? "bg-red-600/95 border border-red-400/40"
          : "bg-red-500/90 border border-red-300/30",
        className
      )}
    >
      {children}
    </span>
  );
}
import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-card/80 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
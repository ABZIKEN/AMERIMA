import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] bg-surface shadow-card ring-1 ring-line/80",
        className,
      )}
      {...props}
    />
  );
}

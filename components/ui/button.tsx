import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export function Button({
  className,
  variant = "primary",
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition active:scale-[0.98]",
        fullWidth && "w-full",
        variant === "primary" && "bg-accentDeep text-white shadow-card",
        variant === "secondary" && "bg-tint text-accentDeep",
        variant === "ghost" && "bg-surface text-ink ring-1 ring-line",
        className,
      )}
      {...props}
    />
  );
}

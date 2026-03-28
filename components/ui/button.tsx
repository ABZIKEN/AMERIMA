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
        "inline-flex h-12 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition duration-200 ease-out active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDeep/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-accentDeep text-white shadow-card hover:brightness-105",
        variant === "secondary" && "bg-tint text-accentDeep hover:bg-[#dbe8ff]",
        variant === "ghost" &&
          "bg-surface text-ink ring-1 ring-line hover:bg-[#f2f7ff]",
        className,
      )}
      {...props}
    />
  );
}

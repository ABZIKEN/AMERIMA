import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function Chip({ active, className, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "rounded-full px-4 py-2 text-xs font-medium transition",
        active
          ? "bg-accentDeep text-white"
          : "bg-[#f4f7f2] text-muted ring-1 ring-line",
        className,
      )}
      {...props}
    />
  );
}

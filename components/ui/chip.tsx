import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function Chip({ active, className, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "rounded-full px-4 py-2 text-xs font-medium transition duration-200 ease-out active:scale-[0.97]",
        active
          ? "bg-accentDeep text-white shadow-sm"
          : "bg-[#f4f7f2] text-muted ring-1 ring-line hover:bg-[#edf3ff]",
        className,
      )}
      {...props}
    />
  );
}

import { BookOpen, MessageCircleMore, ScanLine, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export type AppTab = "Scan" | "Chat" | "Library" | "Profile";

const tabs = [
  { label: "Scan", icon: ScanLine },
  { label: "Chat", icon: MessageCircleMore },
  { label: "Library", icon: BookOpen },
  { label: "Profile", icon: UserRound },
] as const;

export function BottomNav({
  active,
  onChange,
}: {
  active: AppTab;
  onChange: (tab: AppTab) => void;
}) {
  return (
    <div className="sticky bottom-0 z-20 mt-auto border-t border-line/70 bg-surface/95 px-3 pb-6 pt-3 backdrop-blur">
      <div className="grid grid-cols-4 gap-2 rounded-[28px] bg-[#f2f6f1] p-2 ring-1 ring-line/80">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onChange(label)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium transition",
              active === label
                ? "bg-surface text-accentDeep shadow-sm"
                : "text-muted",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-waves px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[100dvh] max-w-6xl items-center justify-center">
        <div className="relative w-full max-w-[430px] overflow-hidden rounded-[42px] border border-white/60 bg-[#f8fbf8] shadow-device backdrop-blur">
          <div className="absolute inset-x-0 top-0 z-20 flex justify-center pt-3">
            <div className="h-7 w-36 rounded-full bg-[#111111]" />
          </div>
          <div className="absolute left-6 top-14 flex items-center gap-2 text-[11px] font-semibold text-accentDeep">
            <Sparkles className="h-3.5 w-3.5" />
            PURE ai preview
          </div>
          <div className="min-h-[100dvh] pt-16">{children}</div>
        </div>
      </div>
    </div>
  );
}

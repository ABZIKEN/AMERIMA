"use client";

import { useMemo, useState } from "react";
import {
  Camera,
  ChevronRight,
  ImageIcon,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { BottomNav, type AppTab } from "@/components/bottom-nav";
import { MobileShell } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import {
  allergyOptions,
  certifiedItems,
  chatOutcomes,
  chatQuickReplies,
  chatSeeds,
  defaultPreferences,
  dietOptions,
  foodResult,
  followUpOptions,
  historyItems,
  productResult,
  savedItems,
  scanModes,
  type PreferenceState,
  type ScanMode,
} from "@/data/mock-data";
import { cn } from "@/lib/utils";

type Stage = "welcome" | "onboarding" | "app";
type ScanView = "idle" | "food-result" | "product-result";
type LibraryTab = "History" | "Saved" | "Certified";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

export function PureApp() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [selectedDiets, setSelectedDiets] = useState<string[]>([
    "carnivore",
    "keto",
  ]);
  const [primaryDiet, setPrimaryDiet] = useState<string>("carnivore");
  const [preferences, setPreferences] =
    useState<PreferenceState>(defaultPreferences);
  const [activeTab, setActiveTab] = useState<AppTab>("Scan");
  const [scanMode, setScanMode] = useState<ScanMode>("Food");
  const [scanView, setScanView] = useState<ScanView>("idle");
  const [selectedFollowUp, setSelectedFollowUp] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(chatSeeds);
  const [selectedChatReply, setSelectedChatReply] = useState<string>(
    "It was butter basted",
  );
  const [libraryTab, setLibraryTab] = useState<LibraryTab>("History");

  const dietName = (id: string) =>
    dietOptions.find((diet) => diet.id === id)?.name ?? id;

  const primaryDietName = dietName(primaryDiet);
  const secondaryDietId =
    selectedDiets.find((diet) => diet !== primaryDiet) ?? selectedDiets[0];
  const secondaryDietName = secondaryDietId
    ? dietName(secondaryDietId)
    : "No secondary diet";

  const currentChatOutcome = chatOutcomes[selectedChatReply];

  const libraryItems = useMemo(() => {
    if (libraryTab === "Saved") return savedItems;
    if (libraryTab === "Certified") return certifiedItems;
    return historyItems;
  }, [libraryTab]);

  const toggleDiet = (dietId: string) => {
    setSelectedDiets((current) => {
      if (current.includes(dietId)) {
        const next = current.filter((item) => item !== dietId);
        if (!next.includes(primaryDiet) && next.length > 0) {
          setPrimaryDiet(next[0]);
        }
        return next;
      }
      if (current.length >= 2) return current;
      return [...current, dietId];
    });
  };

  const startPrototype = () => {
    if (selectedDiets.length === 0) return;
    if (!selectedDiets.includes(primaryDiet)) {
      setPrimaryDiet(selectedDiets[0]);
    }
    setStage("app");
  };

  const simulateScan = (kind: "food" | "product") => {
    setScanView(kind === "food" ? "food-result" : "product-result");
    setActiveTab("Scan");
  };

  const applyChatReply = (reply: string) => {
    setSelectedChatReply(reply);
    setChatMessages([
      ...chatSeeds,
      { role: "user", text: reply },
      { role: "assistant", text: chatOutcomes[reply].summary },
      { role: "assistant", text: chatOutcomes[reply].guidance },
    ]);
  };

  return (
    <MobileShell>
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
        {stage === "welcome" && (
          <WelcomeScreen
            onGetStarted={() => setStage("onboarding")}
            onUseExistingSettings={startPrototype}
          />
        )}

        {stage === "onboarding" && (
          <OnboardingScreen
            selectedDiets={selectedDiets}
            primaryDiet={primaryDiet}
            preferences={preferences}
            onToggleDiet={toggleDiet}
            onSetPrimaryDiet={setPrimaryDiet}
            onChangePreferences={setPreferences}
            onContinue={startPrototype}
          />
        )}

        {stage === "app" && (
          <>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <Header
                primaryDiet={primaryDietName}
                secondaryDiet={secondaryDietName}
              />
              {activeTab === "Scan" && (
                <ScanScreen
                  scanMode={scanMode}
                  setScanMode={setScanMode}
                  scanView={scanView}
                  primaryDietName={primaryDietName}
                  secondaryDietName={secondaryDietName}
                  selectedFollowUp={selectedFollowUp}
                  onSelectFollowUp={setSelectedFollowUp}
                  onSimulateFood={() => simulateScan("food")}
                  onSimulateProduct={() => simulateScan("product")}
                  onOpenChat={() => setActiveTab("Chat")}
                />
              )}
              {activeTab === "Chat" && (
                <ChatScreen
                  messages={chatMessages}
                  selectedReply={selectedChatReply}
                  outcome={currentChatOutcome}
                  onSelectReply={applyChatReply}
                />
              )}
              {activeTab === "Library" && (
                <LibraryScreen
                  activeTab={libraryTab}
                  setActiveTab={setLibraryTab}
                  items={libraryItems}
                />
              )}
              {activeTab === "Profile" && (
                <ProfileScreen
                  selectedDiets={selectedDiets.map(dietName)}
                  primaryDiet={primaryDietName}
                  preferences={preferences}
                />
              )}
            </div>
            <BottomNav active={activeTab} onChange={setActiveTab} />
          </>
        )}
      </div>
    </MobileShell>
  );
}

function Header({
  primaryDiet,
  secondaryDiet,
}: {
  primaryDiet: string;
  secondaryDiet: string;
}) {
  return (
    <div className="mb-5 rounded-[30px] bg-[#f7fbf6] px-4 pb-4 pt-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-accentDeep">
            PURE ai
          </p>
          <h1 className="text-[28px] font-semibold leading-tight text-ink">
            Food intelligence that feels pure.
          </h1>
        </div>
        <div className="rounded-2xl bg-tint px-3 py-2 text-right text-[11px] text-accentDeep">
          <div>Primary</div>
          <div className="font-semibold">{primaryDiet}</div>
        </div>
      </div>
      <p className="text-sm text-muted">
        Your current stack: {primaryDiet} + {secondaryDiet}. Scan food, labels,
        and products in an iPhone-style prototype.
      </p>
    </div>
  );
}

function WelcomeScreen({
  onGetStarted,
  onUseExistingSettings,
}: {
  onGetStarted: () => void;
  onUseExistingSettings: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col justify-between px-4 pb-6 pt-8">
      <div className="space-y-8">
        <div className="grid h-16 w-16 grid-cols-4 gap-2 rounded-3xl bg-surface p-3 shadow-card">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} className="rounded-full bg-[#4b7cd9]" />
          ))}
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.36em] text-[#4b7cd9]">
            PURE ai
          </p>
          <h2 className="text-5xl font-semibold tracking-[-0.05em] text-[#4b7cd9]">
            PURE
          </h2>
          <div className="mt-4 h-px w-full bg-[#4b7cd9]/50" />
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-semibold leading-tight text-ink">
            Scan food. Match your diet. Learn what’s truly pure.
          </h3>
          <p className="text-sm leading-6 text-muted">
            A premium health-tech experience inspired by the brand style: clean
            white space, crisp blue-green accents, and a calm iOS-native feel.
          </p>
        </div>
        <Card className="bg-waves p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/80 p-3 text-accentDeep">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">MVP prototype</p>
              <p className="text-xs text-muted">
                Mock scans, smart diet verdicts, and reusable UI ready for a
                real backend later.
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="space-y-3">
        <Button fullWidth onClick={onGetStarted}>
          Get Started
        </Button>
        <Button fullWidth variant="secondary" onClick={onUseExistingSettings}>
          Use Existing Settings
        </Button>
      </div>
    </div>
  );
}

function OnboardingScreen({
  selectedDiets,
  primaryDiet,
  preferences,
  onToggleDiet,
  onSetPrimaryDiet,
  onChangePreferences,
  onContinue,
}: {
  selectedDiets: string[];
  primaryDiet: string;
  preferences: PreferenceState;
  onToggleDiet: (dietId: string) => void;
  onSetPrimaryDiet: (dietId: string) => void;
  onChangePreferences: (preferences: PreferenceState) => void;
  onContinue: () => void;
}) {
  const canContinue =
    selectedDiets.length > 0 && selectedDiets.includes(primaryDiet);

  return (
    <div className="space-y-4 px-4 pb-6 pt-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accentDeep">
          Onboarding
        </p>
        <h2 className="mt-1 text-3xl font-semibold text-ink">
          Build your PURE diet profile.
        </h2>
        <p className="mt-2 text-sm text-muted">
          Choose up to 2 diets, mark the primary one, then dial in the rules
          that matter most.
        </p>
      </div>

      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-ink">Choose diets</h3>
          <span className="text-xs text-muted">Up to 2</span>
        </div>
        <div className="space-y-3">
          {dietOptions.map((diet) => {
            const selected = selectedDiets.includes(diet.id);
            const isPrimary = primaryDiet === diet.id;
            return (
              <button
                key={diet.id}
                onClick={() => onToggleDiet(diet.id)}
                className={cn(
                  "w-full rounded-[24px] border p-4 text-left transition",
                  selected
                    ? "border-accentDeep bg-tint/70"
                    : "border-line bg-[#fafdfa]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-ink">{diet.name}</div>
                    <div className="mt-1 text-sm text-muted">{diet.blurb}</div>
                  </div>
                  {selected && (
                    <span className="rounded-full bg-accentDeep px-2 py-1 text-[10px] font-semibold text-white">
                      Selected
                    </span>
                  )}
                </div>
                {selected && (
                  <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 text-xs text-muted">
                    <span>{isPrimary ? "Primary diet" : "Set as primary"}</span>
                    <input
                      type="radio"
                      checked={isPrimary}
                      onChange={() => onSetPrimaryDiet(diet.id)}
                      className="h-4 w-4 accent-[#2f8f59]"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-accentDeep" />
          <h3 className="font-semibold text-ink">Preferences</h3>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Strictness
            </label>
            <div className="flex flex-wrap gap-2">
              {(["Balanced", "Strict", "Very strict"] as const).map((level) => (
                <Chip
                  key={level}
                  active={preferences.strictness === level}
                  onClick={() =>
                    onChangePreferences({ ...preferences, strictness: level })
                  }
                >
                  {level}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ToggleRow
              label="Avoid seed oils"
              checked={preferences.avoidSeedOils}
              onToggle={() =>
                onChangePreferences({
                  ...preferences,
                  avoidSeedOils: !preferences.avoidSeedOils,
                })
              }
            />
            <ToggleRow
              label="Avoid additives"
              checked={preferences.avoidAdditives}
              onToggle={() =>
                onChangePreferences({
                  ...preferences,
                  avoidAdditives: !preferences.avoidAdditives,
                })
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Dairy
            </label>
            <div className="flex flex-wrap gap-2">
              {(["Allow", "Limit", "Avoid"] as const).map((choice) => (
                <Chip
                  key={choice}
                  active={preferences.dairy === choice}
                  onClick={() =>
                    onChangePreferences({ ...preferences, dairy: choice })
                  }
                >
                  {choice}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Allergies
            </label>
            <div className="flex flex-wrap gap-2">
              {allergyOptions.map((allergy) => {
                const active = preferences.allergies.includes(allergy);
                return (
                  <Chip
                    key={allergy}
                    active={active}
                    onClick={() =>
                      onChangePreferences({
                        ...preferences,
                        allergies: active
                          ? preferences.allergies.filter(
                              (item) => item !== allergy,
                            )
                          : [...preferences.allergies, allergy],
                      })
                    }
                  >
                    {allergy}
                  </Chip>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <Card className="flex gap-3 bg-[#fffdf7] p-4">
        <TriangleAlert className="mt-0.5 h-5 w-5 text-amber-500" />
        <p className="text-sm leading-6 text-muted">
          PURE ai is for education and dietary guidance only. It does not
          provide medical advice, diagnosis, or treatment.
        </p>
      </Card>

      <Button fullWidth disabled={!canContinue} onClick={onContinue}>
        Continue into PURE ai
      </Button>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between rounded-2xl bg-[#f6faf6] px-3 py-3 text-left ring-1 ring-line"
    >
      <span className="pr-2 text-sm text-ink">{label}</span>
      <span
        className={cn(
          "inline-flex h-6 w-11 rounded-full p-1 transition",
          checked ? "bg-accentDeep" : "bg-line",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white transition",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}

function ScanScreen({
  scanMode,
  setScanMode,
  scanView,
  primaryDietName,
  secondaryDietName,
  selectedFollowUp,
  onSelectFollowUp,
  onSimulateFood,
  onSimulateProduct,
  onOpenChat,
}: {
  scanMode: ScanMode;
  setScanMode: (mode: ScanMode) => void;
  scanView: ScanView;
  primaryDietName: string;
  secondaryDietName: string;
  selectedFollowUp: string | null;
  onSelectFollowUp: (value: string) => void;
  onSimulateFood: () => void;
  onSimulateProduct: () => void;
  onOpenChat: () => void;
}) {
  return (
    <div className="space-y-4 pb-4">
      <Card className="overflow-hidden p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {scanModes.map((mode) => (
            <Chip
              key={mode}
              active={scanMode === mode}
              onClick={() => setScanMode(mode)}
            >
              {mode}
            </Chip>
          ))}
        </div>
        <div className="relative rounded-[30px] border border-dashed border-accentDeep/30 bg-[linear-gradient(180deg,#f9fcf7_0%,#edf7ef_100%)] p-5">
          <div className="absolute inset-5 rounded-[24px] border border-accentDeep/20" />
          <div className="relative flex min-h-[260px] flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-surface p-4 text-accentDeep shadow-card">
              <Camera className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-ink">Scan with PURE</h3>
            <p className="mt-2 max-w-[240px] text-sm leading-6 text-muted">
              Simulate camera, barcode, or label capture to preview verdicts
              that match {primaryDietName} and {secondaryDietName}.
            </p>
            <div className="mt-5 grid w-full grid-cols-3 gap-2">
              <Button variant="secondary" className="h-11 px-2 text-xs">
                <Camera className="mr-1 h-3.5 w-3.5" />
                Camera
              </Button>
              <Button variant="ghost" className="h-11 px-2 text-xs">
                <ImageIcon className="mr-1 h-3.5 w-3.5" />
                Gallery
              </Button>
              <Button variant="ghost" className="h-11 px-2 text-xs">
                Manual
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button fullWidth onClick={onSimulateFood}>
          Simulate food scan
        </Button>
        <Button fullWidth variant="secondary" onClick={onSimulateProduct}>
          Simulate product scan
        </Button>
      </div>

      {scanView === "food-result" && (
        <Card className="space-y-4 p-4">
          <div className="flex gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#d9f0df,#f6ead4)] text-center text-xs font-medium text-accentDeep">
              {foodResult.imageLabel}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Food result
              </div>
              <h3 className="mt-1 text-xl font-semibold text-ink">
                {foodResult.name}
              </h3>
              <div className="mt-3 space-y-2 text-sm">
                <DietFit
                  label={primaryDietName}
                  value={foodResult.primaryFit.value}
                />
                <DietFit
                  label={secondaryDietName}
                  value={foodResult.secondaryFit.value}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Metric label="Calories" value={String(foodResult.calories)} />
            <Metric label="Protein" value={foodResult.macros.protein} />
            <Metric label="Fat" value={foodResult.macros.fat} />
            <Metric label="Carbs" value={foodResult.macros.carbs} />
          </div>
          <div className="rounded-[24px] bg-[#f7fbf8] p-4 ring-1 ring-line/80">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Confidence</p>
              <span className="rounded-full bg-tint px-3 py-1 text-xs font-semibold text-accentDeep">
                {foodResult.confidence}
              </span>
            </div>
            <ul className="space-y-2 text-sm text-muted">
              {foodResult.why.map((item) => (
                <li key={item} className="flex gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 text-accentDeep" />{" "}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">
              Optional follow-up
            </p>
            <p className="mb-3 text-xs text-muted">
              {foodResult.followUpPrompt}
            </p>
            <div className="flex flex-wrap gap-2">
              {followUpOptions.map((option) => (
                <Chip
                  key={option}
                  active={selectedFollowUp === option}
                  onClick={() => onSelectFollowUp(option)}
                >
                  {option}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={onOpenChat}>Refine with PURE ai</Button>
            <Button variant="ghost">Save</Button>
          </div>
        </Card>
      )}

      {scanView === "product-result" && (
        <Card className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Product result
              </div>
              <h3 className="mt-1 text-xl font-semibold text-ink">
                {productResult.name}
              </h3>
            </div>
            <CertificationBadge state={productResult.certification} />
          </div>
          <div className="space-y-2 text-sm">
            <DietFit label={primaryDietName} value={productResult.primaryFit} />
            <DietFit
              label={secondaryDietName}
              value={productResult.secondaryFit}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBlock
              title="Ingredients to watch"
              items={productResult.ingredientsToWatch}
            />
            <InfoBlock
              title="Better alternatives"
              items={productResult.betterAlternatives}
              positive
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="ghost">Save</Button>
            <Button variant="secondary">Share</Button>
            <Button variant="ghost">Report incorrect</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function DietFit({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f7fbf8] px-3 py-3 ring-1 ring-line/70">
      <span className="font-medium text-ink">{label}</span>
      <span className="text-xs font-semibold text-accentDeep">{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f7fbf8] px-2 py-3 text-center ring-1 ring-line/70">
      <div className="text-[11px] uppercase tracking-[0.12em] text-muted">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function CertificationBadge({
  state,
}: {
  state: "Certified" | "Under Review" | "Not Certified";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold",
        state === "Certified" && "bg-tint text-accentDeep",
        state === "Under Review" && "bg-amber-100 text-amber-700",
        state === "Not Certified" && "bg-rose-100 text-rose-700",
      )}
    >
      <ShieldCheck className="h-4 w-4" />
      PURE {state}
    </div>
  );
}

function InfoBlock({
  title,
  items,
  positive,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <div className="rounded-[24px] bg-[#f7fbf8] p-4 ring-1 ring-line/70">
      <div className="mb-2 text-sm font-semibold text-ink">{title}</div>
      <ul className="space-y-2 text-sm text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span
              className={cn(
                "mt-1 h-2.5 w-2.5 rounded-full",
                positive ? "bg-accentDeep" : "bg-amber-400",
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatScreen({
  messages,
  selectedReply,
  outcome,
  onSelectReply,
}: {
  messages: ChatMessage[];
  selectedReply: string;
  outcome: { summary: string; guidance: string };
  onSelectReply: (reply: string) => void;
}) {
  return (
    <div className="space-y-4 pb-4">
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              PURE Chat
            </div>
            <h3 className="mt-1 text-xl font-semibold text-ink">
              Contextual follow-up
            </h3>
          </div>
          <div className="rounded-2xl bg-tint px-3 py-2 text-xs font-semibold text-accentDeep">
            Scan linked
          </div>
        </div>
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              key={`${message.text}-${index}`}
              className={cn(
                "flex",
                message.role === "assistant" ? "justify-start" : "justify-end",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-[24px] px-4 py-3 text-sm leading-6",
                  message.role === "assistant"
                    ? "bg-[#f3f7f3] text-ink"
                    : "bg-accentDeep text-white",
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <div className="mb-3 text-sm font-semibold text-ink">Quick replies</div>
        <div className="flex flex-wrap gap-2">
          {chatQuickReplies.map((reply) => (
            <Chip
              key={reply}
              active={selectedReply === reply}
              onClick={() => onSelectReply(reply)}
            >
              {reply}
            </Chip>
          ))}
        </div>
      </Card>
      <Card className="space-y-3 bg-waves p-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Updated verdict
          </div>
          <p className="mt-2 text-lg font-semibold text-ink">
            {outcome.summary}
          </p>
        </div>
        <p className="text-sm leading-6 text-muted">{outcome.guidance}</p>
        <Button variant="secondary">Save guidance</Button>
      </Card>
    </div>
  );
}

function LibraryScreen({
  activeTab,
  setActiveTab,
  items,
}: {
  activeTab: LibraryTab;
  setActiveTab: (tab: LibraryTab) => void;
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
    date: string;
    certification: string | null;
    kind: string;
  }>;
}) {
  return (
    <div className="space-y-4 pb-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Library
        </div>
        <h3 className="mt-1 text-2xl font-semibold text-ink">
          Your PURE records
        </h3>
      </div>
      <div className="flex gap-2">
        {(["History", "Saved", "Certified"] as const).map((tab) => (
          <Chip
            key={tab}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Chip>
        ))}
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="flex items-center gap-3 p-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#dff4e6,#e7eefb)] text-[11px] font-semibold text-accentDeep">
              {item.kind}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink">
                {item.title}
              </div>
              <div className="mt-1 truncate text-xs text-muted">
                {item.subtitle}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
                <span>{item.date}</span>
                {item.certification && (
                  <span className="rounded-full bg-tint px-2 py-1 text-accentDeep">
                    {item.certification}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({
  selectedDiets,
  primaryDiet,
  preferences,
}: {
  selectedDiets: string[];
  primaryDiet: string;
  preferences: PreferenceState;
}) {
  return (
    <div className="space-y-4 pb-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Profile
        </div>
        <h3 className="mt-1 text-2xl font-semibold text-ink">PURE settings</h3>
      </div>
      <Card className="space-y-3 p-4">
        <div className="text-sm font-semibold text-ink">Selected diets</div>
        {selectedDiets.map((diet) => (
          <div
            key={diet}
            className="flex items-center justify-between rounded-2xl bg-[#f7fbf8] px-3 py-3 ring-1 ring-line/70"
          >
            <span className="text-sm text-ink">{diet}</span>
            {diet === primaryDiet && (
              <span className="rounded-full bg-accentDeep px-2 py-1 text-[10px] font-semibold text-white">
                Primary
              </span>
            )}
          </div>
        ))}
      </Card>
      <Card className="space-y-3 p-4">
        <div className="text-sm font-semibold text-ink">Preferences</div>
        <ProfileRow label="Strictness" value={preferences.strictness} />
        <ProfileRow
          label="Seed oils"
          value={preferences.avoidSeedOils ? "Avoid" : "Allowed"}
        />
        <ProfileRow
          label="Additives"
          value={preferences.avoidAdditives ? "Avoid" : "Allowed"}
        />
        <ProfileRow label="Dairy" value={preferences.dairy} />
        <ProfileRow
          label="Allergies"
          value={preferences.allergies.join(", ") || "None"}
        />
      </Card>
      <Card className="space-y-3 p-4">
        <ProfileRow label="Units" value="US customary" />
        <ProfileRow label="Privacy controls" value="On-device prototype only" />
        <ProfileRow
          label="Confidence explainer"
          value="How PURE weighs ingredients and context"
        />
        <ProfileRow label="Support" value="support@pure-ai.demo" />
      </Card>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f7fbf8] px-3 py-3 text-sm ring-1 ring-line/70">
      <span className="text-muted">{label}</span>
      <span className="max-w-[55%] text-right font-medium text-ink">
        {value}
      </span>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  Camera,
  ChevronRight,
  Compass,
  Database,
  Droplets,
  ImageIcon,
  Library,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserRound,
  Utensils,
} from "lucide-react";
import { BottomNav, type AppTab } from "@/components/bottom-nav";
import { MobileShell } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import {
  chatOutcomes,
  chatQuickReplies,
  chatSeeds,
  defaultPreferences,
  dietKnowledge,
  dietQuizQuestions,
  dietQuizRecommendations,
  foodResult,
  followUpOptions,
  historyItems,
  productResult,
  savedItems,
  scanModes,
  type DietKnowledge,
  type PreferenceState,
  type ScanMode,
} from "@/data/mock-data";
import { cn } from "@/lib/utils";

type ScanView = "idle" | "food-result" | "product-result";
type LibraryTab = "History" | "Saved" | "Certified";
type HomeView =
  | "main"
  | "scan"
  | "library"
  | "explore"
  | "diet-detail"
  | "diet-quiz"
  | "recipes"
  | "database";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const OCEAN_VIDEO_URL =
  "https://cdn.coverr.co/videos/coverr-aerial-view-of-ocean-waves-1579/1080p.mp4";

export function PureApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>("Scan Food");
  const [homeView, setHomeView] = useState<HomeView>("main");
  const [focusDietId, setFocusDietId] = useState<string>("keto");

  const [selectedDiets, setSelectedDiets] = useState<string[]>([
    "carnivore",
    "keto",
  ]);
  const [primaryDiet, setPrimaryDiet] = useState<string>("carnivore");
  const [preferences] = useState<PreferenceState>(defaultPreferences);

  const [scanMode, setScanMode] = useState<ScanMode>("Food");
  const [scanView, setScanView] = useState<ScanView>("idle");
  const [selectedFollowUp, setSelectedFollowUp] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(chatSeeds);
  const [selectedChatReply, setSelectedChatReply] = useState<string>(
    "It was butter basted",
  );

  const [libraryTab, setLibraryTab] = useState<LibraryTab>("History");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const popularDiets = dietKnowledge.filter(
    (diet) => diet.category === "Popular",
  );
  const exploreDiets = dietKnowledge.filter(
    (diet) => diet.category === "Explore",
  );

  const primaryDietName =
    dietKnowledge.find((diet) => diet.id === primaryDiet)?.name ?? "Primary";
  const secondaryDietId =
    selectedDiets.find((diet) => diet !== primaryDiet) ?? selectedDiets[0];
  const secondaryDietName =
    dietKnowledge.find((diet) => diet.id === secondaryDietId)?.name ??
    "No secondary diet";

  const currentChatOutcome = chatOutcomes[selectedChatReply];

  const libraryItems = useMemo(() => {
    if (libraryTab === "Saved") return savedItems;
    if (libraryTab === "Certified") {
      return historyItems.filter((item) => item.certification);
    }
    return historyItems;
  }, [libraryTab]);

  const quizRecommendation = useMemo(() => {
    const selected = Object.values(quizAnswers);
    if (selected.length < 2) return null;

    const score = new Map<string, number>();
    selected.forEach((answer) => {
      const mappedDiet = dietQuizRecommendations[answer];
      if (!mappedDiet) return;
      score.set(mappedDiet, (score.get(mappedDiet) ?? 0) + 1);
    });

    let bestDiet = "mediterranean";
    let bestScore = -1;
    for (const [dietId, value] of score.entries()) {
      if (value > bestScore) {
        bestScore = value;
        bestDiet = dietId;
      }
    }

    return dietKnowledge.find((diet) => diet.id === bestDiet) ?? null;
  }, [quizAnswers]);

  const applyChatReply = (reply: string) => {
    setSelectedChatReply(reply);
    setChatMessages([
      ...chatSeeds,
      { role: "user", text: reply },
      { role: "assistant", text: chatOutcomes[reply].summary },
      { role: "assistant", text: chatOutcomes[reply].guidance },
    ]);
  };

  const openDietDetail = (dietId: string) => {
    setFocusDietId(dietId);
    setHomeView("diet-detail");
  };

  const mainButtons = [
    { label: "Scan food", icon: ScanLine, action: () => setHomeView("scan") },
    {
      label: "Profile",
      icon: UserRound,
      action: () => setActiveTab("Profile"),
    },
    { label: "Library", icon: Library, action: () => setHomeView("library") },
    { label: "Explore", icon: Compass, action: () => setHomeView("explore") },
    { label: "Recipes", icon: Utensils, action: () => setHomeView("recipes") },
    {
      label: "AI Chat",
      icon: Sparkles,
      action: () => setActiveTab("AI Agent"),
    },
    {
      label: "Database",
      icon: Database,
      action: () => setHomeView("database"),
    },
    { label: "Diets", icon: Bot, action: () => setHomeView("diet-quiz") },
  ];

  return (
    <MobileShell>
      {showSplash ? (
        <LaunchSplash />
      ) : (
        <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <Header
              primaryDiet={primaryDietName}
              secondaryDiet={secondaryDietName}
            />

            {activeTab === "Scan Food" && homeView === "main" && (
              <MainDashboard
                userName="Rashid"
                mainButtons={mainButtons}
                popularDiets={popularDiets}
                onOpenDiet={openDietDetail}
              />
            )}

            {activeTab === "Scan Food" && homeView === "scan" && (
              <ScanScreen
                scanMode={scanMode}
                setScanMode={setScanMode}
                scanView={scanView}
                primaryDietName={primaryDietName}
                secondaryDietName={secondaryDietName}
                selectedFollowUp={selectedFollowUp}
                onSelectFollowUp={setSelectedFollowUp}
                onSimulateFood={() => setScanView("food-result")}
                onSimulateProduct={() => setScanView("product-result")}
                onOpenChat={() => setActiveTab("AI Agent")}
                onBack={() => setHomeView("main")}
              />
            )}

            {activeTab === "Scan Food" && homeView === "library" && (
              <LibraryScreen
                onBack={() => setHomeView("main")}
                activeTab={libraryTab}
                setActiveTab={setLibraryTab}
                items={libraryItems}
              />
            )}

            {activeTab === "Scan Food" && homeView === "explore" && (
              <DietExploreScreen
                diets={exploreDiets}
                onBack={() => setHomeView("main")}
                onOpenDiet={openDietDetail}
              />
            )}

            {activeTab === "Scan Food" && homeView === "diet-detail" && (
              <DietDetailScreen
                diet={dietKnowledge.find((diet) => diet.id === focusDietId)}
                onBack={() => setHomeView("main")}
              />
            )}

            {activeTab === "Scan Food" && homeView === "diet-quiz" && (
              <DietQuizScreen
                answers={quizAnswers}
                recommendation={quizRecommendation}
                onBack={() => setHomeView("main")}
                onAnswer={(questionId, answer) =>
                  setQuizAnswers((current) => ({
                    ...current,
                    [questionId]: answer,
                  }))
                }
                onUseRecommendation={(dietId) => {
                  if (
                    !selectedDiets.includes(dietId) &&
                    selectedDiets.length < 2
                  ) {
                    setSelectedDiets((current) => [...current, dietId]);
                  }
                  setPrimaryDiet(dietId);
                  openDietDetail(dietId);
                }}
              />
            )}

            {activeTab === "Scan Food" && homeView === "recipes" && (
              <RecipesScreen onBack={() => setHomeView("main")} />
            )}

            {activeTab === "Scan Food" && homeView === "database" && (
              <DatabaseScreen onBack={() => setHomeView("main")} />
            )}

            {activeTab === "AI Agent" && (
              <ChatScreen
                messages={chatMessages}
                selectedReply={selectedChatReply}
                outcome={currentChatOutcome}
                onSelectReply={applyChatReply}
              />
            )}

            {activeTab === "Profile" && (
              <ProfileScreen
                selectedDiets={selectedDiets.map(
                  (id) =>
                    dietKnowledge.find((diet) => diet.id === id)?.name ?? id,
                )}
                primaryDiet={primaryDietName}
                preferences={preferences}
              />
            )}

            {activeTab === "Settings" && <SettingsScreen />}
          </div>

          <BottomNav
            active={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              if (tab === "Scan Food") setHomeView("main");
            }}
          />
        </div>
      )}
    </MobileShell>
  );
}

function LaunchSplash() {
  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f7faff_0%,#deebff_100%)] px-8 text-center">
      <div className="absolute -left-24 top-20 h-48 w-48 rounded-full bg-[#7da8e8]/30 blur-3xl" />
      <div className="absolute -right-20 bottom-24 h-56 w-56 rounded-full bg-[#5d8fd9]/25 blur-3xl" />
      <div className="relative mb-8 h-24 w-24 animate-floatGlow rounded-[30px] bg-white/85 shadow-card ring-1 ring-line/80">
        <div className="absolute inset-0 flex items-center justify-center text-accentDeep">
          <Droplets className="h-10 w-10" />
        </div>
      </div>
      <div className="animate-pulseIn">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.38em] text-accentDeep">
          PURE ai
        </p>
        <h1 className="text-6xl font-semibold tracking-[-0.06em] text-accentDeep">
          PURE
        </h1>
      </div>
    </div>
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
    <div className="mb-5 rounded-[30px] bg-[#f4f8ff] px-4 pb-4 pt-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-accentDeep">
            PURE ai
          </p>
          <h1 className="text-[28px] font-semibold leading-tight text-ink">
            Apple-like blue intelligence.
          </h1>
        </div>
        <div className="rounded-2xl bg-tint px-3 py-2 text-right text-[11px] text-accentDeep">
          <div>Primary</div>
          <div className="font-semibold">{primaryDiet}</div>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl ring-1 ring-line/70">
        <div className="relative h-24 w-full">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src={OCEAN_VIDEO_URL} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,36,63,0.72),rgba(16,36,63,0.34))]" />
          <div className="absolute inset-0 flex items-end justify-between p-3 text-white">
            <p className="max-w-[70%] text-xs leading-5">
              Current stack: {primaryDiet} + {secondaryDiet}. Main page tools
              are one tap away.
            </p>
            <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold backdrop-blur">
              Ocean mode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainDashboard({
  userName,
  mainButtons,
  popularDiets,
  onOpenDiet,
}: {
  userName: string;
  mainButtons: Array<{
    label: string;
    icon: React.ElementType;
    action: () => void;
  }>;
  popularDiets: DietKnowledge[];
  onOpenDiet: (dietId: string) => void;
}) {
  return (
    <div className="space-y-4 pb-4">
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-full bg-tint p-2 text-accentDeep">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Profile bar
            </p>
            <p className="text-sm font-semibold text-ink">
              @{userName.toLowerCase()} · PURE Prime
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold text-ink">Main tools</h3>
        <div className="grid grid-cols-4 gap-2">
          {mainButtons.map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              onClick={action}
              className="rounded-2xl bg-[#edf4ff] p-3 text-center ring-1 ring-line transition hover:bg-[#e4eeff]"
            >
              <Icon className="mx-auto h-4 w-4 text-accentDeep" />
              <div className="mt-2 text-[11px] font-medium text-ink">
                {label}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Popular diets</h3>
          <span className="text-xs font-semibold text-accentDeep">
            See more
          </span>
        </div>
        <div className="space-y-2">
          {popularDiets.map((diet) => (
            <button
              key={diet.id}
              onClick={() => onOpenDiet(diet.id)}
              className="w-full rounded-2xl bg-[#f4f8ff] px-3 py-3 text-left ring-1 ring-line"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">{diet.name}</span>
                <ChevronRight className="h-4 w-4 text-accentDeep" />
              </div>
              <p className="mt-1 text-xs text-muted">{diet.summary}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DietExploreScreen({
  diets,
  onBack,
  onOpenDiet,
}: {
  diets: DietKnowledge[];
  onBack: () => void;
  onOpenDiet: (dietId: string) => void;
}) {
  return (
    <div className="space-y-4 pb-4">
      <BackButton onBack={onBack} />
      {diets.map((diet) => (
        <Card key={diet.id} className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">{diet.name}</h3>
            <button
              onClick={() => onOpenDiet(diet.id)}
              className="text-xs font-semibold text-accentDeep"
            >
              See more
            </button>
          </div>
          <p className="mt-2 text-sm text-muted">{diet.summary}</p>
        </Card>
      ))}
    </div>
  );
}

function DietDetailScreen({
  diet,
  onBack,
}: {
  diet?: DietKnowledge;
  onBack: () => void;
}) {
  if (!diet) return null;

  return (
    <div className="space-y-4 pb-4">
      <BackButton onBack={onBack} />
      <Card className="space-y-3 p-4">
        <h3 className="text-2xl font-semibold text-ink">{diet.name}</h3>
        <p className="text-sm text-muted">{diet.summary}</p>
        <div className="flex flex-wrap gap-2">
          {diet.bestFor.map((item) => (
            <Chip key={item} active>
              {item}
            </Chip>
          ))}
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <p className="text-sm font-semibold text-ink">Ask AI</p>
        {diet.aiTips.map((tip) => (
          <div
            key={tip}
            className="rounded-2xl bg-[#f4f8ff] px-3 py-2 text-sm text-muted ring-1 ring-line"
          >
            {tip}
          </div>
        ))}
      </Card>
    </div>
  );
}

function DietQuizScreen({
  answers,
  recommendation,
  onBack,
  onAnswer,
  onUseRecommendation,
}: {
  answers: Record<string, string>;
  recommendation: DietKnowledge | null;
  onBack: () => void;
  onAnswer: (questionId: string, answer: string) => void;
  onUseRecommendation: (dietId: string) => void;
}) {
  return (
    <div className="space-y-4 pb-4">
      <BackButton onBack={onBack} />
      <Card className="p-4">
        <h3 className="text-xl font-semibold text-ink">
          I&apos;m not sure → AI finder
        </h3>
        <p className="mt-1 text-sm text-muted">
          Answer 2 to 4 questions and PURE will determine the most suitable
          diet.
        </p>
      </Card>
      {dietQuizQuestions.map((question) => (
        <Card key={question.id} className="space-y-3 p-4">
          <p className="text-sm font-semibold text-ink">{question.question}</p>
          <div className="flex flex-wrap gap-2">
            {question.options.map((option) => (
              <Chip
                key={option}
                active={answers[question.id] === option}
                onClick={() => onAnswer(question.id, option)}
              >
                {option}
              </Chip>
            ))}
          </div>
        </Card>
      ))}
      {recommendation && (
        <Card className="space-y-3 bg-waves p-4">
          <p className="text-sm font-semibold text-ink">AI recommendation</p>
          <h4 className="text-xl font-semibold text-accentDeep">
            {recommendation.name}
          </h4>
          <p className="text-sm text-muted">{recommendation.summary}</p>
          <Button
            fullWidth
            onClick={() => onUseRecommendation(recommendation.id)}
          >
            Use this diet
          </Button>
        </Card>
      )}
    </div>
  );
}

function RecipesScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4 pb-4">
      <BackButton onBack={onBack} />
      <Card className="space-y-3 p-4">
        <h3 className="text-xl font-semibold text-ink">PURE recipes</h3>
        <p className="text-sm text-muted">
          Recipe engine placeholder with diet-matched recipe packs.
        </p>
      </Card>
    </div>
  );
}

function DatabaseScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4 pb-4">
      <BackButton onBack={onBack} />
      <Card className="space-y-3 p-4">
        <h3 className="text-xl font-semibold text-ink">PURE database</h3>
        <p className="text-sm text-muted">
          Database placeholder for certified products and ingredient
          intelligence.
        </p>
      </Card>
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="inline-flex items-center gap-1 text-sm font-semibold text-accentDeep"
    >
      <ArrowLeft className="h-4 w-4" /> Back
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
  onBack,
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
  onBack: () => void;
}) {
  return (
    <div className="space-y-4 pb-4">
      <BackButton onBack={onBack} />
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
        <div className="relative rounded-[30px] border border-dashed border-accentDeep/30 bg-[linear-gradient(180deg,#f7faff_0%,#eaf2ff_100%)] p-5">
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
            <div className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#dce9ff,#e6f2ff)] text-center text-xs font-medium text-accentDeep">
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
          <div className="rounded-[24px] bg-[#f4f8ff] p-4 ring-1 ring-line/80">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Confidence</p>
              <span className="rounded-full bg-tint px-3 py-1 text-xs font-semibold text-accentDeep">
                {foodResult.confidence}
              </span>
            </div>
            <ul className="space-y-2 text-sm text-muted">
              {foodResult.why.map((item) => (
                <li key={item} className="flex gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 text-accentDeep" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
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
    <div className="flex items-center justify-between rounded-2xl bg-[#f7fbff] px-3 py-3 ring-1 ring-line/70">
      <span className="font-medium text-ink">{label}</span>
      <span className="text-xs font-semibold text-accentDeep">{value}</span>
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
        <h3 className="mb-3 text-xl font-semibold text-ink">AI Agent</h3>
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
                    ? "bg-[#edf4ff] text-ink"
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
        <p className="text-lg font-semibold text-ink">{outcome.summary}</p>
        <p className="text-sm leading-6 text-muted">{outcome.guidance}</p>
      </Card>
    </div>
  );
}

function LibraryScreen({
  onBack,
  activeTab,
  setActiveTab,
  items,
}: {
  onBack: () => void;
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
      <BackButton onBack={onBack} />
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
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#dce9ff,#e6f2ff)] text-[11px] font-semibold text-accentDeep">
              {item.kind}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink">
                {item.title}
              </div>
              <div className="mt-1 truncate text-xs text-muted">
                {item.subtitle}
              </div>
              <div className="mt-2 text-[11px] text-muted">{item.date}</div>
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
      <Card className="space-y-3 p-4">
        <div className="text-sm font-semibold text-ink">Selected diets</div>
        {selectedDiets.map((diet) => (
          <div
            key={diet}
            className="flex items-center justify-between rounded-2xl bg-[#f4f8ff] px-3 py-3 ring-1 ring-line/70"
          >
            <span className="text-sm text-ink">{diet}</span>
            {diet === primaryDiet && (
              <span className="rounded-full bg-accentDeep px-2 py-1 text-[10px] font-semibold text-white">
                Primary
              </span>
            )}
          </div>
        ))}
        <div className="rounded-2xl bg-[#f4f8ff] px-3 py-3 text-sm ring-1 ring-line/70">
          Strictness: {preferences.strictness}
        </div>
      </Card>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="space-y-4 pb-4">
      <Card className="space-y-3 p-4">
        <h3 className="text-xl font-semibold text-ink">Settings</h3>
        <div className="rounded-2xl bg-[#f4f8ff] px-3 py-3 text-sm text-muted ring-1 ring-line/70">
          Privacy controls
        </div>
        <div className="rounded-2xl bg-[#f4f8ff] px-3 py-3 text-sm text-muted ring-1 ring-line/70">
          Notifications
        </div>
        <div className="rounded-2xl bg-[#f4f8ff] px-3 py-3 text-sm text-muted ring-1 ring-line/70">
          Support
        </div>
      </Card>
    </div>
  );
}

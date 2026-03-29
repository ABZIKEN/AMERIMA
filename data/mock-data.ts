export type DietOption = {
  id: string;
  name: string;
  blurb: string;
};

export type PreferenceState = {
  strictness: "Balanced" | "Strict" | "Very strict";
  avoidSeedOils: boolean;
  avoidAdditives: boolean;
  dairy: "Allow" | "Limit" | "Avoid";
  allergies: string[];
};

export type ScanMode = "Food" | "Barcode" | "Label";

export const dietOptions: DietOption[] = [
  {
    id: "carnivore",
    name: "Carnivore",
    blurb: "Animal-based with very low plant intake.",
  },
  { id: "keto", name: "Keto", blurb: "Very low carb and high fat." },
  { id: "vegan", name: "Vegan", blurb: "No animal-derived foods." },
  {
    id: "mediterranean",
    name: "Mediterranean",
    blurb: "Whole foods with fish, produce, and olive oil.",
  },
  {
    id: "paleo",
    name: "Paleo",
    blurb: "Prioritizes minimally processed ancestral foods.",
  },
  {
    id: "low-fodmap",
    name: "Low FODMAP",
    blurb: "Reduces fermentable carbs to limit gut triggers.",
  },
  {
    id: "custom",
    name: "Custom",
    blurb: "Bring your own rules and preferences.",
  },
];

export const allergyOptions = [
  "Gluten",
  "Egg",
  "Peanut",
  "Tree nut",
  "Soy",
  "Shellfish",
];

export const defaultPreferences: PreferenceState = {
  strictness: "Strict",
  avoidSeedOils: true,
  avoidAdditives: true,
  dairy: "Limit",
  allergies: ["Gluten"],
};

export const followUpOptions = [
  "Cooked in butter",
  "Cooked in seed oil",
  "Had sauce",
  "Breaded",
  "I don't know",
];

export const scanModes: ScanMode[] = ["Food", "Barcode", "Label"];

export const foodResult = {
  name: "Grass-fed ribeye bowl",
  imageLabel: "Ribeye bowl preview",
  primaryFit: { label: "Carnivore", value: "Excellent fit", tone: "emerald" },
  secondaryFit: { label: "Keto", value: "Strong fit", tone: "lime" },
  calories: 540,
  macros: { protein: "42g", fat: "38g", carbs: "6g" },
  confidence: "92%",
  why: [
    "High protein with low net carbs.",
    "Ingredients appear minimally processed.",
    "No obvious grain-based fillers detected.",
  ],
  followUpPrompt: "A few details can sharpen the verdict.",
};

export const productResult = {
  name: "PURE Avocado Oil Chips",
  certification: "Certified" as "Certified" | "Under Review" | "Not Certified",
  primaryFit: "Moderate fit for Carnivore",
  secondaryFit: "Good fit for Keto",
  ingredientsToWatch: ["Tapioca starch", "Sea salt blend"],
  betterAlternatives: ["Beef tallow crisps", "Pure pork rinds"],
};

export const historyItems = [
  {
    id: "h1",
    title: "Grass-fed ribeye bowl",
    subtitle: "Excellent fit · Carnivore",
    date: "Mar 22",
    certification: null,
    kind: "History",
  },
  {
    id: "h2",
    title: "PURE Avocado Oil Chips",
    subtitle: "Certified · Keto-friendly",
    date: "Mar 21",
    certification: "Certified",
    kind: "History",
  },
];

export const savedItems = [
  {
    id: "s1",
    title: "Butter basted steak",
    subtitle: "Saved verdict · Carnivore",
    date: "Mar 19",
    certification: null,
    kind: "Saved",
  },
  {
    id: "s2",
    title: "Greek yogurt cup",
    subtitle: "Limit dairy · Keto",
    date: "Mar 17",
    certification: "Under Review",
    kind: "Saved",
  },
];

export const certifiedItems = [
  {
    id: "c1",
    title: "PURE Olive Tapenade",
    subtitle: "Certified · Mediterranean",
    date: "Mar 14",
    certification: "Certified",
    kind: "Certified",
  },
  {
    id: "c2",
    title: "PURE Turkey Bites",
    subtitle: "Under Review · Carnivore",
    date: "Mar 13",
    certification: "Under Review",
    kind: "Certified",
  },
];

export const chatSeeds = [
  {
    role: "assistant" as const,
    text: "I scanned steak. You are on Carnivore and Keto. Want to refine the verdict?",
  },
  {
    role: "user" as const,
    text: "Yes, help me refine it.",
  },
  {
    role: "assistant" as const,
    text: "Tap a quick reply and I will update the verdict card.",
  },
];

export const chatQuickReplies = [
  "It was butter basted",
  "There was a sugary glaze",
  "It came with fries",
];

export const chatOutcomes: Record<
  string,
  { summary: string; guidance: string }
> = {
  "It was butter basted": {
    summary:
      "Updated verdict: excellent for Carnivore and still very strong for Keto.",
    guidance:
      "Keep the sides simple and watch hidden sauces if you want the cleanest outcome.",
  },
  "There was a sugary glaze": {
    summary:
      "Updated verdict: still acceptable for Keto in moderation, but less ideal for Carnivore.",
    guidance:
      "Ask for the glaze on the side next time to reduce sugar and keep confidence high.",
  },
  "It came with fries": {
    summary:
      "Updated verdict: steak remains a strong base, but the full plate no longer fits Keto well.",
    guidance:
      "Swap fries for vegetables, eggs, or extra meat to stay aligned with both diets.",
  },
};

export type DietKnowledge = {
  id: string;
  name: string;
  category: "Popular" | "Explore";
  summary: string;
  bestFor: string[];
  avoid: string[];
  aiTips: string[];
};

export const dietKnowledge: DietKnowledge[] = [
  {
    id: "keto",
    name: "Keto",
    category: "Popular",
    summary:
      "Very low-carb strategy focused on fats and metabolic flexibility.",
    bestFor: [
      "Lower carb goals",
      "Steadier blood sugar",
      "Simple meal planning",
    ],
    avoid: ["Sugary sauces", "Refined grains", "High-sugar drinks"],
    aiTips: [
      "Track hidden carbs in sauces and marinades.",
      "Prioritize protein first, then add clean fats.",
      "Use electrolytes if you feel low energy early on.",
    ],
  },
  {
    id: "carnivore",
    name: "Carnivore",
    category: "Popular",
    summary: "Animal-forward eating pattern prioritizing meat, eggs, and fish.",
    bestFor: ["High satiety", "Simple choices", "Very low carb routine"],
    avoid: ["Seed oils", "Breaded coatings", "Added sugars"],
    aiTips: [
      "Choose minimally processed cuts and organ blends.",
      "Rotate beef, fish, and eggs for micronutrient spread.",
      "Start strict, then reintroduce foods intentionally.",
    ],
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    category: "Popular",
    summary:
      "Whole-food style built around fish, olive oil, produce, and legumes.",
    bestFor: [
      "Heart-friendly habits",
      "Balanced meals",
      "Long-term sustainability",
    ],
    avoid: ["Ultra-processed snacks", "Sugary desserts", "Refined oils"],
    aiTips: [
      "Build meals from protein + produce + healthy fat.",
      "Use olive oil as the default cooking fat.",
      "Favor whole grains over refined options.",
    ],
  },
  {
    id: "paleo",
    name: "Paleo",
    category: "Explore",
    summary:
      "Focuses on minimally processed foods and excludes modern refined items.",
    bestFor: [
      "Whole-food reset",
      "Cleaner ingredients",
      "Simple grocery filtering",
    ],
    avoid: ["Refined sugar", "Industrial oils", "Processed grains"],
    aiTips: [
      "Read labels and avoid long additive lists.",
      "Batch-cook protein and roasted vegetables.",
      "Use fruit for sweetness instead of packaged snacks.",
    ],
  },
  {
    id: "vegan",
    name: "Vegan",
    category: "Explore",
    summary:
      "Plant-only pattern focused on legumes, vegetables, grains, nuts, and seeds.",
    bestFor: ["Ethical food choices", "High-fiber intake", "Plant diversity"],
    avoid: [
      "Ultra-processed vegan snacks",
      "Low-protein meals",
      "Hidden additives",
    ],
    aiTips: [
      "Anchor each meal with a protein source.",
      "Check B12, iron, and omega-3 coverage.",
      "Use minimally processed products when possible.",
    ],
  },
  {
    id: "low-fodmap",
    name: "Low FODMAP",
    category: "Explore",
    summary: "Structured short-term protocol for reducing digestive triggers.",
    bestFor: [
      "Gut symptom investigation",
      "Trigger discovery",
      "Structured elimination",
    ],
    avoid: [
      "Large onion/garlic loads",
      "High-fructose sweeteners",
      "Untracked ingredients",
    ],
    aiTips: [
      "Use elimination, then reintroduction in phases.",
      "Keep a symptom + meal log for pattern spotting.",
      "Work with a clinician for long-term personalization.",
    ],
  },
  {
    id: "high-protein",
    name: "High Protein",
    category: "Explore",
    summary:
      "Protein-prioritized pattern for satiety, body composition, and recovery.",
    bestFor: ["Strength training", "Body recomposition", "Appetite control"],
    avoid: ["Low-protein snacks", "Liquid calories", "Excess sugary drinks"],
    aiTips: [
      "Target protein at each meal first.",
      "Pair protein with fiber for longer satiety.",
      "Use quick options like yogurt, eggs, and lean meats.",
    ],
  },
];

export const dietQuizQuestions = [
  {
    id: "q1",
    question: "Which goal sounds closest to you right now?",
    options: [
      "Fat loss with stable energy",
      "Digestive comfort",
      "Performance and strength",
      "I want a balanced lifestyle",
    ],
  },
  {
    id: "q2",
    question: "How do you feel about limiting carbs?",
    options: [
      "I am comfortable going low-carb",
      "Moderate carbs are best",
      "I prefer carb-inclusive eating",
      "Not sure yet",
    ],
  },
  {
    id: "q3",
    question: "What type of meals feels most realistic for your routine?",
    options: [
      "Simple meat/fish-based meals",
      "Plant-forward bowls and legumes",
      "Mixed whole-food plates",
      "Structured elimination to test triggers",
    ],
  },
  {
    id: "q4",
    question: "How strict do you want your plan to be in the first month?",
    options: [
      "Very strict",
      "Moderately strict",
      "Flexible",
      "I need AI guidance first",
    ],
  },
];

export const dietQuizRecommendations: Record<string, string> = {
  "Fat loss with stable energy": "keto",
  "Digestive comfort": "low-fodmap",
  "Performance and strength": "high-protein",
  "I want a balanced lifestyle": "mediterranean",
  "I am comfortable going low-carb": "keto",
  "Moderate carbs are best": "mediterranean",
  "I prefer carb-inclusive eating": "vegan",
  "Not sure yet": "mediterranean",
  "Simple meat/fish-based meals": "carnivore",
  "Plant-forward bowls and legumes": "vegan",
  "Mixed whole-food plates": "mediterranean",
  "Structured elimination to test triggers": "low-fodmap",
  "Very strict": "carnivore",
  "Moderately strict": "keto",
  Flexible: "mediterranean",
  "I need AI guidance first": "high-protein",
};

export type DatabaseArticle = {
  id: string;
  title: string;
  source: "PURE AI Official" | "PURE AI Research";
  summary: string;
  readTime: string;
};

export type FeedPost = {
  id: string;
  author: string;
  topic: string;
  body: string;
  likes: number;
  comments: number;
};

export const databaseArticles: DatabaseArticle[] = [
  {
    id: "a1",
    title: "PURE Certified Framework 2026",
    source: "PURE AI Official",
    summary:
      "How PURE scores ingredient quality, processing risk, and diet compatibility for labels and products.",
    readTime: "4 min",
  },
  {
    id: "a2",
    title: "Understanding Confidence in Food Verdicts",
    source: "PURE AI Official",
    summary:
      "A practical explainer of confidence percentages and what inputs can increase verdict reliability.",
    readTime: "5 min",
  },
  {
    id: "a3",
    title: "AI Nutrition Signals for Personalized Diet Fit",
    source: "PURE AI Research",
    summary:
      "How meal context, ingredient patterns, and follow-up answers improve personalization quality.",
    readTime: "6 min",
  },
  {
    id: "a4",
    title: "Why Processing Level Matters More Than Calories Alone",
    source: "PURE AI Research",
    summary:
      "A research brief on additive density, oxidation risk, and the role of preparation methods.",
    readTime: "7 min",
  },
];

export const communityFeed: FeedPost[] = [
  {
    id: "f1",
    author: "Rashid K.",
    topic: "Carnivore diet progress",
    body: "Week 6 on carnivore: better satiety and fewer cravings. Curious how others handle electrolytes and training days.",
    likes: 28,
    comments: 14,
  },
  {
    id: "f2",
    author: "Lena M.",
    topic: "Are nonstick pans harmful?",
    body: "I replaced old scratched nonstick pans and felt better about cooking safety. What cookware do you trust most?",
    likes: 42,
    comments: 26,
  },
];

export type CertifiedCompany = {
  id: string;
  name: string;
  badge: string;
  note: string;
};

export const certifiedCompanies: CertifiedCompany[] = [
  {
    id: "ocean-basket",
    name: "Ocean Basket",
    badge: "OB",
    note: "Seafood-forward menu with cleaner oil and ingredient standards.",
  },
  {
    id: "la-creme",
    name: "La Crème Boutique",
    badge: "LC",
    note: "Dairy-focused products with transparent sourcing and additive checks.",
  },
  {
    id: "faro",
    name: "FARO",
    badge: "FR",
    note: "Certified kitchen process and label verification for menu consistency.",
  },
  {
    id: "discovery-coffee",
    name: "Discovery Coffee",
    badge: "DC",
    note: "Coffee and snacks reviewed for sweetener quality and ingredient purity.",
  },
];

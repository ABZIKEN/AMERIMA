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

import { NextRequest, NextResponse } from "next/server";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_SCAN_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

type ScanResponse = {
  output_text?: string;
  error?: { message?: string };
};

const FALLBACK_SCAN = {
  title: "Unknown item",
  summary: "Could not confidently identify the food from this image.",
  likelyItems: [],
  nutrients: {
    calories: "unknown",
    protein: "unknown",
    fats: "unknown",
    carbs: "unknown",
    vitamins: [] as string[],
    minerals: [] as string[],
  },
  confidence: "Low",
  followUpPrompts: [
    "Retake photo in brighter light",
    "Capture nutrition label for higher accuracy",
  ],
};

function parseScanJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const matched = text.match(/\{[\s\S]*\}/);
    if (!matched) return null;
    try {
      return JSON.parse(matched[0]);
    } catch {
      return null;
    }
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_SCAN_MODEL ?? DEFAULT_SCAN_MODEL;

  if (!apiKey) {
    return NextResponse.json(
      { answer: "AI scan is not configured. Set OPENAI_API_KEY." },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const imageBase64 = String(body?.imageBase64 ?? "").trim();
    const context = body?.context ?? {};

    if (!imageBase64) {
      return NextResponse.json(
        { answer: "Image is required for AI scan." },
        { status: 400 },
      );
    }

    const instructions = [
      "You are PURE AI vision nutrition assistant.",
      "Identify what food/product is likely present in the image.",
      "Estimate nutrients with clear uncertainty language. Never claim exactness.",
      "Return ONLY valid JSON in this exact shape:",
      '{"title":"", "summary":"", "likelyItems":[], "nutrients":{"calories":"","protein":"","fats":"","carbs":"","vitamins":[],"minerals":[]}, "confidence":"Low|Medium|High", "followUpPrompts":[] }',
      `Prioritize this user request: ${context.focus ?? "overview"}.`,
      `Primary diet: ${context.primaryDiet ?? "not set"}. Secondary diet: ${context.secondaryDiet ?? "not set"}.`,
    ].join(" ");

    const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;

    const openaiRes = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: instructions },
              {
                type: "input_image",
                image_url: imageDataUrl,
              },
            ],
          },
        ],
      }),
      cache: "no-store",
    });

    const payload = (await openaiRes.json()) as ScanResponse;

    if (!openaiRes.ok) {
      return NextResponse.json(
        {
          answer:
            payload.error?.message ?? "PURE AI scan is temporarily unavailable.",
        },
        { status: openaiRes.status },
      );
    }

    const parsed = parseScanJson(payload.output_text ?? "") ?? FALLBACK_SCAN;
    return NextResponse.json({ scanResult: parsed });
  } catch {
    return NextResponse.json(
      { answer: "Network issue while running AI scan." },
      { status: 500 },
    );
  }
}

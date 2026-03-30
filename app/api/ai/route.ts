import { NextRequest, NextResponse } from "next/server";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "pmpt_69ca06e27b848193a5b7bb81cdf8faac023d0663a75aefbe";

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

function extractOutputText(payload: OpenAIResponse): string {
  if (payload.output_text?.trim()) {
    return payload.output_text.trim();
  }

  const contentText =
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .filter((entry) => entry.type === "output_text" && entry.text)
      .map((entry) => entry.text?.trim())
      .filter(Boolean)
      .join("\n\n") ?? "";

  return contentText.trim();
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    return NextResponse.json(
      {
        answer:
          "AI is not configured yet. Set OPENAI_API_KEY in your environment.",
      },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const message = String(body?.message ?? "").trim();
    const context = body?.context ?? {};

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const systemInstructions = [
      "You are PURE AI, a food and product intelligence assistant.",
      "Provide practical, safety-first guidance in concise bullets.",
      "If there is uncertainty, explicitly mention assumptions.",
      "Do not provide medical diagnosis; suggest consulting a qualified professional for medical concerns.",
    ].join(" ");

    const userContext = [
      `Primary diet: ${context.primaryDiet ?? "not set"}`,
      `Secondary diet: ${context.secondaryDiet ?? "not set"}`,
      `User message: ${message}`,
    ].join("\n");

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
            role: "system",
            content: [{ type: "input_text", text: systemInstructions }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: userContext }],
          },
        ],
      }),
      cache: "no-store",
    });

    const payload = (await openaiRes.json()) as OpenAIResponse;

    if (!openaiRes.ok) {
      return NextResponse.json(
        {
          answer:
            payload.error?.message ??
            "PURE AI is temporarily unavailable. Please try again.",
        },
        { status: openaiRes.status },
      );
    }

    const answer =
      extractOutputText(payload) ||
      "I couldn't generate a response this time. Please try rephrasing your question.";

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      {
        answer:
          "Network issue while contacting PURE AI. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getDataSummary } from "@/lib/data";

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Lpaax is working on it" },
      { status: 500 }
    );
  }

  const { messages } = await req.json();

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const dataContext = getDataSummary();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 500,
    system: `You are the assistant embedded in "Sales Board", a Samsung Karnataka mobile distribution dashboard covering five views: Day Wise, Model Wise, Category Wise, Cluster Wise, and ASM Wise.
Answer questions about sales performance using ONLY the data provided below — this is real data as on 15-Sep-2026, not a demo.
Be concise (2-4 sentences unless asked for detail), use ₹ Cr for value and plain numbers for units, and be direct about what the data does and doesn't show.
If asked about something not covered by this data, say so plainly rather than guessing. If asked about the "N Perfomance" category value, mention it's a known data error in the source file.

CURRENT DASHBOARD DATA:
${dataContext}`,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const text = response.content.find((b) => b.type === "text")?.text || "";
  return NextResponse.json({ text });
}

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert Conversion Rate Optimization (CRO) consultant. Analyze the provided funnel data and deliver prioritized recommendations.\n\nProvide:\n1. Funnel diagnosis — where are the biggest drop-offs and why\n2. Top 5-10 prioritized recommendations (specific, actionable)\n3. For each recommendation:\n   - Expected impact (high/medium/low)\n   - Implementation effort (easy/medium/hard)\n   - Quick win vs. major test\n4. A/B test hypotheses to validate\n5. Industry benchmark comparison\n6. Estimated overall conversion lift if all recommendations implemented\n\nBe specific — no generic advice like "improve UX." Tell exactly what to change and why.`,
        },
        { role: "user", content: `Analyze this conversion funnel:\n\n${input}` },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}

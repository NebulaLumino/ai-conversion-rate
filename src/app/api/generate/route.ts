import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert CRO consultant. Analyze the provided funnel data and deliver prioritized recommendations.\n\nProvide:\n1. Funnel diagnosis — biggest drop-offs and why\n2. Top 5-10 prioritized recommendations (specific, actionable)\n3. For each recommendation: expected impact (high/medium/low), implementation effort (easy/medium/hard), quick win vs major test\n4. A/B test hypotheses to validate\n5. Industry benchmark comparison\n6. Estimated overall conversion lift\n\nBe specific — tell exactly what to change and why." },
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

import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "Configure OPENROUTER_API_KEY to enable live AI responses.",
      });
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert AI job assistant that helps users improve resumes, write cover letters, and prepare for interviews.",
        },
        { role: "user", content: message },
      ],
    });

    return NextResponse.json({ reply: completion.choices[0]?.message?.content ?? "No response generated." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { reply: "The assistant could not be reached. Configure OPENROUTER_API_KEY to enable live responses." },
      { status: 500 }
    );
  }
}

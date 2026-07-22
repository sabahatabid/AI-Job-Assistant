import { NextResponse } from "next/server";
import { runChat, getDefaultModel } from "@/backend/lib/openrouter";

export async function POST(request: Request) {
  try {
    const { message, model } = await request.json();
    const reply = await runChat({
      model: model || getDefaultModel(),
      system: "You are an expert AI job assistant that helps users improve resumes, write cover letters, and prepare for interviews.",
      prompt: message,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { reply: "The assistant could not be reached. Configure OPENROUTER_API_KEY to enable live responses." },
      { status: 500 }
    );
  }
}

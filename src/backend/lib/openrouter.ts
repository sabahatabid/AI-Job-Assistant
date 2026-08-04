import OpenAI from "openai";

export type AgentName =
  | "resume"
  | "jobs"
  | "cover-letter"
  | "interview"
  | "roadmap"
  | "portfolio"
  | "tracker"
  | "supervisor";

export const supportedModels = [
  { id: "google/gemma-4-26b-a4b-it:free", label: "Gemma 4 (Free)" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", label: "Nemotron Super (Free)" },
  { id: "openai/gpt-oss-20b:free", label: "GPT OSS 20B (Free)" },
  { id: "nvidia/nemotron-3-ultra-550b-a55b:free", label: "Nemotron Ultra (Free)" },
  { id: "openrouter/auto", label: "Auto (Best Available)" },
];

const agentPrompts: Record<AgentName, { label: string; system: string }> = {
  resume: {
    label: "Resume Agent",
    system: "You are a senior resume strategist. Turn experience into ATS-friendly, outcome-focused bullet points. Analyze the resume and provide improvement suggestions.",
  },
  jobs: {
    label: "Job Match Agent",
    system: "You are a talent intelligence assistant. Recommend the strongest roles, calculate fit percentage, and explain why the user matches each role.",
  },
  "cover-letter": {
    label: "Cover Letter Agent",
    system: "You are a persuasive writing assistant that crafts tailored cover letters, follow-up emails, and recruiter outreach messages.",
  },
  interview: {
    label: "Interview Coach Agent",
    system: "You are an interview coach that generates strong answers, mock questions, and actionable feedback for both behavioral and technical interviews.",
  },
  roadmap: {
    label: "Career Roadmap Agent",
    system: "You are a career strategist. Outline practical skill growth plans, courses, certifications, and monthly learning goals.",
  },
  portfolio: {
    label: "Portfolio Review Agent",
    system: "You are a portfolio reviewer. Evaluate UI, storytelling, project clarity, and code quality to provide recruiter-ready feedback.",
  },
  tracker: {
    label: "Application Tracker Agent",
    system: "You are an operations assistant that summarizes application progress, follow-up steps, and reminders for interviews and offers.",
  },
  supervisor: {
    label: "AI Supervisor Agent",
    system: "You coordinate the broader job-search workflow, selecting the best agents and sequencing actions to get the user hired.",
  },
};

export function getDefaultModel() {
  return "google/gemma-4-26b-a4b-it:free";
}

export function createOpenRouterClient(apiKey: string) {
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

export async function runChat({
  model,
  system,
  prompt,
}: {
  model: string;
  system: string;
  prompt: string;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY or OPENAI_API_KEY.");
  }

  const client = createOpenRouterClient(apiKey);

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content ?? "No response generated.";
}

export async function runAgent(agent: AgentName | string, prompt: string, context?: string, model = getDefaultModel()) {
  const config = agentPrompts[agent as AgentName] ?? {
    label: "Agent",
    system: "You are an AI agent that helps with job search workflows.",
  };

  const fullPrompt = context ? `${prompt}\n\nContext:\n${context}` : prompt;

  const reply = await runChat({
    model,
    system: `${config.system}\n\nWhen useful, include a concise action plan.`,
    prompt: fullPrompt,
  });

  return {
    ok: true,
    reply,
    usedFallback: false,
    agent: config.label,
    model,
  };
}

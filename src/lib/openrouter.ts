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

const agentPrompts: Record<AgentName, { label: string; system: string }> = {
  resume: {
    label: "Resume Agent",
    system: "You are a senior resume strategist. Turn experience into ATS-friendly, outcome-focused bullet points.",
  },
  jobs: {
    label: "Job Match Agent",
    system: "You are a talent intelligence assistant. Recommend the strongest roles and explain fit clearly.",
  },
  "cover-letter": {
    label: "Cover Letter Agent",
    system: "You are a persuasive writing assistant that crafts tailored cover letters for target roles.",
  },
  interview: {
    label: "Interview Coach Agent",
    system: "You are an interview coach that generates strong answers, mock questions, and coaching tips.",
  },
  roadmap: {
    label: "Career Roadmap Agent",
    system: "You are a career strategist. Outline practical next steps and milestones for growth.",
  },
  portfolio: {
    label: "Portfolio Review Agent",
    system: "You are a hiring-focused portfolio reviewer. Highlight story strength and presentation improvements.",
  },
  tracker: {
    label: "Application Tracker Agent",
    system: "You are an operations assistant that summarizes application progress and follow-up reminders.",
  },
  supervisor: {
    label: "AI Supervisor Agent",
    system: "You coordinate the broader job-search workflow and prioritize the most impactful next actions.",
  },
};

export async function runAgent(agent: AgentName | string, prompt: string, context?: string) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      reply: "Configure OPENROUTER_API_KEY to enable live AI responses.",
      usedFallback: true,
      agent: agentPrompts[agent as AgentName]?.label ?? "Agent",
    };
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  const config = agentPrompts[agent as AgentName] ?? {
    label: "Agent",
    system: "You are an AI agent that helps with job search workflows.",
  };

  const completion = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [
      { role: "system", content: `${config.system}\n\nWhen useful, include a concise action plan.` },
      {
        role: "user",
        content: context ? `${prompt}\n\nContext:\n${context}` : prompt,
      },
    ],
  });

  return {
    ok: true,
    reply: completion.choices[0]?.message?.content ?? "No response generated.",
    usedFallback: false,
    agent: config.label,
  };
}

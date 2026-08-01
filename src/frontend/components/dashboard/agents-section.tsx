"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Briefcase,
  ClipboardCheck,
  Compass,
  FileText,
  GraduationCap,
  Loader2,
  Sparkles,
  UserRoundSearch,
  X,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { supportedModels } from "@/frontend/lib/ai-models";

const agents = [
  {
    key: "resume",
    title: "Resume Agent",
    description:
      "Analyze, improve, and optimize your resume for ATS and recruiter review.",
    icon: FileText,
    defaultPrompt:
      "Analyze my resume and give me specific, actionable improvements to make it ATS-friendly and stand out to hiring managers.",
  },
  {
    key: "jobs",
    title: "Job Match Agent",
    description:
      "Match your background to roles and explain where you fit best.",
    icon: Briefcase,
    defaultPrompt:
      "Based on a software engineering background with 3 years of experience in React and TypeScript, recommend 5 highly relevant roles with fit percentage and explanation.",
  },
  {
    key: "cover-letter",
    title: "Cover Letter Agent",
    description:
      "Generate tailored cover letters, follow-up emails, and recruiter outreach copy.",
    icon: ClipboardCheck,
    defaultPrompt:
      "Write a compelling cover letter for a Senior Frontend Engineer role at a fast-growing AI startup. Emphasize problem-solving, product thinking, and technical depth.",
  },
  {
    key: "interview",
    title: "Interview Coach Agent",
    description:
      "Simulate interview questions, craft answers, and improve your confidence.",
    icon: BrainCircuit,
    defaultPrompt:
      "Give me 5 challenging behavioral interview questions for a senior engineering role, then provide example STAR-format answers and coaching tips for each.",
  },
  {
    key: "roadmap",
    title: "Career Roadmap Agent",
    description:
      "Build learning plans, certification paths, and career milestones.",
    icon: Compass,
    defaultPrompt:
      "Create a 6-month career roadmap for a mid-level frontend engineer who wants to become a Staff Engineer, including skills to develop, projects to build, and certifications to pursue.",
  },
  {
    key: "portfolio",
    title: "Portfolio Review Agent",
    description:
      "Review your portfolio story, GitHub, and project presentation quality.",
    icon: UserRoundSearch,
    defaultPrompt:
      "Walk me through best practices for a software engineer portfolio. What makes a portfolio stand out to technical recruiters and engineering managers?",
  },
  {
    key: "tracker",
    title: "Application Tracker Agent",
    description:
      "Track every application stage from saved roles to offers and rejections.",
    icon: Sparkles,
    defaultPrompt:
      "Help me build a system to track job applications effectively. What stages should I track, what follow-up actions matter most, and how do I stay organized across 20+ applications?",
  },
  {
    key: "supervisor",
    title: "AI Supervisor Agent",
    description:
      "Orchestrates the right agents in sequence for your career goals.",
    icon: GraduationCap,
    defaultPrompt:
      "I want to land a Senior Product Manager role within 3 months. Coordinate a full career action plan: resume optimization, job matching, interview prep, and application strategy.",
  },
] as const;

type AgentCard = (typeof agents)[number];

interface AgentResult {
  agent: AgentCard;
  reply: string;
}

export function AgentsSection() {
  const [activeResult, setActiveResult] = useState<AgentResult | null>(null);
  const [loadingAgent, setLoadingAgent] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(supportedModels[0].value);
  const [launchingAll, setLaunchingAll] = useState(false);
  const [customPrompts] = useState<Record<string, string>>({});

  async function runAgent(agent: AgentCard): Promise<string> {
    const prompt = customPrompts[agent.key] || agent.defaultPrompt;

    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent: agent.key,
        prompt,
        context: "User is actively looking for a new role.",
        model: selectedModel,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return data?.reply || `${agent.title} completed.`;
  }

  async function handleAgentLaunch(agent: AgentCard) {
    if (loadingAgent) return; // prevent concurrent launches
    setLoadingAgent(agent.key);
    setActiveResult(null);

    try {
      const reply = await runAgent(agent);
      setActiveResult({ agent, reply });
    } catch {
      setActiveResult({
        agent,
        reply: `${agent.title} could not be reached. Please check your API key and try again.`,
      });
    } finally {
      setLoadingAgent(null);
    }
  }

  async function handleLaunchAll() {
    if (launchingAll || loadingAgent) return;
    setLaunchingAll(true);

    // Run the supervisor agent which orchestrates a full plan
    const supervisorAgent = agents.find((a) => a.key === "supervisor");
    if (supervisorAgent) {
      setLoadingAgent("supervisor");
      try {
        const reply = await runAgent(supervisorAgent);
        setActiveResult({ agent: supervisorAgent, reply });
      } catch {
        setActiveResult({
          agent: supervisorAgent,
          reply:
            "The AI Supervisor could not be reached. Please check your API key and try again.",
        });
      } finally {
        setLoadingAgent(null);
      }
    }
    setLaunchingAll(false);
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">
            Specialist agents
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            One AI teammate for every part of your job search.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              AI model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100"
            >
              {supportedModels.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleLaunchAll}
            disabled={launchingAll || !!loadingAgent}
            className="rounded-full bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-60"
          >
            {launchingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running…
              </>
            ) : (
              <>
                Launch all agents <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const isLoading = loadingAgent === agent.key;

          return (
            <motion.div
              key={agent.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="flex h-full flex-col border-white/10 bg-slate-950/70 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-400/30">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3 text-lg text-white">
                    {agent.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="flex-1 text-sm leading-7 text-slate-400">
                    {agent.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-2 text-sm text-cyan-200">
                    <div className="flex items-center gap-2">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      {isLoading ? "Running…" : "Ready to run"}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAgentLaunch(agent)}
                      disabled={!!loadingAgent}
                      className="rounded-full bg-cyan-400/10 px-3 text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-50"
                    >
                      {isLoading ? "Running" : "Launch"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Agent response modal */}
      {activeResult ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveResult(null);
          }}
        >
          <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">
                  Agent response
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {activeResult.agent.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveResult(null)}
                className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/10"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-300 whitespace-pre-wrap">
              {activeResult.reply}
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
              Suggested next step: copy this response, refine it in the Chat
              tab, and apply it to your job search.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const el = activeResult.agent;
                  setActiveResult(null);
                  // Re-run same agent (allows re-generation)
                  setTimeout(() => handleAgentLaunch(el), 100);
                }}
                className="rounded-full border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
              >
                Regenerate
              </Button>
              <Button
                onClick={() => setActiveResult(null)}
                className="rounded-full bg-white text-slate-900 hover:bg-slate-100"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, Briefcase, ClipboardCheck, Compass, FileText, GraduationCap, Sparkles, UserRoundSearch, X } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { supportedModels } from "@/frontend/lib/ai-models";

const agents = [
  {
    key: "resume",
    title: "Resume Agent",
    description: "Analyze, improve, and optimize your resume for ATS and recruiter review.",
    icon: FileText,
  },
  {
    key: "jobs",
    title: "Job Match Agent",
    description: "Match your background to roles and explain where you fit best.",
    icon: Briefcase,
  },
  {
    key: "cover-letter",
    title: "Cover Letter Agent",
    description: "Generate tailored cover letters, follow-up emails, and recruiter outreach copy.",
    icon: ClipboardCheck,
  },
  {
    key: "interview",
    title: "Interview Coach Agent",
    description: "Simulate interview questions, craft answers, and improve your confidence.",
    icon: BrainCircuit,
  },
  {
    key: "roadmap",
    title: "Career Roadmap Agent",
    description: "Build learning plans, certification paths, and career milestones.",
    icon: Compass,
  },
  {
    key: "portfolio",
    title: "Portfolio Review Agent",
    description: "Review your portfolio story, GitHub, and project presentation quality.",
    icon: UserRoundSearch,
  },
  {
    key: "tracker",
    title: "Application Tracker Agent",
    description: "Track every application stage from saved roles to offers and rejections.",
    icon: Sparkles,
  },
  {
    key: "supervisor",
    title: "AI Supervisor Agent",
    description: "Orchestrates the right agents in sequence for your career goals.",
    icon: GraduationCap,
  },
] as const;

type AgentCard = (typeof agents)[number];

export function AgentsSection() {
  const [activeAgent, setActiveAgent] = useState<AgentCard | null>(null);
  const [loadingAgent, setLoadingAgent] = useState<string | null>(null);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(supportedModels[0].value);

  async function handleAgentRun(agent: AgentCard) {
    setActiveAgent(agent);
    setLoadingAgent(agent.key);
    setAgentResponse(null);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: agent.key,
          prompt: `Help with ${agent.title}`,
          context: "User wants practical next steps.",
          model: selectedModel,
        }),
      });

      const data = await res.json();
      setAgentResponse(data?.reply || `${agent.title} is ready to help with your next move.`);
    } catch (error) {
      console.error(error);
      setAgentResponse(`${agent.title} could not be reached right now.`);
    } finally {
      setLoadingAgent(null);
    }
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">Specialist agents</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">One AI teammate for every part of your job search.</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">AI model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100"
            >
              {supportedModels.map((model) => (
                <option key={model.value} value={model.value}>{model.label}</option>
              ))}
            </select>
          </div>
          <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
            Launch all agents <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full border-white/10 bg-slate-950/70 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-400/30">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3 text-lg text-white">{agent.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-400">{agent.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-2 text-sm text-cyan-200">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Ready to run
                    </div>
                    <Button size="sm" onClick={() => handleAgentRun(agent)} className="rounded-full bg-cyan-400/10 px-3 text-cyan-200 hover:bg-cyan-400/20">
                      {loadingAgent === agent.key ? "Running" : "Launch"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {activeAgent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">Agent response</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{activeAgent.title}</h3>
              </div>
              <button onClick={() => setActiveAgent(null)} className="rounded-full border border-white/10 p-2 text-slate-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              {loadingAgent === activeAgent.key ? "Working on your request…" : agentResponse || "Your agent response will appear here."}
            </p>
            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
              Suggested next step: review the output, save it to your notes, and apply it in your next conversation.
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setActiveAgent(null)} className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

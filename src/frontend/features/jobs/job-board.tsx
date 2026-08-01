"use client";

import { useCallback, useReducer } from "react";
import { motion } from "framer-motion";
import { Briefcase, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";

interface JobOpportunity {
  title: string;
  company: string;
  location: string;
  match: string;
  reason: string;
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; jobs: JobOpportunity[] }
  | { status: "error"; message: string };

type Action =
  | { type: "fetch" }
  | { type: "success"; jobs: JobOpportunity[] }
  | { type: "error"; message: string };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "fetch":
      return { status: "loading" };
    case "success":
      return { status: "success", jobs: action.jobs };
    case "error":
      return { status: "error", message: action.message };
  }
}

// Parse free-text AI response into structured job cards
function parseJobsFromText(text: string): JobOpportunity[] {
  const lines = text.split("\n").filter((l) => l.trim());
  const jobs: JobOpportunity[] = [];
  let current: Partial<JobOpportunity> = {};

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes("role:") || lower.includes("title:") || /^\d+\./.test(line)) {
      if (current.title) jobs.push(current as JobOpportunity);
      current = {};
      const clean = line
        .replace(/^\d+\.\s*/, "")
        .replace(/^(role|title):\s*/i, "")
        .trim();
      if (clean) current.title = clean;
    } else if (lower.includes("company:")) {
      current.company = line.replace(/^company:\s*/i, "").trim();
    } else if (lower.includes("location:")) {
      current.location = line.replace(/^location:\s*/i, "").trim();
    } else if (lower.includes("fit") || lower.includes("match") || lower.includes("%")) {
      const pct = line.match(/(\d{2,3}%)/)?.[1];
      current.match = pct ? `${pct} fit` : line.replace(/^(fit|match):\s*/i, "").trim();
    } else if (lower.includes("reason:") || lower.includes("why:")) {
      current.reason = line.replace(/^(reason|why):\s*/i, "").trim();
    } else if (!current.reason && current.match && line.trim().length > 10) {
      current.reason = line.trim();
    }
  }

  if (current.title) jobs.push(current as JobOpportunity);

  return jobs.slice(0, 6).map((j) => ({
    title: j.title || "Software Role",
    company: j.company || "Top Tech Company",
    location: j.location || "Remote",
    match: j.match || "High fit",
    reason: j.reason || "Recommended by your AI copilot",
  }));
}

const PROMPT =
  "Recommend 5 high-fit job opportunities for a software engineer with 3+ years of " +
  "experience in React, TypeScript, and Node.js. For each role include: Role title, " +
  "Company (use realistic but fictional names), Location, Fit percentage (0-100%), " +
  "and a one-line reason why they are a match. " +
  "Format each as numbered items with labeled fields.";

export function JobBoard() {
  const [state, dispatch] = useReducer(reducer, { status: "idle" });

  const fetchJobs = useCallback(async () => {
    dispatch({ type: "fetch" });

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "jobs",
          prompt: PROMPT,
          context: "User is actively job searching.",
          model: "openai/gpt-4o-mini",
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const parsed = parseJobsFromText(data.reply || "");

      dispatch({
        type: "success",
        jobs:
          parsed.length > 0
            ? parsed
            : [
                {
                  title: "AI Job Recommendations",
                  company: "CareerPilot AI",
                  location: "Review below",
                  match: "Personalized",
                  reason:
                    data.reply?.slice(0, 200) || "No recommendations available.",
                },
              ],
      });
    } catch {
      dispatch({
        type: "error",
        message: "Could not load job recommendations. Check your API key.",
      });
    }
  }, []);

  // Trigger initial fetch on first render using a render-time flag
  // (avoids the set-state-in-effect lint rule)
  if (state.status === "idle") {
    fetchJobs();
  }

  if (state.status === "idle" || state.status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <p className="text-sm text-slate-400">AI is finding your best matches…</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-6 text-center">
        <p className="text-sm text-rose-300">{state.message}</p>
        <Button
          onClick={fetchJobs}
          className="mt-4 rounded-full bg-rose-400/10 text-rose-200 hover:bg-rose-400/20"
        >
          Retry
        </Button>
      </div>
    );
  }

  const { jobs } = state;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchJobs}
          className="rounded-full border-white/10 bg-transparent text-slate-300 hover:bg-white/10"
        >
          <RefreshCw className="mr-2 h-3 w-3" />
          Refresh recommendations
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-2"
      >
        {jobs.map((job, index) => (
          <motion.div
            key={`${job.title}-${index}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className="h-full border-white/10 bg-slate-950/70 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-400/30">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <CardTitle className="text-base text-white">{job.title}</CardTitle>
                  </div>
                  <Badge className="shrink-0 border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                    {job.match}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-400">
                <p className="font-medium text-slate-200">{job.company}</p>
                <p>{job.location}</p>
                <div className="flex items-start gap-2 pt-2 text-slate-500">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{job.reason}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {jobs.length === 0 && (
        <p className="text-center text-sm text-slate-500">No recommendations yet.</p>
      )}
    </div>
  );
}

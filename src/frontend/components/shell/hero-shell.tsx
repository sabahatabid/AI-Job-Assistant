"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AuthButton } from "@/frontend/features/auth/auth-button";
import { Button } from "@/frontend/components/ui/button";

export function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),_transparent_45%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">
              <Sparkles className="h-4 w-4" /> AI Job Assistant
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Land your next role with a smarter AI workflow.
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Use Supabase-backed authentication, a polished job board, and an OpenRouter-powered assistant to accelerate every stage of your search.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AuthButton />
            <Button variant="outline">View roadmap</Button>
          </div>
        </motion.header>
        {children}
      </div>
    </main>
  );
}

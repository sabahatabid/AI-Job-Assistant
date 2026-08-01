"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Badge } from "@/frontend/components/ui/badge";
import { supportedModels } from "@/frontend/lib/ai-models";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const starterPrompts = [
  "Tailor my resume for a product manager role",
  "Draft a cover letter for a frontend engineer role",
  "Help me prepare for a behavioral interview",
  "What skills should I add to land a Staff Engineer role?",
];

export function AssistantClient() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(supportedModels[0].value);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help with resumes, cover letters, interview prep, and career advice. What would you like to work on?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, model: selectedModel }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "I could not generate a response. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "The assistant is unavailable right now. Please check your API key configuration and try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await sendMessage(input);
  }

  function handleStarterClick(prompt: string) {
    setInput(prompt);
    inputRef.current?.focus();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-white/10 bg-transparent shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl text-white">AI job copilot</CardTitle>
          <p className="text-sm text-slate-400">
            Ask anything about your job search, resume, or career.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 px-0 pb-0">
          {/* Starter prompts */}
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleStarterClick(prompt)}
                disabled={loading}
                className="disabled:opacity-50"
              >
                <Badge className="cursor-pointer border-white/10 bg-slate-800/70 text-slate-300 transition hover:bg-slate-700/70 hover:text-white">
                  {prompt}
                </Badge>
              </button>
            ))}
          </div>

          {/* Model selector */}
          <div className="grid gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4 sm:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="text-sm font-medium text-slate-400">AI model</p>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              >
                {supportedModels.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-sm font-medium text-slate-300">Current model</p>
              <p className="mt-1 text-xs text-slate-500">
                {supportedModels.find((m) => m.value === selectedModel)?.label ?? selectedModel}
              </p>
            </div>
          </div>

          {/* Message thread */}
          <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-slate-950/50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                    message.role === "assistant"
                      ? "bg-slate-800 text-slate-200"
                      : "bg-cyan-400/20 text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your next opportunity…"
              disabled={loading}
              className="border-white/10 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/40"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="min-w-[120px] rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {loading ? "Thinking" : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

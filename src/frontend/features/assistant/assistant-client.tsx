"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Badge } from "@/frontend/components/ui/badge";
import { supportedModels } from "@/frontend/lib/ai-models";

const starterPrompts = [
  "Tailor my resume for a product manager role",
  "Draft a cover letter for a frontend engineer role",
  "Help me prepare for a behavioral interview",
];

export function AssistantClient() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(supportedModels[0].value);
  const [messages, setMessages] = useState([{ role: "assistant", content: "I can help with resumes, cover letters, and interview prep." }]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, model: selectedModel }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "The assistant is unavailable right now. Please try again shortly." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI job copilot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button key={prompt} onClick={() => setInput(prompt)}>
                <Badge>{prompt}</Badge>
              </button>
            ))}
          </div>
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="text-sm font-medium text-slate-500">AI model</p>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              >
                {supportedModels.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
              <p className="text-sm font-medium text-slate-700">Current assistant</p>
              <p className="mt-2 text-sm text-slate-600">Use the chosen model to generate concise career guidance, resume edits, and interview preparation.</p>
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "assistant" ? "text-slate-700" : "text-slate-950 font-medium"}>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your next opportunity..." />
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              <Send className="mr-2 h-4 w-4" /> {loading ? "Thinking" : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

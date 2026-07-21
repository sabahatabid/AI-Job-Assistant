"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const starterPrompts = [
  "Tailor my resume for a product manager role",
  "Draft a cover letter for a frontend engineer role",
  "Help me prepare for a behavioral interview",
];

export function AssistantClient() {
  const [input, setInput] = useState("");
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
        body: JSON.stringify({ message: input }),
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
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "assistant" ? "text-slate-700" : "text-slate-950 font-medium"}>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your next opportunity..." />
            <Button type="submit" disabled={loading}>
              <Send className="mr-2 h-4 w-4" /> {loading ? "Thinking" : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

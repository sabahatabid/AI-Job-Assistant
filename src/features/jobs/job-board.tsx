"use client";

import { motion } from "framer-motion";
import { Briefcase, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const opportunities = [
  {
    title: "Senior Frontend Engineer",
    company: "Northstar AI",
    location: "Remote · US",
    match: "96% fit",
  },
  {
    title: "Product Designer",
    company: "Kite Labs",
    location: "New York · Hybrid",
    match: "89% fit",
  },
  {
    title: "ML Platform Engineer",
    company: "Aurelia",
    location: "London · Remote",
    match: "92% fit",
  },
];

export function JobBoard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2">
      {opportunities.map((job) => (
        <Card key={job.title} className="transition hover:-translate-y-1 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-600" />
                <CardTitle className="text-base">{job.title}</CardTitle>
              </div>
              <Badge>{job.match}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{job.company}</p>
            <p>{job.location}</p>
            <div className="flex items-center gap-2 pt-2 text-slate-500">
              <Sparkles className="h-4 w-4" />
              <span>Recommended by your AI copilot</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
}

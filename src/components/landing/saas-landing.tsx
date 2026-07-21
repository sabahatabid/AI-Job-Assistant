"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "Agentic workflows",
    description: "Launch AI agents that research, draft, and execute on your behalf in minutes.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade trust",
    description: "Role-based controls, audit trails, and secure-by-default infrastructure.",
  },
  {
    icon: Zap,
    title: "Instant time-to-value",
    description: "Get from idea to production with templates, guardrails, and automation baked in.",
  },
];

const agents = [
  {
    name: "Research Copilot",
    blurb: "Surface signal-rich insights from your product, market, and customer conversations.",
  },
  {
    name: "Workflow Orchestrator",
    blurb: "Chain approvals, automations, and handoffs across your best team rituals.",
  },
  {
    name: "Revenue Concierge",
    blurb: "Turn every customer touchpoint into a tailored follow-up and upsell motion.",
  },
];

const testimonials = [
  {
    quote: "We moved from static playbooks to autonomous execution in under two weeks.",
    name: "Ava Chen",
    role: "VP Product, Northstar",
  },
  {
    quote: "The product feels like the future of work—beautiful, thoughtful, and fast.",
    name: "Marcus Reed",
    role: "CTO, Lumen Labs",
  },
  {
    quote: "Our team ships twice as much with half the coordination overhead.",
    name: "Sofia Alvarez",
    role: "Head of Ops, Helio",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$29",
    description: "For early teams building their first AI workflows.",
    features: ["3 active agents", "Unlimited prompts", "Email support"],
    featured: false,
  },
  {
    name: "Scale",
    price: "$99",
    description: "For growing companies shipping real automation daily.",
    features: ["Unlimited agents", "Team collaboration", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with compliance and governance needs.",
    features: ["Dedicated success team", "SSO + audit logs", "Security review"],
    featured: false,
  },
];

const faqs = [
  {
    question: "How quickly can we get started?",
    answer: "Most teams are live in a day with our templates and guided setup flow.",
  },
  {
    question: "Does it work with our existing tools?",
    answer: "Yes. We connect to your CRMs, docs, ticketing tools, and internal knowledge bases.",
  },
  {
    question: "Is the platform secure?",
    answer: "Absolutely. We support SSO, audit logs, encryption, and enterprise deployment options.",
  },
];

export function SaaSLanding() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_35%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] text-slate-100">
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[32px] border border-white/10 bg-white/8 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
                <Bot className="h-4 w-4" /> New · Autonomous AI workspace
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                The premium AI operating system for modern teams.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                Design, ship, and scale delightful AI experiences with agents that feel native to your company.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="rounded-full bg-white px-6 text-slate-900 hover:bg-slate-100">
                  Get started free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-full border-white/20 bg-slate-950/60 text-white hover:bg-slate-900">
                  <CirclePlay className="mr-2 h-4 w-4" /> Watch demo
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-400">
                <span>4.9/5 from 2,000+ teams</span>
                <span>99.9% uptime</span>
                <span>SOC 2 ready</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl"
            >
              <div className="rounded-[24px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">
                    Live workspace
                  </span>
                  <span className="text-sm text-cyan-200">+32% efficiency</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm text-slate-400">Automations triggered</p>
                    <p className="mt-2 text-3xl font-semibold text-white">184</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <p className="text-sm text-slate-400">Avg. response</p>
                      <p className="mt-2 text-xl font-semibold text-white">2.1s</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <p className="text-sm text-slate-400">Coverage</p>
                      <p className="mt-2 text-xl font-semibold text-white">97%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.header>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-lg shadow-slate-950/20">
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="mt-3 text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20 sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">AI agents showcase</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Purpose-built agents for every stage of work.</h2>
            </div>
            <p className="max-w-xl text-slate-400">From discovery to delivery, each agent becomes a calm, reliable teammate with clear context and measurable outcomes.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5"
              >
                <div className="mb-4 flex items-center gap-2 text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Agent {index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{agent.blurb}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">Testimonials</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Loved by product-led teams.</h2>
            <div className="mt-6 space-y-4">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-sm leading-7 text-slate-300">“{item.quote}”</p>
                  <div className="mt-3">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-slate-400">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">Pricing</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Simple plans, premium outcomes.</h2>
            <div className="mt-6 grid gap-4">
              {pricing.map((plan) => (
                <div key={plan.name} className={`rounded-[24px] border p-5 ${plan.featured ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/10 bg-slate-950/70"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{plan.name}</p>
                      <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-white">{plan.price}</p>
                      <p className="text-sm text-slate-400">/ month</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-200" /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20 sm:p-8 lg:p-10">
          <div className="mb-6 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">FAQ</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Everything you need to know.</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                <p className="font-medium text-white">{faq.question}</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-slate-950/70 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-white">Northstar AI</p>
            <p className="mt-1">Premium AI experiences for every ambitious company.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="transition hover:text-white">Product</a>
            <a href="#" className="transition hover:text-white">Pricing</a>
            <a href="#" className="transition hover:text-white">About</a>
            <a href="#" className="transition hover:text-white">Contact</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

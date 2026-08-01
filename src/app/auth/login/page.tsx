"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { supabase } from "@/frontend/features/auth/auth-client";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const [message, setMessage] = useState<string | null>(
    callbackError === "auth_callback_failed"
      ? "Sign-in failed. Please try again."
      : null
  );
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
    } else {
      setMessage("Check your email to complete sign-in.");
    }
  }

  async function handleGoogle() {
    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "/auth/callback";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
          <CardHeader>
            <CardTitle className="text-3xl">Sign in to CareerPilot AI</CardTitle>
            <p className="mt-3 text-sm text-slate-400">
              Secure access to your career dashboard, AI agents, and resume intelligence.
            </p>
          </CardHeader>
          <CardContent className="mt-6 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                <Input type="email" placeholder="you@company.com" {...register("email")} />
                {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <Input type="password" placeholder="Enter your password" {...register("password")} />
                {errors.password && <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>}
              </div>
              {message ? <p className="text-sm text-rose-300">{message}</p> : null}
              <Button type="submit" disabled={loading} className="w-full rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
            <div className="border-t border-slate-700 pt-4">
              <Button onClick={handleGoogle} className="w-full rounded-full bg-white text-slate-900 hover:bg-slate-100">
                Continue with Google
              </Button>
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:justify-between">
              <Link href="/auth/signup" className="text-cyan-300 hover:text-cyan-200">
                Create account
              </Link>
              <Link href="/auth/forgot" className="text-cyan-300 hover:text-cyan-200">
                Forgot password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

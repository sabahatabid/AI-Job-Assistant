"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { supabase } from "@/frontend/features/auth/auth-client";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

  async function onSubmit(values: ForgotValues) {
    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/login`,
    });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your email for reset instructions.");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
          <CardHeader>
            <CardTitle className="text-3xl">Reset your password</CardTitle>
            <p className="mt-3 text-sm text-slate-400">Enter your email and we’ll send a secure reset link.</p>
          </CardHeader>
          <CardContent className="mt-6 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                <Input type="email" placeholder="you@company.com" {...register("email")} />
                {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
              </div>
              {message ? <p className="text-sm text-slate-300">{message}</p> : null}
              <Button type="submit" disabled={loading} className="w-full rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </form>
            <div className="flex justify-between text-sm text-slate-400">
              <Link href="/auth/login" className="text-cyan-300 hover:text-cyan-200">
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

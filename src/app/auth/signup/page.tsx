"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { supabase } from "@/frontend/features/auth/auth-client";

const signupSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupValues) {
    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      router.push("/dashboard");
    } else {
      setMessage("A confirmation email has been sent. Please verify to continue.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
          <CardHeader>
            <CardTitle className="text-3xl">Create your CareerPilot AI account</CardTitle>
            <p className="mt-3 text-sm text-slate-400">
              Access your career command center and AI agent workspace.
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
                <Input type="password" placeholder="Create a password" {...register("password")} />
                {errors.password && <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>}
              </div>
              {message ? <p className="text-sm text-rose-300">{message}</p> : null}
              <Button type="submit" disabled={loading} className="w-full rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
            <div className="flex justify-between text-sm text-slate-400">
              <Link href="/auth/login" className="text-cyan-300 hover:text-cyan-200">
                Already have an account?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

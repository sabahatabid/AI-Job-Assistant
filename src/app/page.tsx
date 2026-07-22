"use client";

import { useRouter } from "next/navigation";
import { SaaSLanding } from "@/frontend/components/landing/saas-landing";

export default function Home() {
  const router = useRouter();

  return (
    <SaaSLanding
      onGetStarted={() => router.push("/dashboard")}
      onWatchWalkthrough={() => router.push("/#walkthrough")}
    />
  );
}

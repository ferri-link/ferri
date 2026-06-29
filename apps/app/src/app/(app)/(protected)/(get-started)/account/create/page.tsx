import type { Metadata } from "next";

import { fetchUserIfNotCompleted } from "@/lib/handlers/page/authHandler";

import { OnboardingForm } from "./form";

export const metadata: Metadata = {
  title: "Welcome to Ferri",
};

export default async function OnboardingPage() {
  const user = await fetchUserIfNotCompleted();

  const suggestedName = user.email?.split("@")[0] ?? "";

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm">
        <OnboardingForm defaultName={suggestedName} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { OnboardingForm } from "./form";

export const metadata: Metadata = {
  title: "Welcome to Ferri",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }
  if (user.user_metadata?.display_name) {
    redirect("/");
  }

  const suggestedName = user.email?.split("@")[0] ?? "";

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm">
        <OnboardingForm defaultName={suggestedName} />
      </div>
    </div>
  );
}

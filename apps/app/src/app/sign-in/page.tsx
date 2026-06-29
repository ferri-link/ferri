import type { Metadata } from "next";
import Link from "next/link";

import { Caption } from "@/components/ui/caption";

import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-8">
      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <SignInForm />
        <Caption className="text-center">
          By using Ferri you agree to our{" "}
          <Link href="https://ferri.link/terms/">Terms of Service</Link> and{" "}
          <Link href="https://ferri.link/privacy/">Privacy Policy</Link>.
        </Caption>
      </div>
    </div>
  );
}

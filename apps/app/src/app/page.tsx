import type { Metadata } from "next";

import { ModeToggle } from "@/components/mode-toggle";
import { getUserMemberships } from "@/lib/cache/membership";
import { getUser } from "@/lib/cache/user";
import { paths } from "@/lib/utils/paths";

import { DashboardButton } from "./dashboard-button";
import { SignInButton } from "./sign-in-button";

export const metadata: Metadata = {
  title: "Ferri — Deep-links with superpowers",
  description:
    "Create smart deep links that send every user to the right place — the app, the right store, or the web — and attribute each click across iOS, Android, and beyond.",
};

export default async function Home() {
  const user = await getUser();
  const memberships = user ? await getUserMemberships(user.id) : [];
  const firstProject = memberships[0]?.project;

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between p-4">
        <span className="font-semibold tracking-tight">Ferri</span>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {user ? (
            <DashboardButton
              href={
                firstProject
                  ? paths.projects.id(firstProject.id).index
                  : paths.projects.create
              }
            />
          ) : (
            <SignInButton href={paths.auth.index} />
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <h1 className="text-5xl font-medium tracking-tight sm:text-6xl">
          Deep-links
          <br />
          with superpowers
        </h1>
      </main>
    </div>
  );
}

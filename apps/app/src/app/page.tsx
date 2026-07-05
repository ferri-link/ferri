import type { Metadata } from "next";

import { Wordmark } from "@/components/logo";
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
      <header className="p-4">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <Wordmark />
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
        </div>
      </header>

      <main className="flex flex-col items-center px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-medium tracking-tight sm:text-6xl md:text-7xl">
          App links
          <br />
          with superpowers
        </h1>
        <p className="mt-6 text-lg text-neutral-500 dark:text-neutral-400">
          Send every user to the right place, and know exactly what each link
          earned.
        </p>
      </main>

      <section id="features" className="px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800"
              >
                <h3 className="font-medium">Feature {n}</h3>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Placeholder description for this feature.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="text-3xl tracking-tight sm:text-4xl">Pricing</h2>
          <p className="mt-3 max-w-xl text-neutral-500 dark:text-neutral-400">
            Placeholder — outline the plans here.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {["Free", "Pro", "Enterprise"].map((plan) => (
              <div
                key={plan}
                className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800"
              >
                <h3 className="font-medium">{plan}</h3>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Placeholder plan details.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto p-4">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 text-sm text-neutral-500 sm:flex-row dark:text-neutral-400">
          <span>© {new Date().getFullYear()} Ferri</span>
          <nav className="flex items-center gap-4">
            <a
              href="#"
              className="hover:text-neutral-900 dark:hover:text-neutral-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-neutral-900 dark:hover:text-neutral-200"
            >
              Terms
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

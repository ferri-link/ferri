import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { getUserMemberships } from "@/lib/cache/membership";
import { getUser } from "@/lib/cache/user";
import { paths } from "@/lib/utils/paths";

export default async function Home() {
  const user = await getUser();
  const memberships = user ? await getUserMemberships(user.id) : [];
  const firstProject = memberships[0]?.project;

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <main className="flex w-full max-w-200 flex-col gap-8 px-6 py-12 sm:px-[60px] sm:py-[120px]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-balance">
              Ferri
            </h1>
            <p className="text-muted-foreground">
              App deep-links with superpowers.
            </p>
          </div>
          <ModeToggle />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {user ? (
            <Button
              render={
                <Link
                  href={
                    firstProject
                      ? paths.projects.id(firstProject.id).index
                      : paths.projects.create
                  }
                />
              }
            >
              Dashboard
            </Button>
          ) : (
            <Button render={<Link href={paths.auth.index} />}>Sign in</Button>
          )}
        </div>
      </main>
    </div>
  );
}

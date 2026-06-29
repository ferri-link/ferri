import type { Metadata } from "next";

import { fetchUser } from "@/lib/handlers/page";

import { CreateProjectForm } from "./form";

export const metadata: Metadata = {
  title: "Create a project",
};

export default async function CreateProjectPage() {
  await fetchUser();

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <CreateProjectForm />
      </div>
    </div>
  );
}

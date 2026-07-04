import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

import { PageLayout } from "../../../page-layout";

export const metadata: Metadata = {
  title: "Folders",
};

export default function FoldersPage() {
  return (
    <PageLayout title="Folders" action={<Button>New folder</Button>} />
  );
}

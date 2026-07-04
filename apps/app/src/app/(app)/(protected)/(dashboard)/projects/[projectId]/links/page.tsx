import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

import { PageLayout } from "../../../page-layout";

export const metadata: Metadata = {
  title: "Links",
};

export default function LinksPage() {
  return <PageLayout title="Links" action={<Button>New link</Button>} />;
}

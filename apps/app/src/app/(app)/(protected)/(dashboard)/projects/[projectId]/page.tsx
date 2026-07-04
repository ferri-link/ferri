import type { Metadata } from "next";

import { PageLayout } from "../../page-layout";

export const metadata: Metadata = {
  title: "Overview",
};

export default function ProjectOverviewPage() {
  return <PageLayout title="Overview" />;
}

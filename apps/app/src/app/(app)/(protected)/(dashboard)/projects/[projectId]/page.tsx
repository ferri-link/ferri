import type { Metadata } from "next";

import { PageLayout } from "../../page-layout";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function ProjectDashboardPage() {
  return <PageLayout title="Dashboard" />;
}

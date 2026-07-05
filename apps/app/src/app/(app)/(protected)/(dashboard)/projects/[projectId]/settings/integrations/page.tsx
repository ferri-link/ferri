import type { Metadata } from "next";

import { PageLayout } from "../../../../page-layout";

export const metadata: Metadata = {
  title: "Integrations",
};

export default function IntegrationsSettingsPage() {
  return <PageLayout title="Integrations" />;
}

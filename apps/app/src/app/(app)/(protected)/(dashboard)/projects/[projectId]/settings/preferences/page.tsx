import type { Metadata } from "next";

import { PageLayout } from "../../../../page-layout";

export const metadata: Metadata = {
  title: "Preferences",
};

export default function PreferencesSettingsPage() {
  return <PageLayout title="Preferences" />;
}

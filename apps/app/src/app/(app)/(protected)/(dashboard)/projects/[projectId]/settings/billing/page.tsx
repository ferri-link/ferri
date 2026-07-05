import type { Metadata } from "next";

import { PageLayout } from "../../../../page-layout";

export const metadata: Metadata = {
  title: "Billing",
};

export default function BillingSettingsPage() {
  return <PageLayout title="Billing" />;
}

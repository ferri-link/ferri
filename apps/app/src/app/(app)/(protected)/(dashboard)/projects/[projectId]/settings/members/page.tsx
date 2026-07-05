import type { Metadata } from "next";

import { PageLayout } from "../../../../page-layout";

export const metadata: Metadata = {
  title: "Members",
};

export default function MembersSettingsPage() {
  return <PageLayout title="Members" />;
}

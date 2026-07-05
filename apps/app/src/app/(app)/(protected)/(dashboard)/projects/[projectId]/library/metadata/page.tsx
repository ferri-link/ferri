import type { Metadata } from "next";

import { PageLayout } from "../../../../page-layout";

export const metadata: Metadata = {
  title: "Metadata",
};

export default function MetadataPage() {
  return <PageLayout title="Metadata" />;
}

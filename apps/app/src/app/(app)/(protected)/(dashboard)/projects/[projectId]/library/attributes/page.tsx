import type { Metadata } from "next";

import { PageLayout } from "../../../../page-layout";
import { AttributesEmpty } from "./empty";

export const metadata: Metadata = {
  title: "Attributes",
};

export default function AttributesPage() {
  return (
    <PageLayout title="Attributes">
      <AttributesEmpty />
    </PageLayout>
  );
}

import type { Metadata } from "next";

import { PageLayout } from "../../../../page-layout";
import { ActionsEmpty } from "./empty";

export const metadata: Metadata = {
  title: "Actions",
};

export default function ActionsPage() {
  return (
    <PageLayout title="Actions">
      <ActionsEmpty />
    </PageLayout>
  );
}

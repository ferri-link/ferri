import type { Metadata } from "next";

import { PageLayout } from "../../../page-layout";
import { CreateLinkDialog } from "./create-dialog";

export const metadata: Metadata = {
  title: "Links",
};

export default function LinksPage() {
  return <PageLayout title="Links" action={<CreateLinkDialog />} />;
}

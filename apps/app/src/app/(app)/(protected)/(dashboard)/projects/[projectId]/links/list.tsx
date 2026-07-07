"use client";

import { useMemo } from "react";

import type { ProjectLink } from "@/lib/cache/link";

import { linkColumns } from "./columns";
import { DataTable } from "./data-table";

export function LinkList({
  projectId,
  links,
}: {
  projectId: string;
  links: ProjectLink[];
}) {
  const columns = useMemo(() => linkColumns(projectId), [projectId]);

  return <DataTable columns={columns} data={links} />;
}

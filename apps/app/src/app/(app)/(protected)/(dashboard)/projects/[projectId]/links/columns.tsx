"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { ProjectLink } from "@/lib/cache/link";

import { LinkActions } from "./actions";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function linkColumns(projectId: string): ColumnDef<ProjectLink>[] {
  return [
    {
      accessorKey: "code",
      header: "Short link",
      cell: ({ row }) => {
        const link = row.original;
        return (
          <a
            href={`https://${link.domain}/${link.code}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.domain}/{link.code}
          </a>
        );
      },
    },
    {
      id: "folder",
      accessorFn: (link) => link.folder.name,
      header: "Folder",
      cell: ({ row }) => row.original.folder.name,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => dateFormat.format(row.original.createdAt),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <LinkActions projectId={projectId} link={row.original} />
      ),
    },
  ];
}

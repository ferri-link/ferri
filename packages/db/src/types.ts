/**
 * Hand-written shapes for `Json` columns.
 *
 * Prisma types JSON columns as `Prisma.JsonValue`, so these describe the
 * expected structure. Cast at read time, e.g.
 *   const meta = project.metadata as ProjectMetadata | null;
 */

/** Shape of `Project.metadata` (jsonb). */
export type ProjectMetadata = {
  /** ISO 8601 timestamp of when access was granted. */
  access_granted_at?: string;
};

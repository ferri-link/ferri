import type { ProjectMetadata } from "@ferri/db";

// A project is only usable once access has been granted. Until then its members
// are held on the waitlist page instead of the normal project UI.
export function hasProjectAccess(project: { metadata: unknown }): boolean {
  const metadata = project.metadata as ProjectMetadata | null;
  return Boolean(metadata?.access_granted_at);
}

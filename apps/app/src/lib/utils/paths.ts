export const paths = {
  index: "/",
  auth: {
    index: "/auth",
  },
  account: {
    create: "/account/create",
  },
  projects: {
    create: "/projects/create",
    id: (projectId: string) => ({
      index: `/projects/${projectId}`,
      links: `/projects/${projectId}/links`,
      folders: `/projects/${projectId}/folders`,
    }),
  },
} as const;

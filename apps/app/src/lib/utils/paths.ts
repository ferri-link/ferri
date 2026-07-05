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
      library: {
        index: `/projects/${projectId}/library`,
        folders: `/projects/${projectId}/library/folders`,
        actions: `/projects/${projectId}/library/actions`,
        attributes: `/projects/${projectId}/library/attributes`,
      },
      settings: {
        index: `/projects/${projectId}/settings`,
        preferences: `/projects/${projectId}/settings/preferences`,
        billing: `/projects/${projectId}/settings/billing`,
        members: `/projects/${projectId}/settings/members`,
        integrations: `/projects/${projectId}/settings/integrations`,
      },
    }),
  },
} as const;

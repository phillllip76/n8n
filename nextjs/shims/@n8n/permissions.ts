export function getResourcePermissions(_scopes?: unknown) {
  return {
    workflow: { create: true, read: true, update: true, delete: true },
  } as const;
}


import { create } from 'zustand';

export type ProjectRole = 'project:viewer' | 'project:editor' | 'project:admin';

export interface RoleItem {
  role: ProjectRole | string;
}

export interface AllRolesMap {
  global: RoleItem[];
  project: RoleItem[];
  credential: RoleItem[];
  workflow: RoleItem[];
}

export interface RolesState {
  roles: AllRolesMap;
  projectRoleOrder: ProjectRole[];
}

export interface RolesSelectors {
  processedProjectRoles: () => AllRolesMap['project'];
  processedCredentialRoles: () => AllRolesMap['credential'];
  processedWorkflowRoles: () => AllRolesMap['workflow'];
}

export interface RolesActions {
  setRoles: (roles: AllRolesMap) => void;
}

export type RolesStore = RolesState & RolesSelectors & RolesActions;

export const useRolesStore = create<RolesStore>((set, get) => ({
  roles: {
    global: [],
    project: [],
    credential: [],
    workflow: [],
  },
  projectRoleOrder: ['project:viewer', 'project:editor', 'project:admin'],

  processedProjectRoles: () => {
    const orderMap = new Map(get().projectRoleOrder.map((r, idx) => [r, idx] as const));
    return get()
      .roles.project.filter((r) => orderMap.has(r.role as ProjectRole))
      .sort(
        (a, b) => (orderMap.get(a.role as ProjectRole) ?? 0) - (orderMap.get(b.role as ProjectRole) ?? 0),
      );
  },

  processedCredentialRoles: () => get().roles.credential.filter((r) => r.role !== 'credential:owner'),
  processedWorkflowRoles: () => get().roles.workflow.filter((r) => r.role !== 'workflow:owner'),

  setRoles: (roles: AllRolesMap) => set({ roles }),
}));

export default useRolesStore;


import { create } from 'zustand';

export interface PublicInstalledPackage {
  packageName: string;
  version?: string;
}

export interface CommunityNodesState {
  availablePackageCount: number;
  installedPackages: Record<string, PublicInstalledPackage>;
}

export interface CommunityNodesSelectors {
  getInstalledPackages: () => PublicInstalledPackage[];
  getInstalledPackage: (packageName: string) => PublicInstalledPackage | undefined;
}

export interface CommunityNodesActions {
  setInstalledPackages: (packages: PublicInstalledPackage[]) => void;
  removePackageByName: (name: string) => void;
  updatePackageObject: (pack: PublicInstalledPackage) => void;
}

export type CommunityNodesStore = CommunityNodesState & CommunityNodesSelectors & CommunityNodesActions;

export const useCommunityNodesStore = create<CommunityNodesStore>((set, get) => ({
  availablePackageCount: -1,
  installedPackages: {},

  getInstalledPackages: () => Object.values(get().installedPackages).sort((a, b) => a.packageName.localeCompare(b.packageName)),
  getInstalledPackage: (packageName: string) => get().installedPackages[packageName],

  setInstalledPackages: (packages) =>
    set({ installedPackages: packages.reduce((acc, p) => ((acc[p.packageName] = p), acc), {} as Record<string, PublicInstalledPackage>) }),

  removePackageByName: (name) => set((s) => {
    const { [name]: _removed, ...rest } = s.installedPackages;
    return { installedPackages: rest };
  }),

  updatePackageObject: (pack) => set((s) => ({ installedPackages: { ...s.installedPackages, [pack.packageName]: pack } })),
}));

export default useCommunityNodesStore;


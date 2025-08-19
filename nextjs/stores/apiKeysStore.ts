import { create } from 'zustand';

export interface ApiKey {
  id: string;
  label: string;
  createdAt: string;
  scopes: string[];
}

export interface ApiKeysState {
  apiKeys: ApiKey[];
  availableScopes: string[];
}

export interface ApiKeysSelectors {
  apiKeysSortByCreationDate: () => ApiKey[];
  apiKeysById: () => Record<string, ApiKey>;
}

export interface ApiKeysActions {
  setApiKeys: (keys: ApiKey[]) => void;
  setAvailableScopes: (scopes: string[]) => void;
  upsertApiKey: (key: ApiKey) => void;
  deleteApiKeyById: (id: string) => void;
  updateApiKeyById: (id: string, payload: { label?: string; scopes?: string[] }) => void;
}

export type ApiKeysStore = ApiKeysState & ApiKeysSelectors & ApiKeysActions;

export const useApiKeysStore = create<ApiKeysStore>((set, get) => ({
  apiKeys: [],
  availableScopes: [],

  apiKeysSortByCreationDate: () => [...get().apiKeys].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  apiKeysById: () => get().apiKeys.reduce((acc, key) => ((acc[key.id] = key), acc), {} as Record<string, ApiKey>),

  setApiKeys: (keys) => set({ apiKeys: keys }),
  setAvailableScopes: (scopes) => set({ availableScopes: scopes }),
  upsertApiKey: (key) => set((s) => ({ apiKeys: [...s.apiKeys.filter((k) => k.id !== key.id), key] })),
  deleteApiKeyById: (id) => set((s) => ({ apiKeys: s.apiKeys.filter((k) => k.id !== id) })),
  updateApiKeyById: (id, payload) =>
    set((s) => ({
      apiKeys: s.apiKeys.map((k) => (k.id === id ? { ...k, ...('label' in payload ? { label: payload.label! } : {}), ...('scopes' in payload ? { scopes: payload.scopes! } : {}) } : k)),
    })),
}));

export default useApiKeysStore;


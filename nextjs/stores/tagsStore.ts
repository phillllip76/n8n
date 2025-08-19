import { create } from 'zustand';

export interface TagItem {
  id: string;
  name: string;
  usageCount?: number;
}

export interface TagsState {
  tagsById: Record<string, TagItem>;
  loading: boolean;
  fetchedAll: boolean;
  fetchedUsageCount: boolean;
}

export interface TagsSelectors {
  allTags: () => TagItem[];
  isLoading: () => boolean;
  hasTags: () => boolean;
}

export interface TagsActions {
  setAllTags: (loadedTags: TagItem[]) => void;
  upsertTags: (toUpsertTags: TagItem[]) => void;
  deleteTag: (id: string) => void;
}

export type TagsStore = TagsState & TagsSelectors & TagsActions;

export const useTagsStore = create<TagsStore>((set, get) => ({
  tagsById: {},
  loading: false,
  fetchedAll: false,
  fetchedUsageCount: false,

  allTags: () => Object.values(get().tagsById).sort((a, b) => a.name.localeCompare(b.name)),
  isLoading: () => get().loading,
  hasTags: () => Object.keys(get().tagsById).length > 0,

  setAllTags: (loadedTags: TagItem[]) =>
    set({
      tagsById: loadedTags.reduce((acc, tag) => {
        acc[tag.id] = tag;
        return acc;
      }, {} as Record<string, TagItem>),
      fetchedAll: true,
    }),

  upsertTags: (toUpsertTags: TagItem[]) =>
    set((s) => {
      const next = { ...s.tagsById };
      for (const tag of toUpsertTags) {
        const existing = next[tag.id];
        next[tag.id] = existing ? { ...existing, ...tag } : tag;
      }
      return { tagsById: next };
    }),

  deleteTag: (id: string) =>
    set((s) => {
      const { [id]: _deleted, ...rest } = s.tagsById;
      return { tagsById: rest };
    }),
}));

export default useTagsStore;


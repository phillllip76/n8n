export function useI18n() {
  return {
    baseText: (key: string, _opts?: unknown) => key,
    nodeText: (_name: string) => ({ eventTriggerDescription: (_a: string, b: string) => b }),
  } as const;
}

export const i18n = { baseText: (k: string) => k } as const;

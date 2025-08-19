export function useRootStore() {
  return {
    instanceId: 'dev',
    baseUrl: '',
    restApiContext: {},
  } as const;
}


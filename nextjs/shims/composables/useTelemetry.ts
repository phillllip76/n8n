export function useTelemetry() {
  return {
    track: (_event: string, _props?: Record<string, unknown>) => {},
  } as const;
}


import { create } from 'zustand';

export interface AuditLogsState {
  isEnterpriseAuditLogsFeatureEnabled: boolean;
}

export type AuditLogsStore = AuditLogsState;

export const useAuditLogsStore = create<AuditLogsStore>(() => ({
  isEnterpriseAuditLogsFeatureEnabled: false,
}));

export default useAuditLogsStore;


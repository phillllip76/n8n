import { create } from 'zustand';

export enum LOGS_PANEL_STATE {
  CLOSED = 'CLOSED',
  ATTACHED = 'ATTACHED',
  FLOATING = 'FLOATING',
}

export enum LOG_DETAILS_PANEL_STATE {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  BOTH = 'BOTH',
}

export type LogDetailsPanelState = LOG_DETAILS_PANEL_STATE;

export interface LogsState {
  isOpen: boolean;
  preferPoppedOut: boolean;
  height: number;
  detailsState: LOG_DETAILS_PANEL_STATE;
  detailsStateSubNode: LOG_DETAILS_PANEL_STATE;
  isLogSelectionSyncedWithCanvas: boolean;
  isSubNodeSelected: boolean;
}

export interface LogsSelectors {
  state: () => LOGS_PANEL_STATE;
  isPanelOpen: () => boolean;
  effectiveDetailsState: () => LOG_DETAILS_PANEL_STATE;
}

export interface LogsActions {
  setHeight: (value: number) => void;
  toggleOpen: (value?: boolean) => void;
  setPreferPoppedOut: (value: boolean) => void;
  setSubNodeSelected: (value: boolean) => void;
  toggleInputOpen: (open?: boolean) => void;
  toggleOutputOpen: (open?: boolean) => void;
  toggleLogSelectionSync: (value?: boolean) => void;
}

export type LogsStore = LogsState & LogsSelectors & LogsActions;

export const useLogsStore = create<LogsStore>((set, get) => ({
  isOpen: false,
  preferPoppedOut: false,
  height: 0,
  detailsState: LOG_DETAILS_PANEL_STATE.OUTPUT,
  detailsStateSubNode: LOG_DETAILS_PANEL_STATE.BOTH,
  isLogSelectionSyncedWithCanvas: true,
  isSubNodeSelected: false,

  state: () => {
    const { isOpen, preferPoppedOut } = get();
    if (!isOpen) return LOGS_PANEL_STATE.CLOSED;
    return preferPoppedOut ? LOGS_PANEL_STATE.FLOATING : LOGS_PANEL_STATE.ATTACHED;
  },

  isPanelOpen: () => get().state() !== LOGS_PANEL_STATE.CLOSED,

  effectiveDetailsState: () => {
    const { isSubNodeSelected, detailsState, detailsStateSubNode } = get();
    return isSubNodeSelected ? detailsStateSubNode : detailsState;
  },

  setHeight: (value: number) => set({ height: value }),

  toggleOpen: (value?: boolean) => set((s) => ({ isOpen: value ?? !s.isOpen })),

  setPreferPoppedOut: (value: boolean) => set({ preferPoppedOut: value }),

  setSubNodeSelected: (value: boolean) => set({ isSubNodeSelected: value }),

  toggleInputOpen: (open?: boolean) => {
    const isSub = get().isSubNodeSelected;
    const current = isSub ? get().detailsStateSubNode : get().detailsState;
    const statesWithInput = [LOG_DETAILS_PANEL_STATE.INPUT, LOG_DETAILS_PANEL_STATE.BOTH];
    const wasOpen = statesWithInput.includes(current);
    if (open === wasOpen) return;
    const next = wasOpen ? LOG_DETAILS_PANEL_STATE.OUTPUT : LOG_DETAILS_PANEL_STATE.BOTH;
    if (isSub) set({ detailsStateSubNode: next });
    else set({ detailsState: next });
  },

  toggleOutputOpen: (open?: boolean) => {
    const isSub = get().isSubNodeSelected;
    const current = isSub ? get().detailsStateSubNode : get().detailsState;
    const statesWithOutput = [LOG_DETAILS_PANEL_STATE.OUTPUT, LOG_DETAILS_PANEL_STATE.BOTH];
    const wasOpen = statesWithOutput.includes(current);
    if (open === wasOpen) return;
    const next = wasOpen ? LOG_DETAILS_PANEL_STATE.INPUT : LOG_DETAILS_PANEL_STATE.BOTH;
    if (isSub) set({ detailsStateSubNode: next });
    else set({ detailsState: next });
  },

  toggleLogSelectionSync: (value?: boolean) =>
    set((s) => ({ isLogSelectionSyncedWithCanvas: value ?? !s.isLogSelectionSyncedWithCanvas })),
}));

export default useLogsStore;


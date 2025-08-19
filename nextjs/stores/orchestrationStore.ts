import { create } from 'zustand';
import type { WorkerStatus } from '@n8n/api-types';
import { useRootStore } from '../shims/@n8n/stores/useRootStore';
import { sendGetWorkerStatus } from '@n8n/rest-api-client/api/orchestration';

export const WORKER_HISTORY_LENGTH = 100;
const STALE_MS = 120 * 1000;

export interface WorkerHistoryItem {
  timestamp: number;
  data: WorkerStatus;
}

export interface OrchestrationState {
  initialStatusReceived: boolean;
  workers: { [id: string]: WorkerStatus };
  workersHistory: { [id: string]: WorkerHistoryItem[] };
  workersLastUpdated: { [id: string]: number };
  statusInterval: NodeJS.Timeout | null;
}

interface OrchestrationActions {
  updateWorkerStatus: (data: WorkerStatus) => void;
  removeStaleWorkers: () => void;
  startWorkerStatusPolling: () => void;
  stopWorkerStatusPolling: () => void;
  getWorkerLastUpdated: (workerId: string) => number;
  getWorkerStatus: (workerId: string) => WorkerStatus | undefined;
  getWorkerStatusHistory: (workerId: string) => WorkerHistoryItem[];
}

export type OrchestrationStore = OrchestrationState & OrchestrationActions;

export const useOrchestrationStore = create<OrchestrationStore>((set, get) => ({
  initialStatusReceived: false,
  workers: {},
  workersHistory: {},
  workersLastUpdated: {},
  statusInterval: null,

  updateWorkerStatus: (data: WorkerStatus) => {
    const { workers, workersHistory, workersLastUpdated } = get();
    const nextWorkers = { ...workers, [data.senderId]: data };
    const historyForWorker = workersHistory[data.senderId] ?? [];
    const nextHistoryForWorker = [
      ...historyForWorker,
      { data, timestamp: Date.now() },
    ];
    if (nextHistoryForWorker.length > WORKER_HISTORY_LENGTH) {
      nextHistoryForWorker.shift();
    }

    set({
      workers: nextWorkers,
      workersHistory: { ...workersHistory, [data.senderId]: nextHistoryForWorker },
      workersLastUpdated: { ...workersLastUpdated, [data.senderId]: Date.now() },
      initialStatusReceived: true,
    });
  },

  removeStaleWorkers: () => {
    const { workers, workersHistory, workersLastUpdated } = get();
    const now = Date.now();
    const nextWorkers = { ...workers };
    const nextWorkersHistory = { ...workersHistory };
    const nextWorkersLastUpdated = { ...workersLastUpdated };
    for (const id in workersLastUpdated) {
      if (workersLastUpdated[id] + STALE_MS < now) {
        delete nextWorkers[id];
        delete nextWorkersHistory[id];
        delete nextWorkersLastUpdated[id];
      }
    }
    set({
      workers: nextWorkers,
      workersHistory: nextWorkersHistory,
      workersLastUpdated: nextWorkersLastUpdated,
    });
  },

  startWorkerStatusPolling: () => {
    const { statusInterval } = get();
    if (statusInterval) return;
    const rootStore = useRootStore();
    const interval = setInterval(async () => {
      try {
        await sendGetWorkerStatus((rootStore as any).restApiContext);
      } catch {
        // ignore in shim
      }
      get().removeStaleWorkers();
    }, 1000);
    set({ statusInterval: interval });
  },

  stopWorkerStatusPolling: () => {
    const { statusInterval } = get();
    if (statusInterval) {
      clearInterval(statusInterval);
      set({ statusInterval: null });
    }
  },

  getWorkerLastUpdated: (workerId: string) => get().workersLastUpdated[workerId] ?? 0,
  getWorkerStatus: (workerId: string) => get().workers[workerId],
  getWorkerStatusHistory: (workerId: string) => get().workersHistory[workerId] ?? [],
}));

export default useOrchestrationStore;


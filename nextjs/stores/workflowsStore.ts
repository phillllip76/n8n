import { create } from 'zustand';

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  parameters: Record<string, any>;
}

export interface WorkflowsState {
  workflowId?: string;
  nodesByName: Record<string, WorkflowNode>;
}

export interface WorkflowsSelectors {
  getNodeByName: (name: string) => WorkflowNode | undefined;
}

export interface WorkflowsActions {
  setWorkflowId: (id: string | undefined) => void;
  upsertNodes: (nodes: WorkflowNode[]) => void;
}

export type WorkflowsStore = WorkflowsState & WorkflowsSelectors & WorkflowsActions;

export const useWorkflowsStore = create<WorkflowsStore>((set, get) => ({
  workflowId: undefined,
  nodesByName: {},

  getNodeByName: (name: string) => get().nodesByName[name],

  setWorkflowId: (id) => set({ workflowId: id }),
  upsertNodes: (nodes) =>
    set((s) => ({
      nodesByName: nodes.reduce((acc, n) => {
        acc[n.name] = n;
        return acc;
      }, { ...s.nodesByName } as Record<string, WorkflowNode>),
    })),
}));

export default useWorkflowsStore;


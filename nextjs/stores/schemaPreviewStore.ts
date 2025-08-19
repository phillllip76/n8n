import { create } from 'zustand';
import type { JSONSchema7 } from 'json-schema';
import * as schemaPreviewApi from '@/shims/api/schemaPreview';
import { useRootStore } from '../shims/@n8n/stores/useRootStore';
import { useTelemetry } from '../shims/composables/useTelemetry';
import { useWorkflowsStore } from './workflowsStore';
import { generateJsonSchema } from '@/utils/jsonSchema';

export type Result<T, E> = { ok: true; result: T } | { ok: false; error: E };

export interface SchemaPreviewState {
  schemaPreviews: Map<string, Result<JSONSchema7, Error>>;
}

export interface SchemaPreviewActions {
  getSchemaPreview: (options: schemaPreviewApi.GetSchemaPreviewOptions) => Promise<Result<JSONSchema7, Error>>;
  trackSchemaPreviewExecution: (pushEvent: {
    data: { executionStatus: 'success' | 'error'; data?: any };
    nodeName: string;
  }) => Promise<void>;
}

export type SchemaPreviewStore = SchemaPreviewState & SchemaPreviewActions;

function getSchemaPreviewKey(options: schemaPreviewApi.GetSchemaPreviewOptions) {
  const { nodeType, version, resource, operation } = options;
  return `${nodeType}_${version}_${resource?.toString() ?? 'all'}_${operation?.toString() ?? 'all'}`;
}

export const useSchemaPreviewStore = create<SchemaPreviewStore>(() => ({
  schemaPreviews: new Map(),

  async getSchemaPreview(options) {
    const key = getSchemaPreviewKey(options);
    const cache = useSchemaPreviewStore.getState().schemaPreviews;
    const cached = cache.get(key);
    if (cached) return cached;
    try {
      const preview = await schemaPreviewApi.getSchemaPreview(useRootStore().baseUrl, options);
      const result: Result<JSONSchema7, Error> = { ok: true, result: preview };
      cache.set(key, result);
      return result;
    } catch (error) {
      const result: Result<JSONSchema7, Error> = { ok: false, error: error as Error };
      cache.set(key, result);
      return result;
    }
  },

  async trackSchemaPreviewExecution(pushEvent) {
    const cache = useSchemaPreviewStore.getState().schemaPreviews;
    if (cache.size === 0 || pushEvent.data.executionStatus !== 'success') return;
    const workflowsStore = useWorkflowsStore.getState();
    const node = workflowsStore.getNodeByName(pushEvent.nodeName);
    if (!node) return;
    const result = cache.get(
      getSchemaPreviewKey({ nodeType: node.type, version: node.typeVersion, resource: node.parameters.resource, operation: node.parameters.operation }),
    );
    if (!result || !('ok' in result) || !result.ok) return;
    const telemetry = useTelemetry();
    telemetry.track('User executed node with schema preview', {
      node_id: node.id,
      node_type: node.type,
      node_version: node.typeVersion,
      node_resource: node.parameters.resource,
      node_operation: node.parameters.operation,
      schema_preview: JSON.stringify(result.result),
      output_schema: JSON.stringify(generateJsonSchema(pushEvent.data.data?.main?.[0]?.[0]?.json)),
      workflow_id: workflowsStore.workflowId,
    });
  },
}));

export default useSchemaPreviewStore;


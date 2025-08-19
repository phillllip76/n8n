import type { JSONSchema7 } from 'json-schema';

export interface GetSchemaPreviewOptions {
  nodeType: string;
  version: number;
  operation?: string | number;
  resource?: string | number;
}

export async function getSchemaPreview(_baseUrl: string, _options: GetSchemaPreviewOptions): Promise<JSONSchema7> {
  return { type: 'object', properties: {} } as JSONSchema7;
}


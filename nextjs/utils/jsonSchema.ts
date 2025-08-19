import type { JSONSchema7 } from 'json-schema';

export function generateJsonSchema(_value: unknown): JSONSchema7 {
  return { type: 'object', properties: {} } as JSONSchema7;
}


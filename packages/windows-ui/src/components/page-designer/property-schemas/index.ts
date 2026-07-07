import { builtInPropertySchemas } from './built-in'
import type { PropertySchemaField } from '../types'

const customSchemas = new Map<string, PropertySchemaField[]>()

export function registerPropertySchema(type: string, schema: PropertySchemaField[]) {
  customSchemas.set(type, schema)
}

export function getPropertySchema(type: string): PropertySchemaField[] | undefined {
  return customSchemas.get(type) ?? builtInPropertySchemas[type]
}

export function hasPropertySchema(type: string): boolean {
  return customSchemas.has(type) || type in builtInPropertySchemas
}

export function unregisterPropertySchema(type: string) {
  customSchemas.delete(type)
}

export * from './built-in'
export * from './common'

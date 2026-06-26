import { Knex } from 'knex'

export interface QueryCondition {
  field?: string
  op?: string
  value?: any
  logic?: 'and' | 'or'
  conditions?: QueryCondition[]
}

const STRING_OPS = ['eq', 'ne', 'like', 'notLike', 'startsWith', 'endsWith', 'in', 'notIn', 'isNull', 'isNotNull']
const NUMBER_OPS = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'isNull', 'isNotNull']
const DATE_OPS = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'isNull', 'isNotNull']
const SELECT_OPS = ['eq', 'ne', 'in', 'notIn', 'isNull', 'isNotNull']

export function parseFilters(filters: string): QueryCondition | QueryCondition[] | null {
  if (!filters) return null
  try {
    const parsed = JSON.parse(filters)
    return parsed
  } catch {
    return null
  }
}

export function isComplexCondition(condition: any): boolean {
  return condition && typeof condition === 'object' && !Array.isArray(condition) && condition.conditions
}

export function isSimpleCondition(condition: any): boolean {
  return condition && typeof condition === 'object' && condition.field
}

export function applyCondition(
  builder: Knex.QueryBuilder,
  condition: QueryCondition,
  resolveField: (field: string) => string,
  isRoot: boolean = true
) {
  if (isComplexCondition(condition)) {
    const logic = condition.logic || 'and'
    const conditions = condition.conditions || []
    if (!conditions.length) return

    const method = logic === 'or' ? 'orWhere' : 'andWhere'
    builder[method]((subBuilder) => {
      conditions.forEach((child) => applyCondition(subBuilder, child, resolveField, false))
    })
    return
  }

  if (isSimpleCondition(condition)) {
    applySimpleCondition(builder, condition, resolveField, isRoot)
  }
}

function applySimpleCondition(
  builder: Knex.QueryBuilder,
  condition: QueryCondition,
  resolveField: (field: string) => string,
  isRoot: boolean
) {
  const { field, op = 'eq', value } = condition
  if (!field) return

  const column = resolveField(field)

  const apply = (qb: Knex.QueryBuilder) => {
    switch (op) {
      case 'eq':
        qb.where(column, value)
        break
      case 'ne':
        qb.whereNot(column, value)
        break
      case 'like':
        qb.where(column, 'like', `%${value}%`)
        break
      case 'notLike':
        qb.whereNot(column, 'like', `%${value}%`)
        break
      case 'startsWith':
        qb.where(column, 'like', `${value}%`)
        break
      case 'endsWith':
        qb.where(column, 'like', `%${value}`)
        break
      case 'gt':
        qb.where(column, '>', value)
        break
      case 'gte':
        qb.where(column, '>=', value)
        break
      case 'lt':
        qb.where(column, '<', value)
        break
      case 'lte':
        qb.where(column, '<=', value)
        break
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          qb.whereBetween(column, [value[0], value[1]])
        }
        break
      case 'in':
        if (Array.isArray(value) && value.length) {
          qb.whereIn(column, value)
        }
        break
      case 'notIn':
        if (Array.isArray(value) && value.length) {
          qb.whereNotIn(column, value)
        }
        break
      case 'isNull':
        qb.whereNull(column)
        break
      case 'isNotNull':
        qb.whereNotNull(column)
        break
      default:
        qb.where(column, value)
    }
  }

  if (isRoot) {
    apply(builder)
  } else {
    builder.andWhere((qb) => apply(qb))
  }
}

export function getAvailableOperators(fieldType: string): string[] {
  switch (fieldType) {
    case 'string':
    case 'text':
      return STRING_OPS
    case 'number':
      return NUMBER_OPS
    case 'date':
    case 'datetime':
      return DATE_OPS
    case 'select':
    case 'radio':
    case 'checkbox':
    case 'ref':
      return SELECT_OPS
    default:
      return STRING_OPS
  }
}

import { db } from '../../db'
import { AppError } from '../../utils/response'
import * as XLSX from 'xlsx'
import { getModelByCode } from '../lowcode/lowcode.service'
import * as externalDatasourceService from '../external-datasource/external-datasource.service'

export interface ReportColumn {
  field: string
  label: string
  aggregate?: string
  format?: string
}

export interface ReportFilter {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'between'
  value: any
}

export interface ReportParam {
  name: string
  label: string
  type: 'string' | 'number' | 'date' | 'datetime' | 'select'
  defaultValue?: any
  options?: { label: string; value: any }[]
  dictCode?: string
}

export interface ReportJoin {
  modelCode: string
  localField: string
  foreignField: string
  alias: string
  displayField: string
}

export interface ReportConfig {
  columns: ReportColumn[]
  groupBy?: string[]
  filters?: ReportFilter[]
  joins?: ReportJoin[]
  params?: ReportParam[]
  externalDataSourceId?: number
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function parseConfig(report: any): ReportConfig {
  if (!report?.config) return { columns: [] }
  try {
    return typeof report.config === 'string' ? JSON.parse(report.config) : report.config
  } catch {
    return { columns: [] }
  }
}

export async function getReports() {
  return db('lowcode_reports').orderBy('id', 'desc')
}

export async function getReportByCode(code: string) {
  const report = await db('lowcode_reports').where({ code }).first()
  if (!report) throw new AppError('报表不存在', 404)
  return { ...report, config: parseConfig(report) }
}

export async function saveReport(data: any) {
  const code = safeCode(data.code || data.name)
  const config = typeof data.config === 'string' ? data.config : JSON.stringify(data.config || { columns: [] })

  const exists = await db('lowcode_reports').where({ code }).first()
  if (exists) {
    await db('lowcode_reports').where({ code }).update({
      name: data.name,
      model_code: data.modelCode,
      config,
      status: data.status ?? 1,
      update_time: db.fn.now()
    })
    return db('lowcode_reports').where({ code }).first()
  }

  const [id] = await db('lowcode_reports').insert({
    code,
    name: data.name,
    model_code: data.modelCode,
    config,
    status: data.status ?? 1
  })
  return db('lowcode_reports').where({ id }).first()
}

export async function deleteReport(id: number) {
  await db('lowcode_reports').where({ id }).del()
  return true
}

export async function executeReport(code: string, params: any = {}, user?: any) {
  const report = await getReportByCode(code)
  const config = report.config as ReportConfig

  // 外部数据源报表
  if (config.externalDataSourceId) {
    const ctx = buildExternalCtx(params)
    const rows = await externalDatasourceService.executeExternalDataSource(config.externalDataSourceId, ctx)
    const list = Array.isArray(rows) ? rows : []
    return { report, config, list, params: config.params || [] }
  }

  const model = await getModelByCode(report.model_code)
  const fields = model.fields.filter((f: any) => f.status === 1)
  const fieldMap = new Map<string, any>(fields.map((f: any) => [f.field_name, f]))

  // 构建查询
  const selectColumns: string[] = []
  const aggregateColumns: any[] = []

  for (const col of config.columns || []) {
    if (col.aggregate && col.aggregate !== '') {
      aggregateColumns.push(db.raw(`${col.aggregate}(??.??) as ??`, [model.table_name, col.field, col.field]))
    } else {
      selectColumns.push(`${model.table_name}.${col.field}`)
    }
  }

  const groupByFields = config.groupBy || []
  for (const g of groupByFields) {
    if (!selectColumns.includes(`${model.table_name}.${g}`)) {
      selectColumns.push(`${model.table_name}.${g}`)
    }
  }

  const columns = [...selectColumns, ...aggregateColumns]
  if (!columns.length) {
    columns.push(`${model.table_name}.id`)
  }

  const builder = db(model.table_name).select(columns)

  // 固定过滤条件
  applyFilters(builder, config.filters || [], model.table_name, fieldMap)

  // 动态参数过滤
  const dynamicFilters = params.filters || []
  applyFilters(builder, dynamicFilters, model.table_name, fieldMap)

  // 数据权限
  await applyDataPermission(builder, model, user)

  // 分组
  if (aggregateColumns.length && groupByFields.length) {
    builder.groupBy(groupByFields.map((g) => `${model.table_name}.${g}`))
  }

  // 排序
  if (groupByFields.length) {
    builder.orderBy(groupByFields.map((g) => ({ column: `${model.table_name}.${g}`, order: 'asc' })))
  } else if (config.columns?.length) {
    builder.orderBy(`${model.table_name}.${config.columns[0].field}`, 'desc')
  } else {
    builder.orderBy(`${model.table_name}.id`, 'desc')
  }

  const list = await builder

  return {
    report,
    config,
    list,
    params: config.params || []
  }
}

function buildExternalCtx(params: any) {
  const ctx: Record<string, any> = {}
  if (params?.filters?.length) {
    for (const f of params.filters) {
      if (f.field && f.value !== undefined) ctx[f.field] = f.value
    }
  }
  if (params?.params) {
    Object.assign(ctx, params.params)
  }
  return ctx
}

function applyFilters(builder: any, filters: ReportFilter[], tableName: string, fieldMap: Map<string, any>) {
  for (const filter of filters) {
    if (filter.value === undefined || filter.value === '' || filter.value === null) continue
    const columnName = `${tableName}.${filter.field}`

    switch (filter.operator) {
      case 'eq':
        builder.where(columnName, filter.value)
        break
      case 'ne':
        builder.whereNot(columnName, filter.value)
        break
      case 'gt':
        builder.where(columnName, '>', filter.value)
        break
      case 'gte':
        builder.where(columnName, '>=', filter.value)
        break
      case 'lt':
        builder.where(columnName, '<', filter.value)
        break
      case 'lte':
        builder.where(columnName, '<=', filter.value)
        break
      case 'like':
        builder.where(columnName, 'like', `%${filter.value}%`)
        break
      case 'between':
        if (Array.isArray(filter.value) && filter.value.length === 2) {
          builder.whereBetween(columnName, [filter.value[0], filter.value[1]])
        }
        break
      default:
        builder.where(columnName, filter.value)
    }
  }
}

async function applyDataPermission(builder: any, model: any, user?: any) {
  if (!user || !model.data_permission) return
  const isAdmin = user?.roleId === 1 || user?.permissions?.includes('*')
  if (isAdmin) return

  const permission = model.data_permission
  const type = typeof permission === 'string' ? permission : permission.type

  if (type === 'self') {
    builder.where('create_by', user.id)
  } else if (type === 'dept') {
    builder.where('dept_id', user.deptId || null)
  } else if (type === 'dept_and_child') {
    const deptIds = await getChildDeptIds(user.deptId)
    builder.whereIn('dept_id', deptIds.length ? deptIds : [null])
  }
}

async function getChildDeptIds(parentId?: number): Promise<number[]> {
  if (!parentId) return []
  const result = new Set<number>([parentId])
  const queue = [parentId]
  while (queue.length) {
    const current = queue.shift()!
    const children = await db('depts').where({ parent_id: current, status: 1 }).select('id')
    for (const child of children) {
      if (!result.has(child.id)) {
        result.add(child.id)
        queue.push(child.id)
      }
    }
  }
  return Array.from(result)
}

export async function exportReportExcel(code: string, params: any = {}, user?: any) {
  const { report, config, list } = await executeReport(code, params, user)
  const model = await getModelByCode(report.model_code)
  const fields = model.fields.filter((f: any) => f.status === 1)
  const fieldMap = new Map<string, any>(fields.map((f: any) => [f.field_name, f]))

  const headers = (config.columns || []).map((col: ReportColumn) => col.label || col.field)
  const rows = list.map((row: any) => {
    return (config.columns || []).map((col: ReportColumn) => {
      const value = row[col.field]
      if (value === undefined || value === null) return ''
      const field = fieldMap.get(col.field) as any
      if (field?.dict_code) {
        return value
      }
      switch (col.format) {
        case 'date':
          return String(value).slice(0, 10)
        case 'datetime':
          return String(value).replace('T', ' ').slice(0, 19)
        case 'money':
          return Number(value).toFixed(2)
        case 'percent':
          return (Number(value) * 100).toFixed(2) + '%'
        case 'boolean':
          return value ? '是' : '否'
        default:
          return value
      }
    })
  })

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, report.name || '报表')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

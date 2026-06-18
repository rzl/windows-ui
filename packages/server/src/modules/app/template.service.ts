import { db } from '../../db'
import { AppError } from '../../utils/response'
import * as fs from 'fs'
import * as path from 'path'

const TEMPLATES_DIR = path.join(__dirname, '..', '..', '..', 'templates', 'apps')

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function safeTableName(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function safeFieldName(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function parseJson(value: any) {
  if (!value) return null
  return typeof value === 'string' ? JSON.parse(value) : value
}

function stringifyJson(value: any) {
  return typeof value === 'string' ? value : JSON.stringify(value || {})
}

// ---------- 模板加载 ----------

export function listTemplates() {
  if (!fs.existsSync(TEMPLATES_DIR)) return []

  return fs
    .readdirSync(TEMPLATES_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(TEMPLATES_DIR, file), 'utf-8')
      const data = JSON.parse(raw)
      return {
        code: data.template || file.replace('.json', ''),
        name: data.app?.name || data.template,
        category: data.app?.category || '未分类',
        icon: data.app?.icon || 'app',
        description: data.app?.description || '',
        version: data.version || '1.0.0'
      }
    })
}

function loadTemplate(templateCode: string) {
  const filePath = path.join(TEMPLATES_DIR, `${templateCode}.json`)
  if (!fs.existsSync(filePath)) throw new AppError('模板不存在', 404)
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

// ---------- Code 去重 ----------

async function uniqueCode(trx: any, baseCode: string): Promise<string> {
  let code = safeCode(baseCode)
  let candidate = code
  let index = 1

  while (await trx('lowcode_apps').where({ code: candidate }).first()) {
    candidate = `${code}_${index}`
    index++
  }

  return candidate
}

async function uniqueModelCode(trx: any, baseCode: string): Promise<string> {
  let code = safeCode(baseCode)
  let candidate = code
  let index = 1

  while (await trx('lowcode_models').where({ code: candidate }).first()) {
    candidate = `${code}_${index}`
    index++
  }

  return candidate
}

async function uniqueTableName(trx: any, baseTableName: string): Promise<string> {
  let tableName = safeTableName(baseTableName)
  let candidate = tableName
  let index = 1

  while (await trx('lowcode_models').where({ table_name: candidate }).first()) {
    candidate = `${tableName}_${index}`
    index++
  }

  return candidate
}

async function uniqueReportCode(trx: any, baseCode: string): Promise<string> {
  let code = safeCode(baseCode)
  let candidate = code
  let index = 1

  while (await trx('lowcode_reports').where({ code: candidate }).first()) {
    candidate = `${code}_${index}`
    index++
  }

  return candidate
}

async function uniqueDashboardCode(trx: any, baseCode: string): Promise<string> {
  let code = safeCode(baseCode)
  let candidate = code
  let index = 1

  while (await trx('dashboards').where({ code: candidate }).first()) {
    candidate = `${code}_${index}`
    index++
  }

  return candidate
}

async function uniquePrintCode(trx: any, baseCode: string): Promise<string> {
  let code = safeCode(baseCode)
  let candidate = code
  let index = 1

  while (await trx('print_templates').where({ code: candidate }).first()) {
    candidate = `${code}_${index}`
    index++
  }

  return candidate
}

async function uniqueFlowCode(trx: any, baseCode: string): Promise<string> {
  let code = safeCode(baseCode)
  let candidate = code
  let index = 1

  while (await trx('flow_definitions').where({ code: candidate }).first()) {
    candidate = `${code}_${index}`
    index++
  }

  return candidate
}

async function uniqueDataSourceCode(trx: any, baseCode: string): Promise<string> {
  let code = safeCode(baseCode)
  let candidate = code
  let index = 1

  while (await trx('external_data_sources').where({ code: candidate }).first()) {
    candidate = `${code}_${index}`
    index++
  }

  return candidate
}

async function uniqueDictCode(trx: any, baseCode: string): Promise<string> {
  let code = safeCode(baseCode)
  let candidate = code
  let index = 1

  while (await trx('dicts').where({ code: candidate }).first()) {
    candidate = `${code}_${index}`
    index++
  }

  return candidate
}

async function uniqueCodingRuleCode(trx: any, baseCode: string): Promise<string> {
  let code = safeCode(baseCode)
  let candidate = code
  let index = 1

  while (await trx('lowcode_coding_rules').where({ code: candidate }).first()) {
    candidate = `${code}_${index}`
    index++
  }

  return candidate
}

async function uniqueValidationRuleCode(trx: any, baseCode: string): Promise<string> {
  let code = safeCode(baseCode)
  let candidate = code
  let index = 1

  while (await trx('lowcode_validation_rules').where({ code: candidate }).first()) {
    candidate = `${code}_${index}`
    index++
  }

  return candidate
}

// ---------- 物理表操作 ----------

async function createPhysicalTable(trx: any, tableName: string) {
  const exists = await trx.schema.hasTable(tableName)
  if (exists) return

  await trx.schema.createTable(tableName, (table: any) => {
    table.increments('id').primary()
    table.integer('create_by').unsigned().nullable()
    table.integer('update_by').unsigned().nullable()
    table.integer('dept_id').unsigned().nullable()
    table.timestamp('create_time').defaultTo(trx.fn.now())
    table.timestamp('update_time').defaultTo(trx.fn.now())
  })
}

async function addPhysicalColumn(trx: any, tableName: string, columnName: string, fieldData: any) {
  const exists = await trx.schema.hasColumn(tableName, columnName)
  if (exists) return

  await trx.schema.table(tableName, (table: any) => {
    switch (fieldData.type) {
      case 'string':
      case 'select':
      case 'radio':
      case 'date':
        table.string(columnName, fieldData.length || 255)
        break
      case 'text':
      case 'textarea':
      case 'rich-text':
        table.text(columnName)
        break
      case 'number':
      case 'integer':
        table.integer(columnName)
        break
      case 'boolean':
      case 'switch':
        table.tinyint(columnName)
        break
      case 'datetime':
        table.datetime(columnName)
        break
      case 'ref':
      case 'upload':
      case 'cascader':
        table.integer(columnName)
        break
      default:
        table.string(columnName, 255)
    }
  })
}

// ---------- 安装模板 ----------

export interface InstallTemplateOptions {
  code?: string
  name?: string
  autoPublish?: boolean
}

export async function installTemplate(templateCode: string, options: InstallTemplateOptions = {}, operator?: any) {
  const template = loadTemplate(templateCode)
  const appCode = options.code ? safeCode(options.code) : template.app?.code || template.template

  return db.transaction(async (trx) => {
    // 1. 生成应用编码
    const finalAppCode = await uniqueCode(trx, appCode)
    const finalAppName = options.name || template.app?.name || finalAppCode

    // 2. 建立 code 映射表
    const codeMap: Record<string, string> = {}
    const modelCodeMap: Record<string, number> = {}
    const dictCodeMap: Record<string, number> = {}
    const dataSourceIdMap: Record<number, number> = {}
    const codingRuleCodeMap: Record<string, string> = {}
    const validationRuleCodeMap: Record<string, string> = {}

    // 3. 创建字典
    const dicts = template.dicts || []
    for (const dict of dicts) {
      const newCode = await uniqueDictCode(trx, dict.code)
      codeMap[dict.code] = newCode

      const [dictId] = await trx('dicts').insert({
        name: dict.name,
        code: newCode,
        description: dict.description || '',
        category_id: dict.categoryId || null,
        status: dict.status ?? 1
      })

      dictCodeMap[dict.code] = dictId

      if (dict.items?.length) {
        await trx('dict_items').insert(
          dict.items.map((item: any, index: number) => ({
            dict_id: dictId,
            label: item.label,
            value: item.value,
            sort: item.sort ?? index,
            status: item.status ?? 1
          }))
        )
      }
    }

    // 4. 创建编码规则
    const codingRules = template.codingRules || []
    for (const rule of codingRules) {
      const newCode = await uniqueCodingRuleCode(trx, rule.code)
      codeMap[rule.code] = newCode
      codingRuleCodeMap[rule.code] = newCode

      await trx('lowcode_coding_rules').insert({
        code: newCode,
        name: rule.name,
        prefix: rule.prefix,
        date_format: rule.dateFormat || 'YYYYMMDD',
        seq_length: rule.seqLength ?? 4,
        current_seq: 0,
        status: rule.status ?? 1
      })
    }

    // 5. 创建校验规则
    const validationRules = template.validationRules || []
    for (const rule of validationRules) {
      const newCode = await uniqueValidationRuleCode(trx, rule.code)
      codeMap[rule.code] = newCode
      validationRuleCodeMap[rule.code] = newCode

      await trx('lowcode_validation_rules').insert({
        code: newCode,
        name: rule.name,
        pattern: rule.pattern,
        message: rule.message,
        status: rule.status ?? 1
      })
    }

    // 6. 预生成模型 code 与 tableName 映射
    const models = template.models || []
    const tableNameMap: Record<string, string> = {}
    for (const model of models) {
      const newCode = await uniqueModelCode(trx, model.code)
      codeMap[model.code] = newCode

      const baseTableName = model.tableName
        ? safeTableName(model.tableName)
        : `lc_${newCode}`
      const newTableName = await uniqueTableName(trx, baseTableName)
      tableNameMap[model.code] = newTableName
    }

    // 7. 创建外部数据源
    const datasources = template.datasources || []
    for (const ds of datasources) {
      const newCode = await uniqueDataSourceCode(trx, ds.code)
      codeMap[ds.code] = newCode

      const [id] = await trx('external_data_sources').insert({
        code: newCode,
        name: ds.name,
        type: ds.type,
        config: stringifyJson(ds.config),
        description: ds.description || '',
        status: ds.status ?? 1
      })

      if (ds.id) dataSourceIdMap[ds.id] = id
    }

    // 8. 创建数据模型、字段、表单、列表
    for (const model of models) {
      const newCode = codeMap[model.code]
      const tableName = tableNameMap[model.code]

      const [modelId] = await trx('lowcode_models').insert({
        code: newCode,
        name: model.name,
        table_name: tableName,
        description: model.description || '',
        status: model.status ?? 1,
        enable_audit: model.enableAudit ? 1 : 0,
        data_permission: model.dataPermission || 'all'
      })

      modelCodeMap[model.code] = modelId
      await createPhysicalTable(trx, tableName)

      // 字段
      const fields = model.fields || []
      for (const field of fields) {
        const fieldName = safeFieldName(field.fieldName)
        await addPhysicalColumn(trx, tableName, fieldName, field)

        const [fieldId] = await trx('lowcode_fields').insert({
          model_id: modelId,
          field_name: fieldName,
          display_name: field.displayName,
          type: field.type || 'string',
          length: field.length ?? 255,
          required: field.required ? 1 : 0,
          default_value: field.defaultValue || null,
          default_value_type: field.defaultValueType || 'constant',
          default_value_expr: field.defaultValueExpr || null,
          options: field.options ? JSON.stringify(field.options) : null,
          validation_rule: field.validationRule ? validationRuleCodeMap[field.validationRule] || field.validationRule : null,
          dict_code: field.dictCode ? codeMap[field.dictCode] || field.dictCode : null,
          ref_model: field.refModel ? codeMap[field.refModel] || field.refModel : null,
          ref_display_field: field.refDisplayField || null,
          sort: field.sort ?? 0,
          status: field.status ?? 1
        })
      }

      // 表单
      if (model.form) {
        const formConfig = rewriteConfigCodes(model.form.config, codeMap, dataSourceIdMap)
        await trx('lowcode_forms').insert({
          model_id: modelId,
          name: model.form.name || '默认表单',
          config: stringifyJson(formConfig),
          status: model.form.status ?? 1
        })
      }

      // 列表
      if (model.table) {
        const tableConfig = rewriteConfigCodes(model.table.config, codeMap, dataSourceIdMap)
        await trx('lowcode_tables').insert({
          model_id: modelId,
          name: model.table.name || '默认列表',
          config: stringifyJson(tableConfig),
          status: model.table.status ?? 1
        })
      }
    }

    // 9. 创建流程
    const flows = template.flows || []
    for (const flow of flows) {
      const newCode = await uniqueFlowCode(trx, flow.code)
      codeMap[flow.code] = newCode

      const config = parseJson(flow.config)
      const rewrittenConfig = rewriteFlowConfig(config, codeMap)

      await trx('flow_definitions').insert({
        code: newCode,
        name: flow.name,
        model_code: flow.modelCode ? codeMap[flow.modelCode] || flow.modelCode : null,
        config: stringifyJson(rewrittenConfig),
        status: flow.status ?? 1
      })
    }

    // 10. 创建报表
    const reports = template.reports || []
    for (const report of reports) {
      const newCode = await uniqueReportCode(trx, report.code)
      codeMap[report.code] = newCode

      const config = parseJson(report.config)
      const rewrittenConfig = rewriteReportConfig(config, codeMap, dataSourceIdMap)

      await trx('lowcode_reports').insert({
        code: newCode,
        name: report.name,
        model_code: report.modelCode ? codeMap[report.modelCode] || report.modelCode : null,
        config: stringifyJson(rewrittenConfig),
        status: report.status ?? 1
      })
    }

    // 11. 创建仪表盘
    const dashboards = template.dashboards || []
    for (const dashboard of dashboards) {
      const newCode = await uniqueDashboardCode(trx, dashboard.code)
      codeMap[dashboard.code] = newCode

      const config = parseJson(dashboard.config)
      const rewrittenConfig = rewriteDashboardConfig(config, codeMap, dataSourceIdMap)

      await trx('dashboards').insert({
        code: newCode,
        name: dashboard.name,
        config: stringifyJson(rewrittenConfig),
        status: dashboard.status ?? 1
      })
    }

    // 12. 创建打印模板
    const prints = template.prints || []
    for (const print of prints) {
      const newCode = await uniquePrintCode(trx, print.code)
      codeMap[print.code] = newCode

      const config = parseJson(print.config)
      const rewrittenConfig = rewritePrintConfig(config, codeMap)

      await trx('print_templates').insert({
        code: newCode,
        name: print.name,
        model_code: print.modelCode ? codeMap[print.modelCode] || print.modelCode : null,
        paper_size: print.paperSize || 'A4',
        orientation: print.orientation || 'portrait',
        config: stringifyJson(rewrittenConfig),
        page_style: stringifyJson(print.pageStyle || {}),
        status: print.status ?? 1
      })
    }

    // 13. 创建应用
    const [appId] = await trx('lowcode_apps').insert({
      code: finalAppCode,
      name: finalAppName,
      category: template.app?.category || '',
      icon: template.app?.icon || 'app',
      description: template.app?.description || '',
      status: options.autoPublish !== false ? 1 : 0,
      is_market: 0
    })

    // 14. 创建应用项
    const items = template.items || []
    if (items.length) {
      await trx('lowcode_app_items').insert(
        items.map((item: any, index: number) => ({
          app_id: appId,
          type: item.type,
          ref_code: item.refCode ? codeMap[item.refCode] || item.refCode : item.refCode,
          ref_name: item.refName || '',
          sort: item.sort ?? index
        }))
      )
    }

    // 15. 创建并发布版本快照
    const snapshot = JSON.stringify({
      app: {
        code: finalAppCode,
        name: finalAppName,
        category: template.app?.category || '',
        icon: template.app?.icon || 'app',
        description: template.app?.description || '',
        status: options.autoPublish !== false ? 1 : 0,
        is_market: 0
      },
      items: items.map((item: any) => ({
        type: item.type,
        refCode: item.refCode ? codeMap[item.refCode] || item.refCode : item.refCode,
        refName: item.refName || '',
        sort: item.sort ?? 0
      }))
    })

    const [versionId] = await trx('lowcode_app_versions').insert({
      app_id: appId,
      version: template.version || '1.0.0',
      snapshot,
      description: '从模板安装',
      is_published: options.autoPublish !== false ? 1 : 0
    })

    if (options.autoPublish !== false) {
      await trx('lowcode_apps').where({ id: appId }).update({
        published_version_id: versionId,
        update_time: trx.fn.now()
      })
    }

    return {
      appId,
      code: finalAppCode,
      name: finalAppName,
      versionId,
      autoPublish: options.autoPublish !== false
    }
  })
}

// ---------- 配置引用重写 ----------

function rewriteConfigCodes(config: any, codeMap: Record<string, string>, dataSourceIdMap: Record<number, number>): any {
  if (!config || typeof config !== 'object') return config

  if (Array.isArray(config)) {
    return config.map((item) => rewriteConfigCodes(item, codeMap, dataSourceIdMap))
  }

  const result: any = {}
  for (const [key, value] of Object.entries(config)) {
    if (key === 'dictCode' && typeof value === 'string' && codeMap[value]) {
      result[key] = codeMap[value]
    } else if (key === 'refModel' && typeof value === 'string' && codeMap[value]) {
      result[key] = codeMap[value]
    } else if (key === 'codingRule' && typeof value === 'string' && codeMap[value]) {
      result[key] = codeMap[value]
    } else if (key === 'validationRule' && typeof value === 'string' && codeMap[value]) {
      result[key] = codeMap[value]
    } else if (key === 'externalDataSourceId' && typeof value === 'number' && dataSourceIdMap[value]) {
      result[key] = dataSourceIdMap[value]
    } else if (typeof value === 'object' && value !== null) {
      result[key] = rewriteConfigCodes(value, codeMap, dataSourceIdMap)
    } else {
      result[key] = value
    }
  }

  return result
}

function rewriteFlowConfig(config: any, codeMap: Record<string, string>): any {
  return rewriteConfigCodes(config, codeMap, {})
}

function rewriteReportConfig(config: any, codeMap: Record<string, string>, dataSourceIdMap: Record<number, number>): any {
  if (!config || typeof config !== 'object') return config

  const result = rewriteConfigCodes(config, codeMap, dataSourceIdMap)

  // 重写 joins 中的 modelCode
  if (result.joins?.length) {
    result.joins = result.joins.map((join: any) => ({
      ...join,
      modelCode: join.modelCode && codeMap[join.modelCode] ? codeMap[join.modelCode] : join.modelCode
    }))
  }

  return result
}

function rewriteDashboardConfig(config: any, codeMap: Record<string, string>, dataSourceIdMap: Record<number, number>): any {
  if (!config || typeof config !== 'object') return config

  // 重写 SQL 中可能引用的物理表名（简单替换）
  const result = rewriteConfigCodes(config, codeMap, dataSourceIdMap)

  if (result.dataSource?.sql && typeof result.dataSource.sql === 'string') {
    for (const [oldCode, newCode] of Object.entries(codeMap)) {
      // 替换形如 lc_oldCode 的表名
      const oldTablePattern = new RegExp(`\\blc_${oldCode}\\b`, 'g')
      result.dataSource.sql = result.dataSource.sql.replace(oldTablePattern, `lc_${newCode}`)
      // 替换裸 oldCode（用于模型名引用场景）
      const oldCodePattern = new RegExp(`\\b${oldCode}\\b`, 'g')
      result.dataSource.transformScript = result.dataSource.transformScript?.replace(oldCodePattern, newCode)
    }
  }

  return result
}

function rewritePrintConfig(config: any, codeMap: Record<string, string>): any {
  if (!config || typeof config !== 'object') return config

  const result = rewriteConfigCodes(config, codeMap, {})

  if (result.elements?.length) {
    result.elements = result.elements.map((element: any) => {
      if (element.tableConfig?.dataSource && typeof element.tableConfig.dataSource === 'object') {
        const ds = element.tableConfig.dataSource
        if (ds.modelCode && codeMap[ds.modelCode]) {
          ds.modelCode = codeMap[ds.modelCode]
        }
      }
      return element
    })
  }

  return result
}

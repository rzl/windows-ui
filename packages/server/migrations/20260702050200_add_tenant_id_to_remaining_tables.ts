import type { Knex } from 'knex'

// 业务元数据表（需加 tenant_id 并按租户隔离）
const metadataTables = [
  'dict_categories',
  'notices',
  'positions',
  'lowcode_models',
  'lowcode_fields',
  'lowcode_forms',
  'lowcode_tables',
  'lowcode_model_relations',
  'lowcode_model_versions',
  'lowcode_coding_rules',
  'lowcode_validation_rules',
  'lowcode_saved_queries',
  'lowcode_custom_apis',
  'lowcode_custom_api_versions',
  'custom_api_logs',
  'flow_definitions',
  'flow_instances',
  'flow_tasks',
  'flow_delegations',
  'message_templates',
  'messages',
  'operation_logs',
  'data_logs',
  'api_metrics',
  'sql_metrics',
  'alert_rules',
  'alert_records',
  'data_retention_policies',
  'homepage_configs',
  'dashboards',
  'lowcode_plugins',
  'print_templates',
  'lowcode_reports',
  'scheduled_tasks',
  'scheduled_task_logs',
  'external_data_sources',
  'data_audit_logs',
  'export_tasks',
  'lowcode_data_permission_rules',
  'role_data_permissions',
  'lowcode_field_permission_rules'
]

// code 类业务编码字段需改为 (tenant_id, code) 联合唯一
const codeUniqueTables: { table: string; columns: string[] }[] = [
  { table: 'dict_categories', columns: ['code'] },
  { table: 'positions', columns: ['code'] },
  { table: 'lowcode_models', columns: ['code'] },
  // lowcode_models 原 table_name 也是唯一，改为 (tenant_id, table_name)
  { table: 'lowcode_models', columns: ['table_name'] },
  { table: 'lowcode_model_relations', columns: ['code'] },
  { table: 'lowcode_coding_rules', columns: ['code'] },
  { table: 'lowcode_validation_rules', columns: ['code'] },
  { table: 'lowcode_custom_apis', columns: ['code'] },
  { table: 'lowcode_custom_apis', columns: ['path'] },
  { table: 'message_templates', columns: ['code'] },
  { table: 'homepage_configs', columns: ['code'] },
  { table: 'dashboards', columns: ['code'] },
  { table: 'lowcode_plugins', columns: ['code'] },
  { table: 'print_templates', columns: ['code'] },
  { table: 'lowcode_reports', columns: ['code'] },
  { table: 'scheduled_tasks', columns: ['code'] },
  { table: 'external_data_sources', columns: ['code'] },
  { table: 'lowcode_data_permission_rules', columns: ['code'] }
]

// 其他联合唯一约束调整
const otherUniqueChanges: { table: string; oldColumns: string[]; newColumns: string[] }[] = [
  { table: 'lowcode_fields', oldColumns: ['model_id', 'field_name'], newColumns: ['tenant_id', 'model_id', 'field_name'] },
  { table: 'lowcode_field_permission_rules', oldColumns: ['model_code', 'field_code'], newColumns: ['tenant_id', 'model_code', 'field_code'] },
  { table: 'role_data_permissions', oldColumns: ['role_id', 'data_permission_id'], newColumns: ['tenant_id', 'role_id', 'data_permission_id'] },
  { table: 'flow_definitions', oldColumns: ['code', 'version'], newColumns: ['tenant_id', 'code', 'version'] }
]

async function addTenantIdColumn(knex: Knex, tableName: string) {
  const exists = await knex.schema.hasColumn(tableName, 'tenant_id')
  if (!exists) {
    await knex.schema.table(tableName, (table) => {
      table.integer('tenant_id').notNullable().defaultTo(1).comment('租户 ID')
    })
  }
}

async function removeTenantIdColumn(knex: Knex, tableName: string) {
  const exists = await knex.schema.hasColumn(tableName, 'tenant_id')
  if (exists) {
    try {
      await knex.schema.table(tableName, (table) => {
        table.dropColumn('tenant_id')
      })
    } catch {
      // SQLite 不支持 drop column 时忽略
    }
  }
}

async function addCodeTenantUnique(knex: Knex, tableName: string, codeColumns: string[]) {
  const oldUniqueName = codeColumns.join('_')
  const newColumns = ['tenant_id', ...codeColumns]
  try {
    await knex.schema.table(tableName, (table) => {
      try { table.dropUnique(codeColumns, `${tableName}_${oldUniqueName}_unique`) } catch { /* 忽略 */ }
      try { table.dropUnique(codeColumns) } catch { /* 忽略 */ }
      table.unique(newColumns)
    })
  } catch {
    // 某些表可能没有唯一索引，忽略
  }
}

async function removeCodeTenantUnique(knex: Knex, tableName: string, codeColumns: string[]) {
  const newColumns = ['tenant_id', ...codeColumns]
  try {
    await knex.schema.table(tableName, (table) => {
      try { table.dropUnique(newColumns) } catch { /* 忽略 */ }
      table.unique(codeColumns)
    })
  } catch {
    // 忽略
  }
}

async function changeUnique(knex: Knex, tableName: string, oldColumns: string[], newColumns: string[]) {
  try {
    await knex.schema.table(tableName, (table) => {
      try { table.dropUnique(oldColumns) } catch { /* 忽略 */ }
      table.unique(newColumns)
    })
  } catch {
    // 忽略
  }
}

async function restoreUnique(knex: Knex, tableName: string, oldColumns: string[], newColumns: string[]) {
  try {
    await knex.schema.table(tableName, (table) => {
      try { table.dropUnique(newColumns) } catch { /* 忽略 */ }
      table.unique(oldColumns)
    })
  } catch {
    // 忽略
  }
}

async function addTenantIdToDynamicTables(knex: Knex) {
  const models = await knex('lowcode_models').select('table_name')
  for (const model of models) {
    const tableName = model.table_name
    if (!tableName) continue
    const hasTable = await knex.schema.hasTable(tableName)
    if (!hasTable) continue
    const hasColumn = await knex.schema.hasColumn(tableName, 'tenant_id')
    if (!hasColumn) {
      try {
        await knex.schema.table(tableName, (table) => {
          table.integer('tenant_id').notNullable().defaultTo(1)
        })
      } catch {
        // 动态表加列失败不阻塞整体迁移
      }
    }
  }
}

export async function up(knex: Knex): Promise<void> {
  // 1. 业务元数据表加 tenant_id
  for (const tableName of metadataTables) {
    await addTenantIdColumn(knex, tableName)
  }

  // 2. 调整 code 类唯一索引
  for (const { table, columns } of codeUniqueTables) {
    await addCodeTenantUnique(knex, table, columns)
  }

  // 3. 调整其他联合唯一索引
  for (const { table, oldColumns, newColumns } of otherUniqueChanges) {
    await changeUnique(knex, table, oldColumns, newColumns)
  }

  // 4. 低代码动态物理表补 tenant_id
  await addTenantIdToDynamicTables(knex)
}

export async function down(knex: Knex): Promise<void> {
  // 1. 恢复联合唯一索引
  for (const { table, oldColumns, newColumns } of otherUniqueChanges) {
    await restoreUnique(knex, table, oldColumns, newColumns)
  }

  // 2. 恢复 code 类唯一索引
  for (const { table, columns } of codeUniqueTables) {
    await removeCodeTenantUnique(knex, table, columns)
  }

  // 3. 业务元数据表移除 tenant_id
  for (const tableName of metadataTables) {
    await removeTenantIdColumn(knex, tableName)
  }

  // 4. 动态物理表移除 tenant_id（SQLite 可能不支持，忽略错误）
  const models = await knex('lowcode_models').select('table_name')
  for (const model of models) {
    const tableName = model.table_name
    if (!tableName) continue
    await removeTenantIdColumn(knex, tableName)
  }
}

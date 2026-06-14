import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const models = await knex('lowcode_models').select('table_name')
  for (const model of models) {
    const tableName = model.table_name
    const hasCreateBy = await knex.schema.hasColumn(tableName, 'create_by')
    const hasDeptId = await knex.schema.hasColumn(tableName, 'dept_id')
    if (!hasCreateBy || !hasDeptId) {
      await knex.schema.table(tableName, (table) => {
        if (!hasCreateBy) table.integer('create_by').unsigned().nullable()
        if (!hasDeptId) table.integer('dept_id').unsigned().nullable()
      })
    }
  }
}

export async function down(_knex: Knex): Promise<void> {
  // 不删除，避免数据丢失
}

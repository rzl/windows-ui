import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const models = await knex('lowcode_models').select('table_name')
  for (const model of models) {
    const tableName = model.table_name
    const hasUpdateBy = await knex.schema.hasColumn(tableName, 'update_by')
    if (!hasUpdateBy) {
      await knex.schema.table(tableName, (table) => {
        table.integer('update_by').unsigned().nullable()
      })
    }
  }
}

export async function down(_knex: Knex): Promise<void> {
  // 不删除，避免数据丢失
}

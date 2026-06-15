import type { Knex } from 'knex'

export async function up(knex: Knex) {
  const hasColumn = await knex.schema.hasColumn('lowcode_models', 'enable_audit')
  if (!hasColumn) {
    await knex.schema.table('lowcode_models', (table) => {
      table.tinyint('enable_audit').defaultTo(0).comment('是否启用数据审计')
    })
  }
}

export async function down(knex: Knex) {
  const hasColumn = await knex.schema.hasColumn('lowcode_models', 'enable_audit')
  if (hasColumn) {
    await knex.schema.table('lowcode_models', (table) => {
      table.dropColumn('enable_audit')
    })
  }
}

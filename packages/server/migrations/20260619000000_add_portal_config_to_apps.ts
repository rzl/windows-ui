import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('lowcode_apps', 'portal_config')
  if (!hasColumn) {
    await knex.schema.table('lowcode_apps', (table) => {
      table.text('portal_config').nullable().comment('应用门户配置 JSON')
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('lowcode_apps', 'portal_config')
  if (hasColumn) {
    await knex.schema.table('lowcode_apps', (table) => {
      table.dropColumn('portal_config')
    })
  }
}

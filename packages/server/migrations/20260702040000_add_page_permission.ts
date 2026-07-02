import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('lowcode_pages', 'permission')
  if (!hasColumn) {
    await knex.schema.table('lowcode_pages', (table) => {
      table.string('permission', 100).nullable().comment('页面权限码，为空表示不限制')
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('lowcode_pages', (table) => {
    table.dropColumn('permission')
  })
}

import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('lowcode_models', 'data_permission')
  if (!hasColumn) {
    await knex.schema.table('lowcode_models', (table) => {
      table.string('data_permission', 50).nullable()
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('lowcode_models', (table) => {
    table.dropColumn('data_permission')
  })
}

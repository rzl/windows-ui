import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('lowcode_fields', 'dict_code')
  if (!hasColumn) {
    await knex.schema.table('lowcode_fields', (table) => {
      table.string('dict_code', 64).nullable().index()
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('lowcode_fields', (table) => {
    table.dropColumn('dict_code')
  })
}

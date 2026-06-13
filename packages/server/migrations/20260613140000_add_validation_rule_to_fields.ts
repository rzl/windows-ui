import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('lowcode_fields', 'validation_rule')
  if (!hasColumn) {
    await knex.schema.table('lowcode_fields', (table) => {
      table.string('validation_rule', 64).nullable().index()
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('lowcode_fields', (table) => {
    table.dropColumn('validation_rule')
  })
}

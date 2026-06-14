import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lowcode_fields', (table) => {
    table.string('ref_model', 100).nullable()
    table.string('ref_display_field', 100).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lowcode_fields', (table) => {
    table.dropColumn('ref_model')
    table.dropColumn('ref_display_field')
  })
}

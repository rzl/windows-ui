import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lowcode_fields', (table) => {
    table.string('default_value_type', 50).nullable().defaultTo('constant')
    table.string('default_value_expr', 500).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lowcode_fields', (table) => {
    table.dropColumn('default_value_type')
    table.dropColumn('default_value_expr')
  })
}

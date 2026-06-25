import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lowcode_fields', (table) => {
    table.string('ref_relation', 50).nullable()
    table.json('ref_filter').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lowcode_fields', (table) => {
    table.dropColumn('ref_relation')
    table.dropColumn('ref_filter')
  })
}

import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('messages', (table) => {
    table.string('type', 20).notNullable().defaultTo('system')
    table.string('business_type', 20).nullable()
    table.string('business_key', 50).nullable()
    table.string('link', 255).nullable()
    table.string('sender_name', 50).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('messages', (table) => {
    table.dropColumn('type')
    table.dropColumn('business_type')
    table.dropColumn('business_key')
    table.dropColumn('link')
    table.dropColumn('sender_name')
  })
}

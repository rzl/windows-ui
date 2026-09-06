import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lowcode_custom_api_versions', (table) => {
    table.string('id', 36).primary()
    table.string('api_id', 36).notNullable().references('id').inTable('lowcode_custom_apis').onDelete('CASCADE')
    table.string('version', 50).notNullable()
    table.string('description', 500)
    table.text('snapshot').notNullable()
    table.tinyint('is_published').notNullable().defaultTo(0)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lowcode_custom_api_versions')
}

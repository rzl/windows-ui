import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('external_data_sources')
  if (hasTable) return

  await knex.schema.createTable('external_data_sources', (table) => {
    table.increments('id').primary()
    table.string('code', 100).notNullable().unique()
    table.string('name', 200).notNullable()
    table.string('type', 50).notNullable() // rest / mysql / postgresql
    table.json('config').notNullable()
    table.text('description').nullable()
    table.tinyint('status').defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('external_data_sources')
}

import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lowcode_reports', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 50).notNullable()
    table.string('model_code', 50).notNullable()
    table.text('config').notNullable()
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lowcode_reports')
}

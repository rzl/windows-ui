import type { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('lowcode_pages', (table) => {
    table.increments('id').primary()
    table.string('code', 100).notNullable().unique()
    table.string('name', 200).notNullable()
    table.text('description').nullable()
    table.text('config').notNullable().defaultTo('{}')
    table.tinyint('status').defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('lowcode_pages')
}

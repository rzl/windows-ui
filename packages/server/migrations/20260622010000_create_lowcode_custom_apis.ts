import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lowcode_custom_apis', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 50).notNullable()
    table.string('method', 10).notNullable().defaultTo('ALL')
    table.string('path', 255).nullable()
    table.text('description').nullable()
    table.text('script').notNullable()
    table.tinyint('status').notNullable().defaultTo(1)
    table.tinyint('is_public').notNullable().defaultTo(0)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lowcode_custom_apis')
}

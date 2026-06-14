import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('notices', (table) => {
    table.increments('id').primary()
    table.string('title', 100).notNullable()
    table.text('content')
    table.string('type', 30).notNullable().defaultTo('notice')
    table.tinyint('status').notNullable().defaultTo(1)
    table.integer('sort').notNullable().defaultTo(0)
    table.timestamp('publish_time').nullable()
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('notices')
}

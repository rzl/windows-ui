import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lowcode_saved_queries', (table) => {
    table.increments('id').primary()
    table.string('model_code', 100).notNullable()
    table.integer('user_id').unsigned().notNullable()
    table.string('name', 100).notNullable()
    table.text('config').notNullable()
    table.tinyint('is_default').notNullable().defaultTo(0)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lowcode_saved_queries')
}

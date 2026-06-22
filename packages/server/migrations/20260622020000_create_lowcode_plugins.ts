import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lowcode_plugins', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 100).notNullable()
    table.string('version', 20).notNullable().defaultTo('1.0.0')
    table.text('description')
    table.string('type', 20).notNullable().defaultTo('mixed')
    table.json('contributions')
    table.text('runtime_code')
    table.string('runtime_url', 500)
    table.json('config_schema')
    table.tinyint('status').notNullable().defaultTo(1)
    table.string('icon', 50)
    table.string('author', 100)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lowcode_plugins')
}

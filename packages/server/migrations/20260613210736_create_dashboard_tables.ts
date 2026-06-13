import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('homepage_configs', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique().defaultTo('default')
    table.string('name', 50).notNullable().defaultTo('默认首页')
    table.text('widgets').notNullable()
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('dashboards', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 50).notNullable()
    table.text('config').notNullable()
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('dashboards')
  await knex.schema.dropTableIfExists('homepage_configs')
}

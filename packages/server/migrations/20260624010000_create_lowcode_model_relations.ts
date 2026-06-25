import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lowcode_model_relations', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 100).notNullable()
    table.string('source_model', 100).notNullable()
    table.string('target_model', 100).notNullable()
    table.string('relation_type', 20).notNullable().defaultTo('belongsTo')
    table.string('source_field', 100).notNullable()
    table.string('target_field', 100).notNullable().defaultTo('id')
    table.string('junction_table', 100).nullable()
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lowcode_model_relations')
}

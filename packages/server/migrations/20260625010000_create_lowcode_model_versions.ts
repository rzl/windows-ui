import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lowcode_model_versions', (table) => {
    table.increments('id').primary()
    table.integer('model_id').unsigned().notNullable().references('id').inTable('lowcode_models').onDelete('CASCADE')
    table.string('version', 50).notNullable()
    table.string('description', 500)
    table.text('snapshot').notNullable()
    table.tinyint('is_published').notNullable().defaultTo(0)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lowcode_model_versions')
}

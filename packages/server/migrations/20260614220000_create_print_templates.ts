import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('print_templates')
  if (hasTable) return

  await knex.schema.createTable('print_templates', (table) => {
    table.increments('id').primary()
    table.string('code', 100).notNullable().unique()
    table.string('name', 200).notNullable()
    table.string('model_code', 100).notNullable()
    table.string('paper_size', 50).defaultTo('A4')
    table.string('orientation', 20).defaultTo('portrait')
    table.json('config').notNullable()
    table.json('page_style').defaultTo('{}')
    table.tinyint('status').defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('print_templates')
}

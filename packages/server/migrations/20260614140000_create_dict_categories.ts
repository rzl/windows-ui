import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('dict_categories', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 50).notNullable()
    table.integer('sort').notNullable().defaultTo(0)
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })

  const hasColumn = await knex.schema.hasColumn('dicts', 'category_id')
  if (!hasColumn) {
    await knex.schema.table('dicts', (table) => {
      table.integer('category_id').unsigned().nullable().references('id').inTable('dict_categories').onDelete('SET NULL')
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('dicts', (table) => {
    table.dropColumn('category_id')
  })
  await knex.schema.dropTableIfExists('dict_categories')
}

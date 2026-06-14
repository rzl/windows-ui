import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('export_tasks', (table) => {
    table.increments('id').primary()
    table.string('model_code', 50).notNullable()
    table.string('status', 20).notNullable().defaultTo('pending')
    table.string('file_path', 255).nullable()
    table.integer('total').nullable()
    table.integer('success_count').nullable()
    table.text('message').nullable()
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('export_tasks')
}

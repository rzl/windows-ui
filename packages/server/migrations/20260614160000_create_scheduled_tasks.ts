import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('scheduled_tasks', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 50).notNullable()
    table.string('cron', 50).notNullable()
    table.string('handler_type', 30).notNullable()
    table.text('handler_config').notNullable()
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('last_run_time').nullable()
    table.text('last_run_result').nullable()
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('scheduled_task_logs', (table) => {
    table.increments('id').primary()
    table.integer('task_id').notNullable()
    table.string('status', 20).notNullable()
    table.text('result').nullable()
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('scheduled_task_logs')
  await knex.schema.dropTableIfExists('scheduled_tasks')
}

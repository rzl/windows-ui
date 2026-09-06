import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('flow_definitions', (table) => {
    table.string('id', 36).primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 50).notNullable()
    table.string('model_code', 50).notNullable()
    table.text('config').notNullable()
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('flow_instances', (table) => {
    table.string('id', 36).primary()
    table.string('flow_code', 50).notNullable()
    table.string('business_key', 36).notNullable()
    table.string('status', 20).notNullable().defaultTo('running')
    table.string('current_node_id', 50).nullable()
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('flow_tasks', (table) => {
    table.string('id', 36).primary()
    table.string('instance_id', 36).notNullable()
    table.string('node_id', 50).notNullable()
    table.string('node_name', 50).notNullable()
    table.string('assignee_type', 20).nullable()
    table.string('assignee_value', 50).nullable()
    table.string('status', 20).notNullable().defaultTo('pending')
    table.text('comment').nullable()
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('flow_tasks')
  await knex.schema.dropTableIfExists('flow_instances')
  await knex.schema.dropTableIfExists('flow_definitions')
}

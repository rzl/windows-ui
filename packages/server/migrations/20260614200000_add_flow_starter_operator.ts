import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasStarterId = await knex.schema.hasColumn('flow_instances', 'starter_id')
  if (!hasStarterId) {
    await knex.schema.table('flow_instances', (table) => {
      table.integer('starter_id').unsigned().nullable()
      table.string('starter_name', 50).nullable()
    })
  }

  const hasOperatorId = await knex.schema.hasColumn('flow_tasks', 'operator_id')
  if (!hasOperatorId) {
    await knex.schema.table('flow_tasks', (table) => {
      table.integer('operator_id').unsigned().nullable()
      table.string('operator_name', 50).nullable()
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('flow_instances', (table) => {
    table.dropColumn('starter_id')
    table.dropColumn('starter_name')
  })
  await knex.schema.table('flow_tasks', (table) => {
    table.dropColumn('operator_id')
    table.dropColumn('operator_name')
  })
}

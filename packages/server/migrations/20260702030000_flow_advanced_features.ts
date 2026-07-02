import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('flow_instances', (table) => {
    table.integer('terminated_by').nullable().comment('强制终止人 ID')
    table.text('terminated_reason').nullable().comment('强制终止原因')
    table.timestamp('terminated_time').nullable().comment('强制终止时间')
  })

  await knex.schema.table('flow_tasks', (table) => {
    table.string('timeout_action', 20).nullable().defaultTo('none').comment('none/autoApprove/autoReject')
    table.integer('urge_count').notNullable().defaultTo(0).comment('催办次数')
    table.timestamp('last_urge_time').nullable().comment('上次催办时间')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('flow_instances', (table) => {
    table.dropColumn('terminated_by')
    table.dropColumn('terminated_reason')
    table.dropColumn('terminated_time')
  })

  await knex.schema.table('flow_tasks', (table) => {
    table.dropColumn('timeout_action')
    table.dropColumn('urge_count')
    table.dropColumn('last_urge_time')
  })
}

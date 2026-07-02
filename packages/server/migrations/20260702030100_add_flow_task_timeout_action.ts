import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('flow_tasks', 'timeout_action')
  if (!hasColumn) {
    await knex.schema.table('flow_tasks', (table) => {
      table.string('timeout_action', 20).nullable().defaultTo('none').comment('none/autoApprove/autoReject')
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('flow_tasks', (table) => {
    table.dropColumn('timeout_action')
  })
}

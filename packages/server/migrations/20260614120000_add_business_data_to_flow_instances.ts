import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('flow_instances', 'business_data')
  if (!hasColumn) {
    await knex.schema.table('flow_instances', (table) => {
      table.text('business_data').nullable()
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('flow_instances', (table) => {
    table.dropColumn('business_data')
  })
}

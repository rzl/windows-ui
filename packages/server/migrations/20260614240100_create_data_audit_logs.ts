import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('data_audit_logs')
  if (hasTable) return

  await knex.schema.createTable('data_audit_logs', (table) => {
    table.string('id', 36).primary()
    table.string('model_code', 100).notNullable()
    table.string('record_id', 36).notNullable()
    table.string('action', 50).notNullable() // create / update / delete
    table.string('operator_id', 36).nullable()
    table.string('operator_name', 100).nullable()
    table.json('before').nullable()
    table.json('after').nullable()
    table.json('diff').nullable()
    table.string('ip', 100).nullable()
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('data_audit_logs')
}

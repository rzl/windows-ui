import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenants', (table) => {
    table.increments('id').primary()
    table.string('name', 100).notNullable().comment('租户名称')
    table.string('code', 50).notNullable().unique().comment('租户编码')
    table.string('description', 500).comment('租户描述')
    table.tinyint('status').notNullable().defaultTo(1).comment('0 禁用 / 1 启用')
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tenants')
}

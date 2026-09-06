import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 为应用表增加是否上架到应用市场字段
  const hasIsMarket = await knex.schema.hasColumn('lowcode_apps', 'is_market')
  if (!hasIsMarket) {
    await knex.schema.table('lowcode_apps', (table) => {
      table.tinyint('is_market').defaultTo(1).comment('是否上架到应用市场：0 否 / 1 是')
    })
  }

  // 角色应用授权中间表
  const hasRoleApps = await knex.schema.hasTable('role_apps')
  if (!hasRoleApps) {
    await knex.schema.createTable('role_apps', (table) => {
      table.string('id', 36).primary()
      table.string('role_id', 36).notNullable().comment('角色 ID')
      table.string('app_id', 36).notNullable().comment('应用 ID')
      table.tinyint('status').defaultTo(1).comment('状态：0 禁用 / 1 启用')
      table.timestamp('create_time').defaultTo(knex.fn.now())
      table.unique(['role_id', 'app_id'])
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('role_apps')

  const hasIsMarket = await knex.schema.hasColumn('lowcode_apps', 'is_market')
  if (hasIsMarket) {
    await knex.schema.table('lowcode_apps', (table) => {
      table.dropColumn('is_market')
    })
  }
}

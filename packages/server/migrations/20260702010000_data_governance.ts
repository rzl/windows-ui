import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 数据保留策略配置表
  await knex.schema.createTable('data_retention_policies', (table) => {
    table.increments('id').primary()
    table.string('table_name', 100).notNullable().unique().comment('目标表名')
    table.integer('retention_days').notNullable().defaultTo(30).comment('保留天数，0 表示不自动清理')
    table.tinyint('enabled').notNullable().defaultTo(1).comment('是否启用自动清理')
    table.timestamp('last_cleanup_time').nullable().comment('上次清理时间')
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })

  // 自定义接口日志保留天数
  await knex.schema.table('lowcode_custom_apis', (table) => {
    table.integer('log_retention_days').nullable().defaultTo(30).comment('执行日志保留天数，0 表示不限制')
  })

  // 初始化默认策略
  await knex('data_retention_policies').insert([
    { table_name: 'api_metrics', retention_days: 30, enabled: 1 },
    { table_name: 'sql_metrics', retention_days: 30, enabled: 1 },
    { table_name: 'alert_records', retention_days: 90, enabled: 1 },
    { table_name: 'custom_api_logs', retention_days: 30, enabled: 1 },
    { table_name: 'operation_logs', retention_days: 180, enabled: 1 },
    { table_name: 'data_logs', retention_days: 180, enabled: 1 }
  ])
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('data_retention_policies')
  await knex.schema.table('lowcode_custom_apis', (table) => {
    table.dropColumn('log_retention_days')
  })
}

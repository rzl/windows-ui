import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 流程定义版本管理
  await knex.schema.table('flow_definitions', (table) => {
    table.integer('version').notNullable().defaultTo(1).comment('版本号')
    table.tinyint('is_latest').notNullable().defaultTo(1).comment('是否为最新版本')
    table.string('remark', 255).nullable().comment('版本说明')
  })

  // code + version 唯一
  await knex.schema.alterTable('flow_definitions', (table) => {
    table.dropUnique(['code'])
    table.unique(['code', 'version'])
  })

  // 流程实例记录版本号
  await knex.schema.table('flow_instances', (table) => {
    table.integer('definition_version').nullable().defaultTo(1).comment('启动时流程定义版本')
  })

  // 任务表扩展：转办、超时
  await knex.schema.table('flow_tasks', (table) => {
    table.integer('timeout_hours').nullable().defaultTo(0).comment('节点超时小时数，0 表示不超时')
    table.timestamp('due_time').nullable().comment('任务截止时间')
    table.tinyint('timeout_notified').notNullable().defaultTo(0).comment('是否已触发超时提醒')
    table.integer('transferred_from').nullable().comment('转办来源用户 ID')
    table.integer('delegated_from').nullable().comment('委托来源用户 ID')
  })

  // 流程委托表
  await knex.schema.createTable('flow_delegations', (table) => {
    table.increments('id').primary()
    table.integer('delegator_id').notNullable().comment('委托人 ID')
    table.integer('delegatee_id').notNullable().comment('受托人 ID')
    table.string('flow_code', 50).nullable().comment('限定流程编码，空表示全部流程')
    table.timestamp('start_time').notNullable().comment('委托开始时间')
    table.timestamp('end_time').notNullable().comment('委托结束时间')
    table.tinyint('status').notNullable().defaultTo(1).comment('1 启用 / 0 禁用')
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })

  // 为现有数据填充默认 version / definition_version
  await knex('flow_definitions').update({ version: 1, is_latest: 1 })
  await knex('flow_instances').update({ definition_version: 1 })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('flow_delegations')

  await knex.schema.table('flow_tasks', (table) => {
    table.dropColumn('timeout_hours')
    table.dropColumn('due_time')
    table.dropColumn('timeout_notified')
    table.dropColumn('transferred_from')
    table.dropColumn('delegated_from')
  })

  await knex.schema.table('flow_instances', (table) => {
    table.dropColumn('definition_version')
  })

  await knex.schema.table('flow_definitions', (table) => {
    table.dropColumn('definition_version')
    table.dropColumn('is_latest')
    table.dropColumn('remark')
  })

  await knex.schema.alterTable('flow_definitions', (table) => {
    table.dropUnique(['code', 'version'])
    table.unique(['code'])
  })
}

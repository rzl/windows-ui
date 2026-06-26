import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('api_metrics', (table) => {
    table.increments('id').primary()
    table.string('method', 10).notNullable()
    table.string('path', 255).notNullable()
    table.integer('status_code').defaultTo(200)
    table.integer('duration').notNullable().comment('请求耗时，单位毫秒')
    table.integer('user_id').nullable()
    table.string('username', 100).nullable()
    table.string('ip', 50).nullable()
    table.text('params').nullable().comment('请求参数 JSON')
    table.timestamp('created_at').defaultTo(knex.fn.now())

    table.index('created_at')
    table.index('path')
    table.index('duration')
  })

  await knex.schema.createTable('sql_metrics', (table) => {
    table.increments('id').primary()
    table.text('sql').notNullable()
    table.text('bindings').nullable().comment('绑定参数 JSON')
    table.integer('duration').notNullable().comment('SQL 执行耗时，单位毫秒')
    table.timestamp('created_at').defaultTo(knex.fn.now())

    table.index('created_at')
    table.index('duration')
  })

  await knex.schema.createTable('alert_rules', (table) => {
    table.increments('id').primary()
    table.string('name', 100).notNullable()
    table.string('type', 50).notNullable().comment('api_slow/sql_slow/error_rate/server_load')
    table.integer('threshold').notNullable().comment('阈值，毫秒或百分比')
    table.integer('window_minutes').notNullable().defaultTo(5).comment('统计窗口分钟数')
    table.tinyint('enabled').notNullable().defaultTo(1)
    table.string('notify_channel', 50).notNullable().defaultTo('site').comment('site/email/sms')
    table.text('receiver_ids').nullable().comment('接收人 ID JSON 数组')
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('alert_records', (table) => {
    table.increments('id').primary()
    table.integer('rule_id').nullable()
    table.string('rule_name', 100).notNullable()
    table.string('type', 50).notNullable()
    table.text('message').notNullable()
    table.text('snapshot').nullable().comment('触发时快照 JSON')
    table.tinyint('is_read').notNullable().defaultTo(0)
    table.string('status', 20).notNullable().defaultTo('pending').comment('pending/resolved')
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())

    table.index('create_time')
    table.index('is_read')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('alert_records')
  await knex.schema.dropTableIfExists('alert_rules')
  await knex.schema.dropTableIfExists('sql_metrics')
  await knex.schema.dropTableIfExists('api_metrics')
}

import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('lowcode_custom_apis', (table) => {
    table.integer('rate_limit').nullable().defaultTo(0).comment('0 表示不限制')
    table.string('rate_limit_window', 20).nullable().defaultTo('minute').comment('second/minute/hour/day')
    table.text('ip_whitelist').nullable().comment('IP 白名单，JSON 数组')
    table.text('ip_blacklist').nullable().comment('IP 黑名单，JSON 数组')
    table.integer('timeout').nullable().defaultTo(5000).comment('脚本执行超时，单位毫秒')
  })

  await knex.schema.createTable('custom_api_logs', (table) => {
    table.increments('id').primary()
    table.integer('api_id').notNullable()
    table.string('api_code', 50).notNullable()
    table.string('api_path', 255).nullable()
    table.integer('user_id').nullable()
    table.string('username', 100).nullable()
    table.string('ip', 50).nullable()
    table.string('method', 10).nullable()
    table.text('params').nullable().comment('请求参数 JSON')
    table.text('response_snapshot').nullable().comment('响应快照 JSON，最多 2000 字符')
    table.integer('duration').nullable().comment('执行耗时毫秒')
    table.tinyint('status').notNullable().defaultTo(1).comment('1 成功 0 失败')
    table.text('error_message').nullable()
    table.timestamp('create_time').defaultTo(knex.fn.now())

    table.index('api_id')
    table.index('create_time')
    table.index('status')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('custom_api_logs')
  await knex.schema.alterTable('lowcode_custom_apis', (table) => {
    table.dropColumn('rate_limit')
    table.dropColumn('rate_limit_window')
    table.dropColumn('ip_whitelist')
    table.dropColumn('ip_blacklist')
    table.dropColumn('timeout')
  })
}

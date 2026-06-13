import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 消息模板
  await knex.schema.createTable('message_templates', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 50).notNullable()
    table.string('title', 100)
    table.text('content')
    table.string('channel', 20).notNullable().defaultTo('site')
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })

  // 消息记录
  await knex.schema.createTable('messages', (table) => {
    table.increments('id').primary()
    table.integer('sender_id').unsigned()
    table.integer('receiver_id').unsigned().notNullable()
    table.string('title', 100)
    table.text('content')
    table.string('channel', 20).notNullable().defaultTo('site')
    table.tinyint('is_read').notNullable().defaultTo(0)
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })

  // 操作日志
  await knex.schema.createTable('operation_logs', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned()
    table.string('username', 50)
    table.string('module', 50)
    table.string('action', 50)
    table.string('method', 10)
    table.string('path', 255)
    table.text('params')
    table.string('ip', 50)
    table.integer('duration').defaultTo(0)
    table.tinyint('status').defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })

  // 数据日志（数据快照）
  await knex.schema.createTable('data_logs', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned()
    table.string('model_code', 50)
    table.integer('row_id')
    table.string('action', 20)
    table.text('before_snapshot')
    table.text('after_snapshot')
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('data_logs')
  await knex.schema.dropTableIfExists('operation_logs')
  await knex.schema.dropTableIfExists('messages')
  await knex.schema.dropTableIfExists('message_templates')
}

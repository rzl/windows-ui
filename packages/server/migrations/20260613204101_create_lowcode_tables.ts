import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 数据模型
  await knex.schema.createTable('lowcode_models', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 50).notNullable()
    table.string('table_name', 50).notNullable().unique()
    table.string('description', 200)
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })

  // 模型字段
  await knex.schema.createTable('lowcode_fields', (table) => {
    table.increments('id').primary()
    table.integer('model_id').unsigned().notNullable().references('id').inTable('lowcode_models').onDelete('CASCADE')
    table.string('field_name', 50).notNullable()
    table.string('display_name', 50).notNullable()
    table.string('type', 30).notNullable().defaultTo('string')
    table.integer('length').defaultTo(255)
    table.tinyint('required').notNullable().defaultTo(0)
    table.string('default_value', 255)
    table.text('options')
    table.integer('sort').notNullable().defaultTo(0)
    table.tinyint('status').notNullable().defaultTo(1)
    table.unique(['model_id', 'field_name'])
  })

  // 表单配置
  await knex.schema.createTable('lowcode_forms', (table) => {
    table.increments('id').primary()
    table.integer('model_id').unsigned().notNullable().references('id').inTable('lowcode_models').onDelete('CASCADE')
    table.string('name', 50).notNullable()
    table.text('config').notNullable()
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })

  // 列表配置
  await knex.schema.createTable('lowcode_tables', (table) => {
    table.increments('id').primary()
    table.integer('model_id').unsigned().notNullable().references('id').inTable('lowcode_models').onDelete('CASCADE')
    table.string('name', 50).notNullable()
    table.text('config').notNullable()
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })

  // 编码规则
  await knex.schema.createTable('lowcode_coding_rules', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 50).notNullable()
    table.string('prefix', 50)
    table.string('date_format', 20).defaultTo('YYYYMMDD')
    table.integer('seq_length').notNullable().defaultTo(4)
    table.integer('current_seq').notNullable().defaultTo(0)
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })

  // 校验规则
  await knex.schema.createTable('lowcode_validation_rules', (table) => {
    table.increments('id').primary()
    table.string('code', 50).notNullable().unique()
    table.string('name', 50).notNullable()
    table.string('pattern', 255).notNullable()
    table.string('message', 255).notNullable()
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lowcode_validation_rules')
  await knex.schema.dropTableIfExists('lowcode_coding_rules')
  await knex.schema.dropTableIfExists('lowcode_tables')
  await knex.schema.dropTableIfExists('lowcode_forms')
  await knex.schema.dropTableIfExists('lowcode_fields')
  await knex.schema.dropTableIfExists('lowcode_models')
}

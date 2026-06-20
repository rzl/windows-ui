import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasDataRules = await knex.schema.hasTable('lowcode_data_permission_rules')
  if (!hasDataRules) {
    await knex.schema.createTable('lowcode_data_permission_rules', (table) => {
      table.increments('id').primary()
      table.string('code', 100).notNullable().unique()
      table.string('name', 200).notNullable()
      table.string('model_code', 100).notNullable().comment('关联模型编码')
      table.string('scope', 50).notNullable().comment('all / dept / dept_and_sub / self / roles / users')
      table.json('role_ids').nullable().defaultTo('[]')
      table.json('user_ids').nullable().defaultTo('[]')
      table.json('custom_filter').nullable().defaultTo('[]')
      table.tinyint('status').notNullable().defaultTo(1)
      table.timestamp('create_time').defaultTo(knex.fn.now())
      table.timestamp('update_time').defaultTo(knex.fn.now())
    })
  }

  const hasFieldRules = await knex.schema.hasTable('lowcode_field_permission_rules')
  if (!hasFieldRules) {
    await knex.schema.createTable('lowcode_field_permission_rules', (table) => {
      table.increments('id').primary()
      table.string('model_code', 100).notNullable().comment('关联模型编码')
      table.string('field_code', 100).notNullable().comment('字段编码')
      table.tinyint('readable').notNullable().defaultTo(1)
      table.tinyint('editable').notNullable().defaultTo(1)
      table.tinyint('hidden').notNullable().defaultTo(0)
      table.json('role_ids').nullable().defaultTo('[]')
      table.tinyint('status').notNullable().defaultTo(1)
      table.timestamp('create_time').defaultTo(knex.fn.now())
      table.timestamp('update_time').defaultTo(knex.fn.now())
      table.unique(['model_code', 'field_code'])
    })
  }

  const hasRoleDataPerms = await knex.schema.hasTable('role_data_permissions')
  if (!hasRoleDataPerms) {
    await knex.schema.createTable('role_data_permissions', (table) => {
      table.increments('id').primary()
      table.integer('role_id').unsigned().notNullable().comment('角色 ID')
      table.integer('data_permission_id').unsigned().notNullable().comment('数据规则 ID')
      table.timestamp('create_time').defaultTo(knex.fn.now())
      table.unique(['role_id', 'data_permission_id'])
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('role_data_permissions')
  await knex.schema.dropTableIfExists('lowcode_field_permission_rules')
  await knex.schema.dropTableIfExists('lowcode_data_permission_rules')
}

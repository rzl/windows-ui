import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 角色表
  await knex.schema.createTable('roles', (table) => {
    table.increments('id').primary()
    table.string('name', 50).notNullable()
    table.string('code', 50).notNullable().unique()
    table.string('description', 200)
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })

  // 部门表
  await knex.schema.createTable('depts', (table) => {
    table.increments('id').primary()
    table.integer('parent_id').notNullable().defaultTo(0)
    table.string('name', 50).notNullable()
    table.string('code', 50).notNullable().unique()
    table.integer('sort').notNullable().defaultTo(0)
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })

  // 用户表
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('username', 50).notNullable().unique()
    table.string('password', 255).notNullable()
    table.string('nickname', 50)
    table.string('email', 100)
    table.string('phone', 20)
    table.string('avatar', 255)
    table.tinyint('status').notNullable().defaultTo(1)
    table.integer('dept_id').unsigned().references('id').inTable('depts').onDelete('SET NULL')
    table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('SET NULL')
    table.timestamp('create_time').defaultTo(knex.fn.now())
    table.timestamp('update_time').defaultTo(knex.fn.now())
  })

  // 菜单表
  await knex.schema.createTable('menus', (table) => {
    table.increments('id').primary()
    table.integer('parent_id').notNullable().defaultTo(0)
    table.string('name', 50).notNullable()
    table.string('path', 100).notNullable()
    table.string('component', 100)
    table.string('title', 50).notNullable()
    table.string('icon', 50)
    table.integer('sort').notNullable().defaultTo(0)
    table.tinyint('status').notNullable().defaultTo(1)
    table.string('permission', 100)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })

  // 角色权限关联表
  await knex.schema.createTable('role_permissions', (table) => {
    table.increments('id').primary()
    table.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE')
    table.string('permission', 100).notNullable()
    table.unique(['role_id', 'permission'])
  })

  // 字典表
  await knex.schema.createTable('dicts', (table) => {
    table.increments('id').primary()
    table.string('name', 50).notNullable()
    table.string('code', 50).notNullable().unique()
    table.string('description', 200)
    table.tinyint('status').notNullable().defaultTo(1)
    table.timestamp('create_time').defaultTo(knex.fn.now())
  })

  // 字典项表
  await knex.schema.createTable('dict_items', (table) => {
    table.increments('id').primary()
    table.integer('dict_id').unsigned().notNullable().references('id').inTable('dicts').onDelete('CASCADE')
    table.string('label', 50).notNullable()
    table.string('value', 50).notNullable()
    table.integer('sort').notNullable().defaultTo(0)
    table.tinyint('status').notNullable().defaultTo(1)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('dict_items')
  await knex.schema.dropTableIfExists('dicts')
  await knex.schema.dropTableIfExists('role_permissions')
  await knex.schema.dropTableIfExists('menus')
  await knex.schema.dropTableIfExists('users')
  await knex.schema.dropTableIfExists('depts')
  await knex.schema.dropTableIfExists('roles')
}

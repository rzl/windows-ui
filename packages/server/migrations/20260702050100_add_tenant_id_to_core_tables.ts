import type { Knex } from 'knex'

const tables = [
  'users',
  'roles',
  'depts',
  'menus',
  'dicts',
  'dict_items',
  'role_permissions',
  'role_apps',
  'lowcode_apps',
  'lowcode_app_items',
  'lowcode_app_versions',
  'lowcode_pages'
]

export async function up(knex: Knex): Promise<void> {
  for (const tableName of tables) {
    const hasColumn = await knex.schema.hasColumn(tableName, 'tenant_id')
    if (!hasColumn) {
      await knex.schema.table(tableName, (table) => {
        table.string('tenant_id', 36).notNullable().defaultTo('01J0000000000000000000001').comment('租户 ID，全局租户为固定 ULID')
      })
    }
  }

  // users 表 username 唯一索引改为联合唯一
  const hasUniqueUsername = await knex.schema.hasTable('users')
  if (hasUniqueUsername) {
    try {
      await knex.schema.table('users', (table) => {
        table.dropUnique(['username'])
        table.unique(['tenant_id', 'username'])
      })
    } catch {
      // 索引可能已不存在或已调整，忽略
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  for (const tableName of tables) {
    const hasColumn = await knex.schema.hasColumn(tableName, 'tenant_id')
    if (hasColumn) {
      await knex.schema.table(tableName, (table) => {
        table.dropColumn('tenant_id')
      })
    }
  }

  try {
    await knex.schema.table('users', (table) => {
      table.dropUnique(['tenant_id', 'username'])
      table.unique(['username'])
    })
  } catch {
    // 忽略
  }
}

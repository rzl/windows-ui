import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const parent = await knex('menus').where({ name: 'Lowcode', path: '/lowcode' }).first()
  if (!parent) return

  const items = [
    {
      name: 'AppList',
      path: '/lowcode/app',
      component: 'views/lowcode/AppList.vue',
      title: '应用管理',
      icon: 'app',
      sort: 90,
      permission: 'lowcode:app'
    },
    {
      name: 'AuditLogList',
      path: '/lowcode/audit-log',
      component: 'views/lowcode/AuditLogList.vue',
      title: '数据审计',
      icon: 'log',
      sort: 100,
      permission: 'lowcode:auditLog'
    }
  ]

  for (const item of items) {
    const exists = await knex('menus').where({ name: item.name, path: item.path }).first()
    if (exists) continue
    await knex('menus').insert({
      parent_id: parent.id,
      ...item,
      status: 1
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').whereIn('name', ['AppList', 'AuditLogList']).del()
}

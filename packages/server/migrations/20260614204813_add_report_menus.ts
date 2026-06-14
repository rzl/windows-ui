import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 查找或创建报表管理菜单分组
  let reportParent = await knex('menus').where({ name: 'Report' }).first()
  if (!reportParent) {
    const [id] = await knex('menus').insert({
      parent_id: 0,
      name: 'Report',
      path: '/report',
      title: '报表中心',
      icon: 'report',
      sort: 8,
      status: 1
    })
    reportParent = { id }
  }

  const exists = await knex('menus').where({ name: 'ReportList' }).first()
  if (!exists) {
    await knex('menus').insert({
      parent_id: reportParent.id,
      name: 'ReportList',
      path: '/report/list',
      component: 'views/report/ReportList.vue',
      title: '报表管理',
      icon: 'report',
      sort: 1,
      status: 1,
      permission: 'report:list'
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').where({ name: 'ReportList' }).del()
  await knex('menus').where({ name: 'Report' }).del()
}

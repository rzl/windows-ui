import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const systemMenu = await knex('menus').where({ name: 'System' }).first()
  if (!systemMenu) return

  const exists = await knex('menus').where({ name: 'NoticeList' }).first()
  if (!exists) {
    await knex('menus').insert({
      parent_id: systemMenu.id,
      name: 'NoticeList',
      path: '/system/notice',
      component: 'views/system/NoticeList.vue',
      title: '系统公告',
      icon: 'bell',
      sort: 6,
      status: 1,
      permission: 'notice:list'
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').where({ name: 'NoticeList' }).del()
}

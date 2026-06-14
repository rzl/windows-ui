import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const systemMenu = await knex('menus').where({ name: 'System' }).first()
  if (!systemMenu) return

  const exists = await knex('menus').where({ name: 'PositionList' }).first()
  if (!exists) {
    await knex('menus').insert({
      parent_id: systemMenu.id,
      name: 'PositionList',
      path: '/system/position',
      component: 'views/system/PositionList.vue',
      title: '职务管理',
      icon: 'user',
      sort: 7,
      status: 1,
      permission: 'position:list'
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').where({ name: 'PositionList' }).del()
}

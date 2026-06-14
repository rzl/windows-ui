import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const systemMenu = await knex('menus').where({ name: 'System' }).first()
  if (!systemMenu) return

  const exists = await knex('menus').where({ name: 'DictCategoryList' }).first()
  if (!exists) {
    await knex('menus').insert({
      parent_id: systemMenu.id,
      name: 'DictCategoryList',
      path: '/system/dict-category',
      component: 'views/system/DictCategoryList.vue',
      title: '字典分类',
      icon: 'folder',
      sort: 4,
      status: 1,
      permission: 'dict:list'
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').where({ name: 'DictCategoryList' }).del()
}

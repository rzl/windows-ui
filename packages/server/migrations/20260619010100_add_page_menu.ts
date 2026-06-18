import type { Knex } from 'knex'

export async function up(knex: Knex) {
  const lowcodeMenu = await knex('menus').where({ name: 'Lowcode', path: '/lowcode' }).first()
  if (!lowcodeMenu) return

  await knex('menus').insert({
    parent_id: lowcodeMenu.id,
    name: 'PageList',
    path: '/lowcode/page',
    title: '自定义页面',
    icon: 'page',
    sort: 65,
    status: 1,
    permission: 'lowcode:page'
  })
}

export async function down(knex: Knex) {
  await knex('menus').where({ name: 'PageList', path: '/lowcode/page' }).del()
}

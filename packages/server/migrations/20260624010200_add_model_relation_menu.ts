import type { Knex } from 'knex'

export async function up(knex: Knex) {
  const lowcodeMenu = await knex('menus').where({ name: 'Lowcode', path: '/lowcode' }).first()
  if (!lowcodeMenu) return

  await knex('menus').insert({
    parent_id: lowcodeMenu.id,
    name: 'RelationList',
    path: '/lowcode/relation',
    title: '关联关系',
    icon: 'relation',
    sort: 70,
    status: 1,
    permission: 'lowcode:relation'
  })
}

export async function down(knex: Knex) {
  await knex('menus').where({ name: 'RelationList', path: '/lowcode/relation' }).del()
}

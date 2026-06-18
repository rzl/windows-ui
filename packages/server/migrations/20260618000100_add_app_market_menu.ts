import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const parent = await knex('menus').where({ name: 'Lowcode', path: '/lowcode' }).first()
  if (!parent) return

  const exists = await knex('menus')
    .where({ name: 'AppMarket', path: '/lowcode/app-market' })
    .first()
  if (exists) return

  await knex('menus').insert({
    parent_id: parent.id,
    name: 'AppMarket',
    path: '/lowcode/app-market',
    component: 'views/lowcode/AppMarket.vue',
    title: '应用市场',
    icon: 'market',
    sort: 80,
    status: 1,
    permission: 'lowcode:appMarket'
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').where({ name: 'AppMarket', path: '/lowcode/app-market' }).del()
}

import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  const lowcode = await knex('menus').where({ name: 'Lowcode' }).first()
  if (!lowcode) return

  const exists = await knex('menus').where({ name: 'PluginList' }).first()
  if (exists) return

  await knex('menus').insert({
    parent_id: lowcode.id,
    name: 'PluginList',
    path: '/lowcode/plugin',
    component: 'views/lowcode/PluginList.vue',
    title: '插件市场',
    icon: 'plugin',
    sort: 10,
    status: 1,
    permission: 'lowcode:plugin'
  })
}

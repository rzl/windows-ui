import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const parent = await knex('menus').where({ name: 'Lowcode', path: '/lowcode' }).first()
  if (!parent) return

  const exists = await knex('menus').where({ name: 'ExternalDataSourceList', path: '/lowcode/external-datasource' }).first()
  if (exists) return

  await knex('menus').insert({
    parent_id: parent.id,
    name: 'ExternalDataSourceList',
    path: '/lowcode/external-datasource',
    component: 'views/external-datasource/ExternalDataSourceList.vue',
    title: '外部数据源',
    icon: 'database',
    sort: 80,
    status: 1,
    permission: 'lowcode:externalDatasource'
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').where({ name: 'ExternalDataSourceList', path: '/lowcode/external-datasource' }).del()
}

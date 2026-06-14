import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const parent = await knex('menus').where({ name: 'Lowcode', path: '/lowcode' }).first()
  if (!parent) return

  const exists = await knex('menus').where({ name: 'PrintTemplateList', path: '/lowcode/print-template' }).first()
  if (exists) return

  await knex('menus').insert({
    parent_id: parent.id,
    name: 'PrintTemplateList',
    path: '/lowcode/print-template',
    component: 'views/report/PrintTemplateList.vue',
    title: '打印模板',
    icon: 'printer',
    sort: 70,
    status: 1,
    permission: 'lowcode:printTemplate'
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').where({ name: 'PrintTemplateList', path: '/lowcode/print-template' }).del()
}

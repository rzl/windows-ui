import type { Knex } from 'knex'
import { newId } from '../src/utils/id.ts'

export async function seed(knex: Knex): Promise<void> {
  const lowcode = await knex('menus').where({ name: 'Lowcode' }).first()
  if (!lowcode) return

  const exists = await knex('menus').where({ name: 'PageList' }).first()
  if (exists) return

  await knex('menus').insert({
    id: newId(),
    parent_id: lowcode.id,
    name: 'PageList',
    path: '/lowcode/page',
    component: 'views/lowcode/PageList.vue',
    title: '自定义页面',
    icon: 'page',
    sort: 5,
    status: 1,
    permission: 'lowcode:page'
  })
}

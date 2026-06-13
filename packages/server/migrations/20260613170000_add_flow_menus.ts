import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // 查找或创建流程管理菜单分组
  let flowParent = await knex('menus').where({ name: 'Flow' }).first()
  if (!flowParent) {
    const [id] = await knex('menus').insert({
      parent_id: 0,
      name: 'Flow',
      path: '/flow',
      title: '流程管理',
      icon: 'flow',
      sort: 7,
      status: 1
    })
    flowParent = { id }
  }

  const exists = await knex('menus').where({ name: 'FlowList' }).first()
  if (!exists) {
    await knex('menus').insert({
      parent_id: flowParent.id,
      name: 'FlowList',
      path: '/flow/list',
      component: 'views/flow/FlowList.vue',
      title: '流程定义',
      icon: 'flow',
      sort: 1,
      status: 1,
      permission: 'flow:list'
    })
  }

  const pendingExists = await knex('menus').where({ name: 'PendingTaskList' }).first()
  if (!pendingExists) {
    await knex('menus').insert({
      parent_id: flowParent.id,
      name: 'PendingTaskList',
      path: '/flow/pending',
      component: 'views/flow/PendingTaskList.vue',
      title: '我的待办',
      icon: 'task',
      sort: 2,
      status: 1,
      permission: 'flow:task'
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').where({ name: 'FlowList' }).del()
  await knex('menus').where({ name: 'PendingTaskList' }).del()
  await knex('menus').where({ name: 'Flow' }).del()
}

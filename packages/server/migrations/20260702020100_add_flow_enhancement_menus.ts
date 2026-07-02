import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const flowMenu = await knex('menus').where({ name: 'Flow' }).first()
  if (!flowMenu) return

  const exists = await knex('menus').whereIn('name', ['FlowDelegation', 'FlowPerformance']).first()
  if (exists) return

  await knex('menus').insert([
    {
      parent_id: flowMenu.id,
      name: 'FlowDelegation',
      path: '/flow/delegation',
      component: 'views/flow/FlowDelegation.vue',
      title: '流程委托',
      icon: 'user',
      sort: 3,
      status: 1,
      permission: 'flow:delegation'
    },
    {
      parent_id: flowMenu.id,
      name: 'FlowPerformance',
      path: '/flow/performance',
      component: 'views/flow/FlowPerformance.vue',
      title: '流程绩效',
      icon: 'chart',
      sort: 4,
      status: 1,
      permission: 'flow:performance'
    }
  ])
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').whereIn('name', ['FlowDelegation', 'FlowPerformance']).del()
}

import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const monitorMenu = await knex('menus').where({ name: 'Monitor' }).first()
  if (!monitorMenu) return

  const exists = await knex('menus').where({ name: 'ScheduleList' }).first()
  if (!exists) {
    await knex('menus').insert({
      parent_id: monitorMenu.id,
      name: 'ScheduleList',
      path: '/monitor/schedule',
      component: 'views/monitor/ScheduleList.vue',
      title: '定时任务',
      icon: 'clock',
      sort: 3,
      status: 1,
      permission: 'monitor:schedule'
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('menus').where({ name: 'ScheduleList' }).del()
}

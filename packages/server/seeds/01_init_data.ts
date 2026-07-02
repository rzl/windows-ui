import type { Knex } from 'knex'
import bcrypt from 'bcryptjs'

export async function seed(knex: Knex): Promise<void> {
  // 清空现有数据
  await knex('role_permissions').del()
  await knex('users').del()
  await knex('menus').del()
  await knex('depts').del()
  await knex('roles').del()
  await knex('dict_items').del()
  await knex('dicts').del()

  // 角色
  const [adminRoleId] = await knex('roles').insert({
    name: '超级管理员',
    code: 'admin',
    description: '全部权限',
    status: 1
  })

  await knex('roles').insert([
    { name: '编辑', code: 'editor', description: '内容管理', status: 1 },
    { name: '访客', code: 'viewer', description: '只读权限', status: 1 }
  ])

  // 部门
  const [devDeptId] = await knex('depts').insert({
    parent_id: 0,
    name: '研发中心',
    code: 'RD',
    sort: 1,
    status: 1
  })

  await knex('depts').insert([
    { parent_id: devDeptId, name: '前端组', code: 'RD-FE', sort: 1, status: 1 },
    { parent_id: devDeptId, name: '后端组', code: 'RD-BE', sort: 2, status: 1 }
  ])

  // 用户
  await knex('users').insert({
    username: 'admin',
    password: bcrypt.hashSync('admin', 10),
    nickname: '管理员',
    email: 'admin@example.com',
    phone: '13800000000',
    status: 1,
    dept_id: devDeptId,
    role_id: adminRoleId
  })

  // 菜单
  const [dashboardId] = await knex('menus').insert({
    parent_id: 0,
    name: 'Dashboard',
    path: '/dashboard',
    component: 'views/dashboard/Dashboard.vue',
    title: '仪表盘',
    icon: 'home',
    sort: 1,
    status: 1,
    permission: 'dashboard'
  })

  const [systemId] = await knex('menus').insert({
    parent_id: 0,
    name: 'System',
    path: '/system',
    title: '系统管理',
    icon: 'setting',
    sort: 2,
    status: 1
  })

  await knex('menus').insert([
    {
      parent_id: systemId,
      name: 'UserList',
      path: '/system/user',
      component: 'views/system/UserList.vue',
      title: '用户管理',
      icon: 'user',
      sort: 1,
      status: 1,
      permission: 'user:list'
    },
    {
      parent_id: systemId,
      name: 'RoleList',
      path: '/system/role',
      component: 'views/system/RoleList.vue',
      title: '角色管理',
      icon: 'role',
      sort: 2,
      status: 1,
      permission: 'role:list'
    },
    {
      parent_id: systemId,
      name: 'MenuList',
      path: '/system/menu',
      component: 'views/system/MenuList.vue',
      title: '菜单管理',
      icon: 'menu',
      sort: 3,
      status: 1,
      permission: 'menu:list'
    },
    {
      parent_id: systemId,
      name: 'DeptList',
      path: '/system/dept',
      component: 'views/system/DeptList.vue',
      title: '部门管理',
      icon: 'dept',
      sort: 4,
      status: 1,
      permission: 'dept:list'
    },
    {
      parent_id: systemId,
      name: 'DictList',
      path: '/system/dict',
      component: 'views/system/DictList.vue',
      title: '字典管理',
      icon: 'dict',
      sort: 5,
      status: 1,
      permission: 'dict:list'
    },
    {
      parent_id: systemId,
      name: 'NoticeList',
      path: '/system/notice',
      component: 'views/system/NoticeList.vue',
      title: '系统公告',
      icon: 'notice',
      sort: 6,
      status: 1,
      permission: 'notice:list'
    },
    {
      parent_id: systemId,
      name: 'PositionList',
      path: '/system/position',
      component: 'views/system/PositionList.vue',
      title: '职务管理',
      icon: 'position',
      sort: 7,
      status: 1,
      permission: 'position:list'
    },
    {
      parent_id: systemId,
      name: 'DictCategoryList',
      path: '/system/dict-category',
      component: 'views/system/DictCategoryList.vue',
      title: '字典分类',
      icon: 'category',
      sort: 8,
      status: 1,
      permission: 'dict:list'
    },
    {
      parent_id: systemId,
      name: 'DataPermissionList',
      path: '/system/data-permission',
      component: 'views/system/DataPermissionList.vue',
      title: '数据权限',
      icon: 'lock',
      sort: 9,
      status: 1,
      permission: 'data-permission:list'
    },
    {
      parent_id: systemId,
      name: 'FieldPermissionList',
      path: '/system/field-permission',
      component: 'views/system/FieldPermissionList.vue',
      title: '字段权限',
      icon: 'lock',
      sort: 10,
      status: 1,
      permission: 'field-permission:list'
    }
  ])

  // 在线开发（低代码）
  const [lowcodeId] = await knex('menus').insert({
    parent_id: 0,
    name: 'Lowcode',
    path: '/lowcode',
    title: '在线开发',
    icon: 'code',
    sort: 3,
    status: 1
  })

  await knex('menus').insert([
    {
      parent_id: lowcodeId,
      name: 'AppMarket',
      path: '/lowcode/app-market',
      component: 'views/lowcode/AppMarket.vue',
      title: '应用市场',
      icon: 'market',
      sort: 0,
      status: 1,
      permission: 'lowcode:appMarket'
    },
    {
      parent_id: lowcodeId,
      name: 'ModelList',
      path: '/lowcode/model',
      component: 'views/lowcode/ModelList.vue',
      title: '数据模型',
      icon: 'model',
      sort: 1,
      status: 1,
      permission: 'lowcode:model'
    },
    {
      parent_id: lowcodeId,
      name: 'CodingRuleList',
      path: '/lowcode/coding-rule',
      component: 'views/lowcode/CodingRuleList.vue',
      title: '编码规则',
      icon: 'rule',
      sort: 2,
      status: 1,
      permission: 'lowcode:coding'
    },
    {
      parent_id: lowcodeId,
      name: 'ValidationRuleList',
      path: '/lowcode/validation-rule',
      component: 'views/lowcode/ValidationRuleList.vue',
      title: '校验规则',
      icon: 'validate',
      sort: 3,
      status: 1,
      permission: 'lowcode:validate'
    },
    {
      parent_id: lowcodeId,
      name: 'AppList',
      path: '/lowcode/app',
      component: 'views/lowcode/AppList.vue',
      title: '应用管理',
      icon: 'app',
      sort: 4,
      status: 1,
      permission: 'lowcode:app'
    },
    {
      parent_id: lowcodeId,
      name: 'PrintTemplateList',
      path: '/lowcode/print-template',
      component: 'views/report/PrintTemplateList.vue',
      title: '打印模板',
      icon: 'print',
      sort: 6,
      status: 1,
      permission: 'lowcode:printTemplate'
    },
    {
      parent_id: lowcodeId,
      name: 'ExternalDataSourceList',
      path: '/lowcode/external-datasource',
      component: 'views/external-datasource/ExternalDataSourceList.vue',
      title: '外部数据源',
      icon: 'database',
      sort: 7,
      status: 1,
      permission: 'lowcode:externalDatasource'
    },
    {
      parent_id: lowcodeId,
      name: 'AuditLogList',
      path: '/lowcode/audit-log',
      component: 'views/lowcode/AuditLogList.vue',
      title: '审计日志',
      icon: 'audit',
      sort: 8,
      status: 1,
      permission: 'lowcode:auditLog'
    },
    {
      parent_id: lowcodeId,
      name: 'CustomApiList',
      path: '/lowcode/custom-api',
      component: 'views/lowcode/CustomApiList.vue',
      title: '自定义接口',
      icon: 'api',
      sort: 9,
      status: 1,
      permission: 'lowcode:customApi'
    },
    {
      parent_id: lowcodeId,
      name: 'PageList',
      path: '/lowcode/page',
      component: 'views/lowcode/PageList.vue',
      title: '自定义页面',
      icon: 'page',
      sort: 5,
      status: 1,
      permission: 'lowcode:page'
    },
    {
      parent_id: lowcodeId,
      name: 'PluginList',
      path: '/lowcode/plugin',
      component: 'views/lowcode/PluginList.vue',
      title: '插件市场',
      icon: 'plugin',
      sort: 10,
      status: 1,
      permission: 'lowcode:plugin'
    },
    {
      parent_id: lowcodeId,
      name: 'RelationList',
      path: '/lowcode/relation',
      component: 'views/lowcode/RelationList.vue',
      title: '关联关系',
      icon: 'relation',
      sort: 11,
      status: 1,
      permission: 'lowcode:relation'
    }
  ])

  // 仪表盘与首页配置
  const [dashboardManagerId] = await knex('menus').insert({
    parent_id: 0,
    name: 'DashboardManager',
    path: '/dashboard-manager',
    title: '仪表盘配置',
    icon: 'dashboard',
    sort: 8,
    status: 1
  })

  await knex('menus').insert([
    {
      parent_id: dashboardManagerId,
      name: 'HomepageConfig',
      path: '/homepage/config',
      component: 'views/dashboard/HomepageConfig.vue',
      title: '首页配置',
      icon: 'home',
      sort: 1,
      status: 1,
      permission: 'homepage:config'
    },
    {
      parent_id: dashboardManagerId,
      name: 'DashboardList',
      path: '/dashboard/list',
      component: 'views/dashboard/DashboardList.vue',
      title: '仪表盘管理',
      icon: 'chart',
      sort: 2,
      status: 1,
      permission: 'dashboard:list'
    }
  ])

  // 消息中心
  const [messageId] = await knex('menus').insert({
    parent_id: 0,
    name: 'Message',
    path: '/message',
    title: '消息中心',
    icon: 'message',
    sort: 4,
    status: 1
  })

  await knex('menus').insert([
    {
      parent_id: messageId,
      name: 'MessageList',
      path: '/message/list',
      component: 'views/monitor/MessageList.vue',
      title: '消息管理',
      icon: 'mail',
      sort: 1,
      status: 1,
      permission: 'message:list'
    },
    {
      parent_id: messageId,
      name: 'MessageTemplateList',
      path: '/message/template',
      component: 'views/monitor/MessageTemplateList.vue',
      title: '模板管理',
      icon: 'template',
      sort: 2,
      status: 1,
      permission: 'message:template'
    }
  ])

  // 流程中心
  const [flowId] = await knex('menus').insert({
    parent_id: 0,
    name: 'Flow',
    path: '/flow',
    title: '流程中心',
    icon: 'flow',
    sort: 6,
    status: 1
  })

  await knex('menus').insert([
    {
      parent_id: flowId,
      name: 'FlowList',
      path: '/flow/list',
      component: 'views/flow/FlowList.vue',
      title: '流程定义',
      icon: 'flowChart',
      sort: 1,
      status: 1,
      permission: 'flow:list'
    },
    {
      parent_id: flowId,
      name: 'PendingTaskList',
      path: '/flow/pending',
      component: 'views/flow/PendingTaskList.vue',
      title: '我的待办',
      icon: 'task',
      sort: 2,
      status: 1,
      permission: 'flow:task'
    },
    {
      parent_id: flowId,
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
      parent_id: flowId,
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

  // 报表中心
  const [reportId] = await knex('menus').insert({
    parent_id: 0,
    name: 'Report',
    path: '/report',
    title: '报表中心',
    icon: 'report',
    sort: 7,
    status: 1
  })

  await knex('menus').insert([
    {
      parent_id: reportId,
      name: 'ReportList',
      path: '/report/list',
      component: 'views/report/ReportList.vue',
      title: '报表管理',
      icon: 'reportList',
      sort: 1,
      status: 1,
      permission: 'report:list'
    }
  ])

  // 系统监控
  const [monitorId] = await knex('menus').insert({
    parent_id: 0,
    name: 'Monitor',
    path: '/monitor',
    title: '系统监控',
    icon: 'monitor',
    sort: 5,
    status: 1
  })

  await knex('menus').insert([
    {
      parent_id: monitorId,
      name: 'ServerMonitor',
      path: '/monitor/server',
      component: 'views/monitor/ServerMonitor.vue',
      title: '服务器监控',
      icon: 'server',
      sort: 1,
      status: 1,
      permission: 'monitor:server'
    },
    {
      parent_id: monitorId,
      name: 'OperationLogList',
      path: '/monitor/operation-log',
      component: 'views/monitor/OperationLogList.vue',
      title: '操作日志',
      icon: 'log',
      sort: 2,
      status: 1,
      permission: 'monitor:log'
    },
    {
      parent_id: monitorId,
      name: 'ScheduleList',
      path: '/monitor/schedule',
      component: 'views/monitor/ScheduleList.vue',
      title: '定时任务',
      icon: 'schedule',
      sort: 3,
      status: 1,
      permission: 'monitor:schedule'
    }
  ])

  // 角色权限（超级管理员拥有所有权限）
  const permissions = ['*']
  await knex('role_permissions').insert(
    permissions.map((permission) => ({ role_id: adminRoleId, permission }))
  )

  // 字典
  const [statusDictId] = await knex('dicts').insert({
    name: '用户状态',
    code: 'user_status',
    description: '用户账号状态',
    status: 1
  })

  await knex('dict_items').insert([
    { dict_id: statusDictId, label: '启用', value: '1', sort: 1, status: 1 },
    { dict_id: statusDictId, label: '禁用', value: '0', sort: 2, status: 1 }
  ])
}

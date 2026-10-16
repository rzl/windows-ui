import type { Knex } from 'knex'
import { newId, GLOBAL_TENANT_ID } from '../../utils/id'

/**
 * 系统固定菜单树（三级结构）
 *
 * - 一级：功能中心（目录或叶子）
 * - 二级：内容较多的中心下再按职能分组（组织/权限/基础配置、数据建模/应用开发/扩展治理、我的流程/流程管理）
 * - 三级：具体页面
 *
 * 叶子节点的 path / component / permission / title / icon 与旧两级结构保持一致，
 * 重组层级不影响前端静态路由与权限控制；分组节点无 component、无 permission。
 * 顶级目录的 name 保持与旧结构一致（System/Lowcode/Flow…），兼容历史迁移脚本的父节点查找。
 */
export interface MenuNode {
  name: string
  path: string
  title: string
  icon?: string
  component?: string
  permission?: string
  sort: number
  children?: MenuNode[]
}

export const MENU_TREE: MenuNode[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: 'views/dashboard/Dashboard.vue',
    title: '仪表盘',
    icon: 'home',
    sort: 1,
    permission: 'dashboard'
  },
  {
    name: 'System',
    path: '/system',
    title: '系统管理',
    icon: 'setting',
    sort: 2,
    children: [
      {
        name: 'SystemOrg',
        path: '/system/org',
        title: '组织管理',
        icon: 'dept',
        sort: 0,
        children: [
          { name: 'TenantList', path: '/system/tenant', component: 'views/system/TenantList.vue', title: '租户管理', icon: 'tenant', sort: 0, permission: 'tenant:list' },
          { name: 'UserList', path: '/system/user', component: 'views/system/UserList.vue', title: '用户管理', icon: 'user', sort: 1, permission: 'user:list' },
          { name: 'DeptList', path: '/system/dept', component: 'views/system/DeptList.vue', title: '部门管理', icon: 'dept', sort: 2, permission: 'dept:list' },
          { name: 'PositionList', path: '/system/position', component: 'views/system/PositionList.vue', title: '职务管理', icon: 'position', sort: 3, permission: 'position:list' }
        ]
      },
      {
        name: 'SystemAuth',
        path: '/system/auth',
        title: '权限管理',
        icon: 'lock',
        sort: 1,
        children: [
          { name: 'RoleList', path: '/system/role', component: 'views/system/RoleList.vue', title: '角色管理', icon: 'role', sort: 0, permission: 'role:list' },
          { name: 'MenuList', path: '/system/menu', component: 'views/system/MenuList.vue', title: '菜单管理', icon: 'menu', sort: 1, permission: 'menu:list' },
          { name: 'DataPermissionList', path: '/system/data-permission', component: 'views/system/DataPermissionList.vue', title: '数据权限', icon: 'lock', sort: 2, permission: 'data-permission:list' },
          { name: 'FieldPermissionList', path: '/system/field-permission', component: 'views/system/FieldPermissionList.vue', title: '字段权限', icon: 'lock', sort: 3, permission: 'field-permission:list' }
        ]
      },
      {
        name: 'SystemConfig',
        path: '/system/config',
        title: '基础配置',
        icon: 'dict',
        sort: 2,
        children: [
          { name: 'DictCategoryList', path: '/system/dict-category', component: 'views/system/DictCategoryList.vue', title: '字典分类', icon: 'category', sort: 0, permission: 'dict:list' },
          { name: 'DictList', path: '/system/dict', component: 'views/system/DictList.vue', title: '字典管理', icon: 'dict', sort: 1, permission: 'dict:list' },
          { name: 'NoticeList', path: '/system/notice', component: 'views/system/NoticeList.vue', title: '系统公告', icon: 'notice', sort: 2, permission: 'notice:list' }
        ]
      }
    ]
  },
  {
    name: 'Lowcode',
    path: '/lowcode',
    title: '在线开发',
    icon: 'code',
    sort: 3,
    children: [
      {
        name: 'LowcodeModeling',
        path: '/lowcode/modeling',
        title: '数据建模',
        icon: 'model',
        sort: 0,
        children: [
          { name: 'ModelList', path: '/lowcode/model', component: 'views/lowcode/ModelList.vue', title: '数据模型', icon: 'model', sort: 0, permission: 'lowcode:model' },
          { name: 'RelationList', path: '/lowcode/relation', component: 'views/lowcode/RelationList.vue', title: '关联关系', icon: 'relation', sort: 1, permission: 'lowcode:relation' },
          { name: 'CodingRuleList', path: '/lowcode/coding-rule', component: 'views/lowcode/CodingRuleList.vue', title: '编码规则', icon: 'rule', sort: 2, permission: 'lowcode:coding' },
          { name: 'ValidationRuleList', path: '/lowcode/validation-rule', component: 'views/lowcode/ValidationRuleList.vue', title: '校验规则', icon: 'validate', sort: 3, permission: 'lowcode:validate' },
          { name: 'ExternalDataSourceList', path: '/lowcode/external-datasource', component: 'views/external-datasource/ExternalDataSourceList.vue', title: '外部数据源', icon: 'database', sort: 4, permission: 'lowcode:externalDatasource' }
        ]
      },
      {
        name: 'LowcodeDev',
        path: '/lowcode/dev',
        title: '应用开发',
        icon: 'app',
        sort: 1,
        children: [
          { name: 'AppList', path: '/lowcode/app', component: 'views/lowcode/AppList.vue', title: '应用管理', icon: 'app', sort: 0, permission: 'lowcode:app' },
          { name: 'AppMarket', path: '/lowcode/app-market', component: 'views/lowcode/AppMarket.vue', title: '应用市场', icon: 'market', sort: 1, permission: 'lowcode:appMarket' },
          { name: 'PageList', path: '/lowcode/page', component: 'views/lowcode/PageList.vue', title: '自定义页面', icon: 'page', sort: 2, permission: 'lowcode:page' },
          { name: 'CustomApiList', path: '/lowcode/custom-api', component: 'views/lowcode/CustomApiList.vue', title: '自定义接口', icon: 'api', sort: 3, permission: 'lowcode:customApi' }
        ]
      },
      {
        name: 'LowcodeExtension',
        path: '/lowcode/extension',
        title: '扩展治理',
        icon: 'plugin',
        sort: 2,
        children: [
          { name: 'PluginList', path: '/lowcode/plugin', component: 'views/lowcode/PluginList.vue', title: '插件市场', icon: 'plugin', sort: 0, permission: 'lowcode:plugin' },
          { name: 'PrintTemplateList', path: '/lowcode/print-template', component: 'views/report/PrintTemplateList.vue', title: '打印模板', icon: 'print', sort: 1, permission: 'lowcode:printTemplate' },
          { name: 'AuditLogList', path: '/lowcode/audit-log', component: 'views/lowcode/AuditLogList.vue', title: '审计日志', icon: 'audit', sort: 2, permission: 'lowcode:auditLog' }
        ]
      }
    ]
  },
  {
    name: 'Message',
    path: '/message',
    title: '消息中心',
    icon: 'message',
    sort: 4,
    children: [
      { name: 'MessageList', path: '/message/list', component: 'views/monitor/MessageList.vue', title: '消息管理', icon: 'mail', sort: 1, permission: 'message:list' },
      { name: 'MessageTemplateList', path: '/message/template', component: 'views/monitor/MessageTemplateList.vue', title: '模板管理', icon: 'template', sort: 2, permission: 'message:template' }
    ]
  },
  {
    name: 'Monitor',
    path: '/monitor',
    title: '系统监控',
    icon: 'monitor',
    sort: 5,
    children: [
      { name: 'ServerMonitor', path: '/monitor/server', component: 'views/monitor/ServerMonitor.vue', title: '服务器监控', icon: 'server', sort: 1, permission: 'monitor:server' },
      { name: 'OperationLogList', path: '/monitor/operation-log', component: 'views/monitor/OperationLogList.vue', title: '操作日志', icon: 'log', sort: 2, permission: 'monitor:log' },
      { name: 'ScheduleList', path: '/monitor/schedule', component: 'views/monitor/ScheduleList.vue', title: '定时任务', icon: 'schedule', sort: 3, permission: 'monitor:schedule' }
    ]
  },
  {
    name: 'Flow',
    path: '/flow',
    title: '流程中心',
    icon: 'flow',
    sort: 6,
    children: [
      {
        name: 'FlowMy',
        path: '/flow/my',
        title: '我的流程',
        icon: 'task',
        sort: 0,
        children: [
          { name: 'PendingTaskList', path: '/flow/pending', component: 'views/flow/PendingTaskList.vue', title: '我的待办', icon: 'task', sort: 0, permission: 'flow:task' },
          { name: 'FlowDelegation', path: '/flow/delegation', component: 'views/flow/FlowDelegation.vue', title: '流程委托', icon: 'user', sort: 1, permission: 'flow:delegation' }
        ]
      },
      {
        name: 'FlowManage',
        path: '/flow/manage',
        title: '流程管理',
        icon: 'flowChart',
        sort: 1,
        children: [
          { name: 'FlowList', path: '/flow/list', component: 'views/flow/FlowList.vue', title: '流程定义', icon: 'flowChart', sort: 0, permission: 'flow:list' },
          { name: 'FlowPerformance', path: '/flow/performance', component: 'views/flow/FlowPerformance.vue', title: '流程绩效', icon: 'chart', sort: 1, permission: 'flow:performance' }
        ]
      }
    ]
  },
  {
    name: 'Report',
    path: '/report',
    title: '报表中心',
    icon: 'report',
    sort: 7,
    children: [
      { name: 'ReportList', path: '/report/list', component: 'views/report/ReportList.vue', title: '报表管理', icon: 'reportList', sort: 1, permission: 'report:list' }
    ]
  },
  {
    name: 'DashboardManager',
    path: '/dashboard-manager',
    title: '仪表盘配置',
    icon: 'dashboard',
    sort: 8,
    children: [
      { name: 'HomepageConfig', path: '/homepage/config', component: 'views/dashboard/HomepageConfig.vue', title: '首页配置', icon: 'home', sort: 1, permission: 'homepage:config' },
      { name: 'DashboardList', path: '/dashboard/list', component: 'views/dashboard/DashboardList.vue', title: '仪表盘管理', icon: 'chart', sort: 2, permission: 'dashboard:list' }
    ]
  }
]

/**
 * 深度优先插入菜单树（逐层建立 parent_id 关联）
 */
export async function insertMenuTree(knex: Knex, tenantId: string = GLOBAL_TENANT_ID): Promise<void> {
  async function insertNodes(nodes: MenuNode[], parentId: string | null) {
    for (const node of nodes) {
      const id = newId()
      await knex('menus').insert({
        id,
        parent_id: parentId,
        name: node.name,
        path: node.path,
        component: node.component ?? null,
        title: node.title,
        icon: node.icon ?? null,
        sort: node.sort,
        status: 1,
        permission: node.permission ?? null,
        tenant_id: tenantId
      })
      if (node.children?.length) {
        await insertNodes(node.children, id)
      }
    }
  }
  await insertNodes(MENU_TREE, null)
}

/**
 * 计算应保留的菜单 ID 集合：应用发布菜单（permission 以 app: 开头的根节点）及其全部后代。
 * 用于菜单结构重组时保护动态应用菜单不被误删。
 */
export function collectAppMenuIds(menus: Array<{ id: string; parent_id: string | null; permission: string | null }>): Set<string> {
  const keep = new Set<string>()
  const childrenMap = new Map<string, string[]>()
  for (const menu of menus) {
    if (menu.parent_id) {
      const list = childrenMap.get(menu.parent_id) ?? []
      list.push(menu.id)
      childrenMap.set(menu.parent_id, list)
    }
  }
  const queue = menus.filter((menu) => menu.permission?.startsWith('app:')).map((menu) => menu.id)
  while (queue.length) {
    const id = queue.shift()!
    if (keep.has(id)) continue
    keep.add(id)
    for (const childId of childrenMap.get(id) ?? []) {
      queue.push(childId)
    }
  }
  return keep
}

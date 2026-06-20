import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/views/layout/LowcodeLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '仪表盘', permission: 'dashboard' }
      },
      {
        path: 'system/user',
        name: 'UserList',
        component: () => import('@/views/system/UserList.vue'),
        meta: { title: '用户管理', permission: 'user:list' }
      },
      {
        path: 'system/role',
        name: 'RoleList',
        component: () => import('@/views/system/RoleList.vue'),
        meta: { title: '角色管理', permission: 'role:list' }
      },
      {
        path: 'system/menu',
        name: 'MenuList',
        component: () => import('@/views/system/MenuList.vue'),
        meta: { title: '菜单管理', permission: 'menu:list' }
      },
      {
        path: 'system/dept',
        name: 'DeptList',
        component: () => import('@/views/system/DeptList.vue'),
        meta: { title: '部门管理', permission: 'dept:list' }
      },
      {
        path: 'system/dict',
        name: 'DictList',
        component: () => import('@/views/system/DictList.vue'),
        meta: { title: '字典管理', permission: 'dict:list' }
      },
      {
        path: 'system/notice',
        name: 'NoticeList',
        component: () => import('@/views/system/NoticeList.vue'),
        meta: { title: '系统公告', permission: 'notice:list' }
      },
      {
        path: 'system/dict-category',
        name: 'DictCategoryList',
        component: () => import('@/views/system/DictCategoryList.vue'),
        meta: { title: '字典分类', permission: 'dict:list' }
      },
      {
        path: 'system/position',
        name: 'PositionList',
        component: () => import('@/views/system/PositionList.vue'),
        meta: { title: '职务管理', permission: 'position:list' }
      },
      {
        path: 'system/data-permission',
        name: 'DataPermissionList',
        component: () => import('@/views/system/DataPermissionList.vue'),
        meta: { title: '数据权限', permission: 'data-permission:list' }
      },
      {
        path: 'system/field-permission',
        name: 'FieldPermissionList',
        component: () => import('@/views/system/FieldPermissionList.vue'),
        meta: { title: '字段权限', permission: 'field-permission:list' }
      },
      {
        path: 'lowcode/model',
        name: 'ModelList',
        component: () => import('@/views/lowcode/ModelList.vue'),
        meta: { title: '数据模型', permission: 'lowcode:model' }
      },
      {
        path: 'lowcode/design/:id',
        name: 'ModelDesigner',
        component: () => import('@/views/lowcode/ModelDesigner.vue'),
        meta: { title: '模型设计', permission: 'lowcode:design' }
      },
      {
        path: 'lowcode/run/:modelCode',
        name: 'LowcodePage',
        component: () => import('@/views/lowcode/LowcodePage.vue'),
        meta: { title: '业务页面', permission: 'lowcode:run' }
      },
      {
        path: 'lowcode/coding-rule',
        name: 'CodingRuleList',
        component: () => import('@/views/lowcode/CodingRuleList.vue'),
        meta: { title: '编码规则', permission: 'lowcode:coding' }
      },
      {
        path: 'lowcode/validation-rule',
        name: 'ValidationRuleList',
        component: () => import('@/views/lowcode/ValidationRuleList.vue'),
        meta: { title: '校验规则', permission: 'lowcode:validate' }
      },
      {
        path: 'flow/list',
        name: 'FlowList',
        component: () => import('@/views/flow/FlowList.vue'),
        meta: { title: '流程定义', permission: 'flow:list' }
      },
      {
        path: 'flow/pending',
        name: 'PendingTaskList',
        component: () => import('@/views/flow/PendingTaskList.vue'),
        meta: { title: '我的待办', permission: 'flow:task' }
      },
      {
        path: 'message/list',
        name: 'MessageList',
        component: () => import('@/views/monitor/MessageList.vue'),
        meta: { title: '消息管理', permission: 'message:list' }
      },
      {
        path: 'message/template',
        name: 'MessageTemplateList',
        component: () => import('@/views/monitor/MessageTemplateList.vue'),
        meta: { title: '模板管理', permission: 'message:template' }
      },
      {
        path: 'monitor/server',
        name: 'ServerMonitor',
        component: () => import('@/views/monitor/ServerMonitor.vue'),
        meta: { title: '服务器监控', permission: 'monitor:server' }
      },
      {
        path: 'monitor/schedule',
        name: 'ScheduleList',
        component: () => import('@/views/monitor/ScheduleList.vue'),
        meta: { title: '定时任务', permission: 'monitor:schedule' }
      },
      {
        path: 'monitor/operation-log',
        name: 'OperationLogList',
        component: () => import('@/views/monitor/OperationLogList.vue'),
        meta: { title: '操作日志', permission: 'monitor:log' }
      },
      {
        path: 'profile',
        name: 'ProfilePage',
        component: () => import('@/views/pages/ProfilePage.vue'),
        meta: { title: '个人中心', permission: undefined }
      },
      {
        path: 'result',
        name: 'ResultPage',
        component: () => import('@/views/pages/ResultPage.vue'),
        meta: { title: '结果页', permission: undefined }
      },
      {
        path: 'homepage/config',
        name: 'HomepageConfig',
        component: () => import('@/views/dashboard/HomepageConfig.vue'),
        meta: { title: '首页配置', permission: 'homepage:config' }
      },
      {
        path: 'dashboard/list',
        name: 'DashboardList',
        component: () => import('@/views/dashboard/DashboardList.vue'),
        meta: { title: '仪表盘管理', permission: 'dashboard:list' }
      },
      {
        path: 'dashboard/design/:code',
        name: 'DashboardDesigner',
        component: () => import('@/views/dashboard/DashboardDesigner.vue'),
        meta: { title: '仪表盘设计', permission: 'dashboard:design' }
      },
      {
        path: 'dashboard/run/:code',
        name: 'DashboardRun',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '仪表盘', permission: 'dashboard:run' }
      },
      {
        path: 'report/list',
        name: 'ReportList',
        component: () => import('@/views/report/ReportList.vue'),
        meta: { title: '报表管理', permission: 'report:list' }
      },
      {
        path: 'report/design/:code',
        name: 'ReportDesigner',
        component: () => import('@/views/report/ReportDesigner.vue'),
        meta: { title: '报表设计', permission: 'report:design' }
      },
      {
        path: 'report/run/:code',
        name: 'ReportPage',
        component: () => import('@/views/report/ReportPage.vue'),
        meta: { title: '报表运行', permission: 'report:run' }
      },
      {
        path: 'lowcode/print-template',
        name: 'PrintTemplateList',
        component: () => import('@/views/report/PrintTemplateList.vue'),
        meta: { title: '打印模板', permission: 'lowcode:printTemplate' }
      },
      {
        path: 'print/design/:code',
        name: 'PrintTemplateDesigner',
        component: () => import('@/views/report/PrintTemplateDesigner.vue'),
        meta: { title: '打印模板设计', permission: 'lowcode:printTemplate' }
      },
      {
        path: 'print/preview/:code',
        name: 'PrintPreview',
        component: () => import('@/views/report/PrintPreview.vue'),
        meta: { title: '打印预览', permission: 'lowcode:printTemplate' }
      },
      {
        path: 'lowcode/external-datasource',
        name: 'ExternalDataSourceList',
        component: () => import('@/views/external-datasource/ExternalDataSourceList.vue'),
        meta: { title: '外部数据源', permission: 'lowcode:externalDatasource' }
      },
      {
        path: 'lowcode/page',
        name: 'PageList',
        component: () => import('@/views/lowcode/PageList.vue'),
        meta: { title: '自定义页面', permission: 'lowcode:page' }
      },
      {
        path: 'lowcode/page-design/:code',
        name: 'PageDesigner',
        component: () => import('@/views/lowcode/PageDesigner.vue'),
        meta: { title: '页面设计', permission: 'lowcode:pageDesign' }
      },
      {
        path: 'lowcode/page-run/:code',
        name: 'PageRunner',
        component: () => import('@/views/lowcode/PageRunner.vue'),
        meta: { title: '页面运行', permission: undefined }
      },
      {
        path: 'lowcode/app',
        name: 'AppList',
        component: () => import('@/views/lowcode/AppList.vue'),
        meta: { title: '应用管理', permission: 'lowcode:app' }
      },
      {
        path: 'lowcode/app-design/:code',
        name: 'AppDesigner',
        component: () => import('@/views/lowcode/AppDesigner.vue'),
        meta: { title: '应用设计', permission: 'lowcode:app' }
      },
      {
        path: 'lowcode/app-market',
        name: 'AppMarket',
        component: () => import('@/views/lowcode/AppMarket.vue'),
        meta: { title: '应用市场', permission: 'lowcode:appMarket' }
      },
      {
        path: 'lowcode/app-run/:code',
        name: 'AppRunner',
        component: () => import('@/views/lowcode/AppRunner.vue'),
        meta: { title: '应用运行', permission: undefined }
      },
      {
        path: 'lowcode/audit-log',
        name: 'AuditLogList',
        component: () => import('@/views/lowcode/AuditLogList.vue'),
        meta: { title: '审计日志', permission: 'lowcode:auditLog' }
      }
    ]
  },
  {
    path: '/exception/:code',
    name: 'ExceptionPage',
    component: () => import('@/views/pages/ExceptionPage.vue'),
    meta: { public: true, title: '异常页' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/exception/404'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router

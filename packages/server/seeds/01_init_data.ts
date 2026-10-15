import type { Knex } from 'knex'
import bcrypt from 'bcryptjs'
import { newId, ADMIN_ROLE_ID, GLOBAL_TENANT_ID } from '../src/utils/id.ts'
import { insertMenuTree } from '../src/modules/rbac/menu-tree-data.ts'

export async function seed(knex: Knex): Promise<void> {
  // 清空现有数据
  await knex('role_permissions').del()
  await knex('users').del()
  await knex('menus').del()
  await knex('depts').del()
  await knex('roles').del()
  await knex('dict_items').del()
  await knex('dicts').del()
  await knex('tenants').del()

  // 默认租户（全局租户使用固定 ULID，与代码常量保持一致）
  const defaultTenantId = GLOBAL_TENANT_ID
  await knex('tenants').insert({
    id: defaultTenantId,
    name: '默认租户',
    code: 'default',
    description: '系统默认租户',
    status: 1
  })

  // 角色（超级管理员角色使用固定 ULID，与代码常量保持一致）
  const adminRoleId = ADMIN_ROLE_ID
  await knex('roles').insert({
    id: adminRoleId,
    name: '超级管理员',
    code: 'admin',
    description: '全部权限',
    status: 1,
    tenant_id: GLOBAL_TENANT_ID
  })

  await knex('roles').insert([
    { id: newId(), name: '编辑', code: 'editor', description: '内容管理', status: 1, tenant_id: GLOBAL_TENANT_ID },
    { id: newId(), name: '访客', code: 'viewer', description: '只读权限', status: 1, tenant_id: GLOBAL_TENANT_ID }
  ])

  // 部门（根节点 parent_id 为 null）
  const devDeptId = newId()
  await knex('depts').insert({
    id: devDeptId,
    parent_id: null,
    name: '研发中心',
    code: 'RD',
    sort: 1,
    status: 1,
    tenant_id: GLOBAL_TENANT_ID
  })

  await knex('depts').insert([
    { id: newId(), parent_id: devDeptId, name: '前端组', code: 'RD-FE', sort: 1, status: 1, tenant_id: GLOBAL_TENANT_ID },
    { id: newId(), parent_id: devDeptId, name: '后端组', code: 'RD-BE', sort: 2, status: 1, tenant_id: GLOBAL_TENANT_ID }
  ])

  // 用户
  await knex('users').insert({
    id: newId(),
    username: 'admin',
    password: bcrypt.hashSync('admin', 10),
    nickname: '管理员',
    email: 'admin@example.com',
    phone: '13800000000',
    status: 1,
    dept_id: devDeptId,
    role_id: adminRoleId,
    tenant_id: GLOBAL_TENANT_ID
  })

  // 菜单（三级结构，树数据与迁移脚本共享：src/modules/rbac/menu-tree-data.ts）
  await insertMenuTree(knex)

  // 角色权限（超级管理员拥有所有权限）
  const permissions = ['*']
  await knex('role_permissions').insert(
    permissions.map((permission) => ({ id: newId(), role_id: adminRoleId, permission, tenant_id: GLOBAL_TENANT_ID }))
  )

  // 字典
  const statusDictId = newId()
  await knex('dicts').insert({
    id: statusDictId,
    name: '用户状态',
    code: 'user_status',
    description: '用户账号状态',
    status: 1,
    tenant_id: GLOBAL_TENANT_ID
  })

  await knex('dict_items').insert([
    { id: newId(), dict_id: statusDictId, label: '启用', value: '1', sort: 1, status: 1, tenant_id: GLOBAL_TENANT_ID },
    { id: newId(), dict_id: statusDictId, label: '禁用', value: '0', sort: 2, status: 1, tenant_id: GLOBAL_TENANT_ID }
  ])

  // 默认字典分类
  await knex('dict_categories').insert({
    id: newId(),
    name: '系统字典',
    code: 'system',
    sort: 1,
    status: 1,
    tenant_id: GLOBAL_TENANT_ID
  })

  // 默认职务
  await knex('positions').insert({
    id: newId(),
    name: '员工',
    code: 'employee',
    sort: 1,
    status: 1,
    tenant_id: GLOBAL_TENANT_ID
  })

  // 默认首页配置
  await knex('homepage_configs').insert({
    id: newId(),
    code: 'default',
    name: '默认首页',
    widgets: JSON.stringify([
      { type: 'stat', title: '用户数量', field: 'userCount', icon: 'user', color: 'primary', dataSource: { type: '' } },
      { type: 'stat', title: '数据模型', field: 'modelCount', icon: 'model', color: 'success', dataSource: { type: '' } },
      { type: 'stat', title: '消息', field: 'messageCount', icon: 'message', color: 'warning', dataSource: { type: '' } }
    ]),
    status: 1,
    tenant_id: GLOBAL_TENANT_ID
  })

  // 默认仪表盘
  await knex('dashboards').insert({
    id: newId(),
    code: 'default',
    name: '默认仪表盘',
    config: JSON.stringify({}),
    status: 1,
    tenant_id: GLOBAL_TENANT_ID
  })

  // 默认消息模板
  await knex('message_templates').insert({
    id: newId(),
    code: 'system_notice',
    name: '系统通知',
    title: '系统通知',
    content: '您有一条系统通知',
    channel: 'site',
    status: 1,
    tenant_id: GLOBAL_TENANT_ID
  })
}

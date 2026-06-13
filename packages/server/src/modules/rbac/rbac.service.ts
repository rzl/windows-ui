import bcrypt from 'bcryptjs'
import { db } from '../../db'
import { AppError } from '../../utils/response'

// 用户 CRUD
export async function getUsers(query: any) {
  const { keyword, status, page = 1, pageSize = 10 } = query

  const builder = db('users')
    .leftJoin('roles', 'users.role_id', 'roles.id')
    .leftJoin('depts', 'users.dept_id', 'depts.id')
    .select(
      'users.id',
      'users.username',
      'users.nickname',
      'users.email',
      'users.phone',
      'users.avatar',
      'users.status',
      'users.dept_id as deptId',
      'users.role_id as roleId',
      'roles.name as roleName',
      'depts.name as deptName',
      'users.create_time as createTime'
    )

  if (keyword) {
    builder.where((qb) => {
      qb.where('users.username', 'like', `%${keyword}%`)
        .orWhere('users.nickname', 'like', `%${keyword}%`)
        .orWhere('users.email', 'like', `%${keyword}%`)
    })
  }

  if (status !== undefined && status !== '') {
    builder.where('users.status', Number(status))
  }

  const total = await builder.clone().count({ count: '*' }).first()
  const list = await builder
    .orderBy('users.id', 'desc')
    .offset((Number(page) - 1) * Number(pageSize))
    .limit(Number(pageSize))

  return {
    list,
    total: Number(total?.count || 0),
    page: Number(page),
    pageSize: Number(pageSize)
  }
}

export async function getUserById(id: number) {
  const user = await db('users').where({ id }).first()
  if (!user) throw new AppError('用户不存在', 404)
  return user
}

export async function createUser(data: any) {
  const exists = await db('users').where({ username: data.username }).first()
  if (exists) throw new AppError('用户名已存在', 400)

  const password = bcrypt.hashSync(data.password || '123456', 10)
  const [id] = await db('users').insert({
    username: data.username,
    password,
    nickname: data.nickname,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    status: data.status ?? 1,
    dept_id: data.deptId,
    role_id: data.roleId
  })
  return getUserById(id)
}

export async function updateUser(id: number, data: any) {
  const user = await db('users').where({ id }).first()
  if (!user) throw new AppError('用户不存在', 404)

  const updateData: any = {
    nickname: data.nickname,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    status: data.status,
    dept_id: data.deptId,
    role_id: data.roleId,
    update_time: db.fn.now()
  }

  if (data.password) {
    updateData.password = bcrypt.hashSync(data.password, 10)
  }

  await db('users').where({ id }).update(updateData)
  return getUserById(id)
}

export async function deleteUsers(ids: number[]) {
  if (!ids.length) throw new AppError('请选择要删除的用户', 400)
  await db('users').whereIn('id', ids).del()
  return true
}

// 角色 CRUD
export async function getRoles() {
  return db('roles').orderBy('id', 'asc')
}

export async function createRole(data: any) {
  const [id] = await db('roles').insert({
    name: data.name,
    code: data.code,
    description: data.description,
    status: data.status ?? 1
  })

  if (data.permissions?.length) {
    await db('role_permissions').insert(
      data.permissions.map((p: string) => ({ role_id: id, permission: p }))
    )
  }

  return getRoleById(id)
}

export async function updateRole(id: number, data: any) {
  await db('roles').where({ id }).update({
    name: data.name,
    code: data.code,
    description: data.description,
    status: data.status,
    update_time: db.fn.now()
  })

  await db('role_permissions').where({ role_id: id }).del()
  if (data.permissions?.length) {
    await db('role_permissions').insert(
      data.permissions.map((p: string) => ({ role_id: id, permission: p }))
    )
  }

  return getRoleById(id)
}

export async function deleteRole(id: number) {
  await db('roles').where({ id }).del()
  return true
}

export async function getRoleById(id: number) {
  const role = await db('roles').where({ id }).first()
  if (!role) throw new AppError('角色不存在', 404)
  const permissions = await db('role_permissions')
    .where({ role_id: id })
    .pluck('permission')
  return { ...role, permissions }
}

// 菜单
export async function getMenuTree() {
  const menus = await db('menus').orderBy('sort', 'asc')
  return buildTree(menus, 0)
}

export async function getMenus() {
  return db('menus').orderBy('sort', 'asc')
}

export async function createMenu(data: any) {
  const [id] = await db('menus').insert({
    parent_id: data.parentId ?? 0,
    name: data.name,
    path: data.path,
    component: data.component,
    title: data.title,
    icon: data.icon,
    sort: data.sort ?? 0,
    status: data.status ?? 1,
    permission: data.permission
  })
  return db('menus').where({ id }).first()
}

export async function updateMenu(id: number, data: any) {
  await db('menus').where({ id }).update({
    parent_id: data.parentId,
    name: data.name,
    path: data.path,
    component: data.component,
    title: data.title,
    icon: data.icon,
    sort: data.sort,
    status: data.status,
    permission: data.permission
  })
  return db('menus').where({ id }).first()
}

export async function deleteMenu(id: number) {
  await db('menus').where({ id }).del()
  return true
}

// 部门
export async function getDeptTree() {
  const depts = await db('depts').orderBy('sort', 'asc')
  return buildTree(depts, 0)
}

export async function createDept(data: any) {
  const [id] = await db('depts').insert({
    parent_id: data.parentId ?? 0,
    name: data.name,
    code: data.code,
    sort: data.sort ?? 0,
    status: data.status ?? 1
  })
  return db('depts').where({ id }).first()
}

export async function updateDept(id: number, data: any) {
  await db('depts').where({ id }).update({
    parent_id: data.parentId,
    name: data.name,
    code: data.code,
    sort: data.sort,
    status: data.status
  })
  return db('depts').where({ id }).first()
}

export async function deleteDept(id: number) {
  await db('depts').where({ id }).del()
  return true
}

// 工具函数：构建树
function buildTree(items: any[], parentId: number): any[] {
  return items
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(items, item.id)
    }))
}

import type { Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as rbacService from './rbac.service'

// 用户
export async function getUsers(req: AuthRequest, res: Response) {
  const result = await rbacService.getUsers(req, req.query)
  res.json(success(result))
}

export async function getUser(req: AuthRequest, res: Response) {
  const result = await rbacService.getUserById(req, Number(req.params.id))
  res.json(success(result))
}

export async function createUser(req: AuthRequest, res: Response) {
  const result = await rbacService.createUser(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateUser(req: AuthRequest, res: Response) {
  const result = await rbacService.updateUser(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteUsers(req: AuthRequest, res: Response) {
  const { ids } = req.body
  await rbacService.deleteUsers(req, ids)
  res.json(success(null, '删除成功'))
}

// 角色
export async function getRoles(req: AuthRequest, res: Response) {
  const result = await rbacService.getRoles(req)
  res.json(success(result))
}

export async function getRole(req: AuthRequest, res: Response) {
  const result = await rbacService.getRoleById(req, Number(req.params.id))
  res.json(success(result))
}

export async function createRole(req: AuthRequest, res: Response) {
  const result = await rbacService.createRole(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateRole(req: AuthRequest, res: Response) {
  const result = await rbacService.updateRole(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteRole(req: AuthRequest, res: Response) {
  await rbacService.deleteRole(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 菜单
export async function getMenus(req: AuthRequest, res: Response) {
  const result = await rbacService.getMenus(req)
  res.json(success(result))
}

export async function getMenuTree(req: AuthRequest, res: Response) {
  const roleId = req.user?.roleId
  if (!roleId) {
    res.json(success([]))
    return
  }
  const result = await rbacService.getRoleMenuTree(req, roleId)
  res.json(success(result))
}

export async function createMenu(req: AuthRequest, res: Response) {
  const result = await rbacService.createMenu(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateMenu(req: AuthRequest, res: Response) {
  const result = await rbacService.updateMenu(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteMenu(req: AuthRequest, res: Response) {
  await rbacService.deleteMenu(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 部门
export async function getDeptTree(req: AuthRequest, res: Response) {
  const result = await rbacService.getDeptTree(req)
  res.json(success(result))
}

export async function createDept(req: AuthRequest, res: Response) {
  const result = await rbacService.createDept(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDept(req: AuthRequest, res: Response) {
  const result = await rbacService.updateDept(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDept(req: AuthRequest, res: Response) {
  await rbacService.deleteDept(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

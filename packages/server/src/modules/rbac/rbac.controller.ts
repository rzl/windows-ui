import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as rbacService from './rbac.service'

// 用户
export async function getUsers(req: Request, res: Response) {
  const result = await rbacService.getUsers(req.query)
  res.json(success(result))
}

export async function getUser(req: Request, res: Response) {
  const result = await rbacService.getUserById(Number(req.params.id))
  res.json(success(result))
}

export async function createUser(req: Request, res: Response) {
  const result = await rbacService.createUser(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateUser(req: Request, res: Response) {
  const result = await rbacService.updateUser(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteUsers(req: Request, res: Response) {
  const { ids } = req.body
  await rbacService.deleteUsers(ids)
  res.json(success(null, '删除成功'))
}

// 角色
export async function getRoles(_req: Request, res: Response) {
  const result = await rbacService.getRoles()
  res.json(success(result))
}

export async function getRole(req: Request, res: Response) {
  const result = await rbacService.getRoleById(Number(req.params.id))
  res.json(success(result))
}

export async function createRole(req: Request, res: Response) {
  const result = await rbacService.createRole(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateRole(req: Request, res: Response) {
  const result = await rbacService.updateRole(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteRole(req: Request, res: Response) {
  await rbacService.deleteRole(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 菜单
export async function getMenus(_req: Request, res: Response) {
  const result = await rbacService.getMenus()
  res.json(success(result))
}

export async function getMenuTree(req: AuthRequest, res: Response) {
  const roleId = req.user?.roleId
  if (!roleId) {
    res.json(success([]))
    return
  }
  const result = await rbacService.getRoleMenuTree(roleId)
  res.json(success(result))
}

export async function createMenu(req: Request, res: Response) {
  const result = await rbacService.createMenu(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateMenu(req: Request, res: Response) {
  const result = await rbacService.updateMenu(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteMenu(req: Request, res: Response) {
  await rbacService.deleteMenu(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 部门
export async function getDeptTree(_req: Request, res: Response) {
  const result = await rbacService.getDeptTree()
  res.json(success(result))
}

export async function createDept(req: Request, res: Response) {
  const result = await rbacService.createDept(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDept(req: Request, res: Response) {
  const result = await rbacService.updateDept(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDept(req: Request, res: Response) {
  await rbacService.deleteDept(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

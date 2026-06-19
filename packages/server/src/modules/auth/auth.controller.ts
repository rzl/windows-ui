import type { Request, Response, NextFunction } from 'express'
import { success } from '../../utils/response'
import * as authService from './auth.service'
import { loginSchema, refreshSchema, updateProfileSchema, changePasswordSchema } from './auth.dto'

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = loginSchema.parse(req.body)
    const result = await authService.login(dto)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = refreshSchema.parse(req.body)
    const result = await authService.refresh(dto)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export function logout(req: Request, res: Response) {
  const authHeader = req.headers.authorization
  const token = authHeader ? authHeader.substring(7) : ''
  authService.logout(token)
  res.json(success(null, '退出成功'))
}

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user
    const result = await authService.getProfile(user.id)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user
    const dto = updateProfileSchema.parse(req.body)
    const result = await authService.updateProfile(user.id, dto)
    res.json(success(result, '个人信息更新成功'))
  } catch (err) {
    next(err)
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user
    const dto = changePasswordSchema.parse(req.body)
    await authService.changePassword(user.id, dto)
    res.json(success(null, '密码修改成功'))
  } catch (err) {
    next(err)
  }
}

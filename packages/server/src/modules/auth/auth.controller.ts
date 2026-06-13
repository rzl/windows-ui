import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as authService from './auth.service'
import { loginSchema, refreshSchema } from './auth.dto'

export async function login(req: Request, res: Response) {
  const dto = loginSchema.parse(req.body)
  const result = await authService.login(dto)
  res.json(success(result))
}

export async function refresh(req: Request, res: Response) {
  const dto = refreshSchema.parse(req.body)
  const result = await authService.refresh(dto)
  res.json(success(result))
}

export function logout(req: Request, res: Response) {
  const authHeader = req.headers.authorization
  const token = authHeader ? authHeader.substring(7) : ''
  authService.logout(token)
  res.json(success(null, '退出成功'))
}

export async function profile(req: Request, res: Response) {
  const user = (req as any).user
  const result = await authService.getProfile(user.id)
  res.json(success(result))
}

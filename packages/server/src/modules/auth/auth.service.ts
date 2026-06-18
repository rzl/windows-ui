import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from '../../db'
import { config } from '../../config'
import { AppError } from '../../utils/response'
import { tokenBlacklist } from '../../middleware/auth'
import type { LoginDto, RefreshDto } from './auth.dto'

function generateTokens(payload: { id: number; username: string; roleId: number }) {
  const accessToken = jwt.sign(payload, config.jwt.secret as jwt.Secret, {
    expiresIn: config.jwt.accessExpires as jwt.SignOptions['expiresIn']
  })
  const refreshToken = jwt.sign(payload, config.jwt.secret as jwt.Secret, {
    expiresIn: config.jwt.refreshExpires as jwt.SignOptions['expiresIn']
  })
  return { accessToken, refreshToken }
}

export async function login(dto: LoginDto) {
  const user = await db('users').where({ username: dto.username }).first()

  if (!user) {
    throw new AppError('用户名或密码错误', 401)
  }

  if (user.status !== 1) {
    throw new AppError('账号已被禁用', 403)
  }

  const valid = bcrypt.compareSync(dto.password, user.password)
  if (!valid) {
    throw new AppError('用户名或密码错误', 401)
  }

  const tokens = generateTokens({
    id: user.id,
    username: user.username,
    roleId: user.role_id
  })

  return {
    ...tokens,
    userInfo: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      roleId: user.role_id,
      deptId: user.dept_id
    }
  }
}

export async function refresh(dto: RefreshDto) {
  try {
    const payload = jwt.verify(dto.refreshToken, config.jwt.secret as jwt.Secret) as {
      id: number
      username: string
      roleId: number
    }
    return generateTokens(payload)
  } catch {
    throw new AppError('刷新令牌无效或已过期', 401)
  }
}

export function logout(token: string) {
  tokenBlacklist.add(token)
  return true
}

export async function getProfile(userId: number) {
  const user = await db('users')
    .where('users.id', userId)
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
      'depts.name as deptName'
    )
    .first()

  if (!user) {
    throw new AppError('用户不存在', 404)
  }

  // 获取角色权限
  const permissions = await db('role_permissions')
    .where('role_id', user.roleId)
    .pluck('permission')

  // 超级管理员直接返回，不额外聚合应用权限
  if (permissions.includes('*') || user.roleId === 1) {
    return {
      ...user,
      permissions
    }
  }

  // 聚合角色授权的应用权限 app:${code}
  const appPermissions = await db('role_apps')
    .where({ 'role_apps.role_id': user.roleId, 'role_apps.status': 1 })
    .join('lowcode_apps', 'role_apps.app_id', 'lowcode_apps.id')
    .where({ 'lowcode_apps.status': 1 })
    .pluck('lowcode_apps.code')
    .then((codes) => codes.map((code) => `app:${code}`))

  return {
    ...user,
    permissions: [...permissions, ...appPermissions]
  }
}

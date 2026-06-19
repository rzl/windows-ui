import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空')
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, '刷新令牌不能为空')
})

export const updateProfileSchema = z.object({
  nickname: z.string().max(50, '昵称最多 50 个字符').optional().or(z.literal('')),
  email: z.string().email('邮箱格式不正确').optional().or(z.literal('')),
  phone: z.string().max(20, '手机号最多 20 个字符').optional().or(z.literal('')),
  avatar: z.string().max(255, '头像地址过长').optional().or(z.literal(''))
})

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, '原密码不能为空'),
  newPassword: z.string().min(6, '新密码至少 6 位')
})

export type LoginDto = z.infer<typeof loginSchema>
export type RefreshDto = z.infer<typeof refreshSchema>
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>

import { ulid } from 'ulid'

/**
 * 生成全局唯一 ID（当前为 ULID；切换 UUID 时只需改这里及列长度）
 * 列长度统一声明为 36，可同时容纳 ULID(26) 与 UUID(36)
 */
export const newId = (): string => ulid()

/** 超级管理员角色固定 ID（种子中 admin 角色使用同一字面量） */
export const ADMIN_ROLE_ID = '01J0000000000000000000000'

/** 全局租户固定 ID（超管所属租户，不做租户隔离） */
export const GLOBAL_TENANT_ID = '01J0000000000000000000001'

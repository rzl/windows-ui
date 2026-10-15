import type { Knex } from 'knex'
import { collectAppMenuIds, insertMenuTree } from '../src/modules/rbac/menu-tree-data.ts'

/**
 * 菜单结构重组：两级 → 三级
 *
 * - 「系统管理」「在线开发」「流程中心」下新增职能分组（组织/权限/基础配置、数据建模/应用开发/扩展治理、我的流程/流程管理）
 * - 所有叶子页面的 path / component / permission / title / icon 保持不变
 * - 应用发布产生的动态菜单（permission 以 app: 开头的根节点及其后代）原样保留
 *
 * 树数据与种子共享：src/modules/rbac/menu-tree-data.ts
 */
export async function up(knex: Knex): Promise<void> {
  // 已是新结构（如重跑过 seed）则跳过
  const grouped = await knex('menus').where({ name: 'SystemOrg' }).first()
  if (grouped) return

  const menus = await knex('menus').select('id', 'parent_id', 'permission')
  const keepIds = collectAppMenuIds(menus)
  const removeIds = menus.map((menu: { id: string }) => menu.id).filter((id: string) => !keepIds.has(id))
  if (removeIds.length) {
    await knex('menus').whereIn('id', removeIds).del()
  }

  await insertMenuTree(knex)
}

export async function down(knex: Knex): Promise<void> {
  // 旧两级菜单树无法直接还原（历史迁移为逐批插入），此处仅移除新结构静态菜单，
  // 应用发布菜单保留；如需旧结构请回滚后重新执行 seed
  const menus = await knex('menus').select('id', 'parent_id', 'permission')
  const keepIds = collectAppMenuIds(menus)
  const removeIds = menus.map((menu: { id: string }) => menu.id).filter((id: string) => !keepIds.has(id))
  if (removeIds.length) {
    await knex('menus').whereIn('id', removeIds).del()
  }
}

import { db } from '../../db'
import { AppError } from '../../utils/response'
import { tenantWhere, setTenantId } from '../../utils/tenant'
import type { AuthRequest } from '../../middleware/auth'

export interface AppItem {
  type: 'model' | 'report' | 'dashboard' | 'flow' | 'print' | 'datasource' | 'page'
  refCode: string
  refName?: string
  sort?: number
}

export interface AppForm {
  id?: number
  code?: string
  name?: string
  category?: string
  icon?: string
  description?: string
  status?: number
  isMarket?: number
  items?: AppItem[]
  portalConfig?: any
}

function parsePortalConfig(value: any) {
  if (!value) return null
  try {
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch {
    return null
  }
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

export async function getApps(req: AuthRequest) {
  return db('lowcode_apps').where(tenantWhere(req)).orderBy('id', 'desc')
}

export async function getMarketApps(req: AuthRequest) {
  return db('lowcode_apps')
    .where({ status: 1, is_market: 1 })
    .where(tenantWhere(req))
    .orderBy('id', 'desc')
}

export async function getAppByCode(req: AuthRequest, code: string) {
  const app = await db('lowcode_apps').where({ code }).where(tenantWhere(req)).first()
  if (!app) throw new AppError('应用不存在', 404)
  const items = await db('lowcode_app_items').where({ app_id: app.id }).where(tenantWhere(req)).orderBy('sort', 'asc')
  return { ...app, items, portalConfig: parsePortalConfig(app.portal_config) }
}

export async function getAppById(req: AuthRequest, id: number) {
  const app = await db('lowcode_apps').where({ id }).where(tenantWhere(req)).first()
  if (!app) throw new AppError('应用不存在', 404)
  const items = await db('lowcode_app_items').where({ app_id: app.id }).where(tenantWhere(req)).orderBy('sort', 'asc')
  return { ...app, items, portalConfig: parsePortalConfig(app.portal_config) }
}

export async function saveApp(req: AuthRequest, data: AppForm) {
  const code = safeCode(data.code || data.name || '')
  if (!code) throw new AppError('应用编码不能为空', 400)

  const items = data.items || []
  const exists = await db('lowcode_apps').where({ code }).where(tenantWhere(req)).first()

  let appId: number
  const portalConfig = data.portalConfig
    ? (typeof data.portalConfig === 'string' ? data.portalConfig : JSON.stringify(data.portalConfig))
    : null

  if (exists) {
    await db('lowcode_apps').where({ code }).where(tenantWhere(req)).update({
      name: data.name,
      category: data.category,
      icon: data.icon,
      description: data.description,
      status: data.status ?? 1,
      is_market: data.isMarket ?? 1,
      portal_config: portalConfig,
      update_time: db.fn.now()
    })
    appId = exists.id
    await db('lowcode_app_items').where({ app_id: appId }).where(tenantWhere(req)).del()
  } else {
    const insertData = setTenantId({
      code,
      name: data.name,
      category: data.category,
      icon: data.icon,
      description: data.description,
      status: data.status ?? 1,
      is_market: data.isMarket ?? 1,
      portal_config: portalConfig
    }, req)
    const [id] = await db('lowcode_apps').insert(insertData)
    appId = id
  }

  if (items.length) {
    const app = await db('lowcode_apps').where({ id: appId }).first()
    const tenantId = app?.tenant_id ?? 0
    await db('lowcode_app_items').insert(
      items.map((item, index) => ({
        app_id: appId,
        type: item.type,
        ref_code: item.refCode,
        ref_name: item.refName || '',
        sort: item.sort ?? index,
        tenant_id: tenantId
      }))
    )
  }

  return getAppById(req, appId)
}

export async function deleteApp(req: AuthRequest, id: number) {
  await db('lowcode_app_items').where({ app_id: id }).where(tenantWhere(req)).del()
  await db('lowcode_app_versions').where({ app_id: id }).where(tenantWhere(req)).del()
  await db('lowcode_apps').where({ id }).where(tenantWhere(req)).del()
  return true
}

export async function createSnapshot(req: AuthRequest, id: number, data: { version: string; description?: string }) {
  const app = await getAppById(req, id)
  const version = data.version || `v${Date.now()}`
  const snapshot = JSON.stringify({
    app: {
      code: app.code,
      name: app.name,
      category: app.category,
      icon: app.icon,
      description: app.description,
      status: app.status,
      is_market: app.is_market,
      portalConfig: app.portalConfig
    },
    items: app.items
  })

  const insertData = setTenantId({
    app_id: id,
    version,
    snapshot,
    description: data.description || '',
    is_published: 0
  }, req)
  const [versionId] = await db('lowcode_app_versions').insert(insertData)

  return db('lowcode_app_versions').where({ id: versionId }).first()
}

export async function publishVersion(req: AuthRequest, id: number, versionId: number) {
  const app = await getAppById(req, id)
  const version = await db('lowcode_app_versions').where({ id: versionId, app_id: id }).where(tenantWhere(req)).first()
  if (!version) throw new AppError('版本不存在', 404)

  await db('lowcode_app_versions').where({ app_id: id }).where(tenantWhere(req)).update({ is_published: 0 })
  await db('lowcode_app_versions').where({ id: versionId }).where(tenantWhere(req)).update({ is_published: 1 })
  await db('lowcode_apps').where({ id }).where(tenantWhere(req)).update({ published_version_id: versionId, update_time: db.fn.now() })

  // 自动发布应用菜单
  await publishAppMenus(req, app)

  return getAppById(req, id)
}

export async function rollbackVersion(req: AuthRequest, id: number, versionId: number) {
  const app = await getAppById(req, id)
  const version = await db('lowcode_app_versions').where({ id: versionId, app_id: id }).where(tenantWhere(req)).first()
  if (!version) throw new AppError('版本不存在', 404)

  const snapshot = JSON.parse(version.snapshot)
  await db('lowcode_apps').where({ id }).where(tenantWhere(req)).update({
    name: snapshot.app.name,
    category: snapshot.app.category,
    icon: snapshot.app.icon,
    description: snapshot.app.description,
    status: snapshot.app.status,
    is_market: snapshot.app.is_market ?? 1,
    portal_config: snapshot.app.portalConfig ? JSON.stringify(snapshot.app.portalConfig) : null,
    update_time: db.fn.now()
  })

  await db('lowcode_app_items').where({ app_id: id }).where(tenantWhere(req)).del()
  if (snapshot.items?.length) {
    const tenantId = app.tenant_id ?? 0
    await db('lowcode_app_items').insert(
      snapshot.items.map((item: any, index: number) => ({
        app_id: id,
        type: item.type,
        ref_code: item.refCode || item.ref_code,
        ref_name: item.refName || item.ref_name || '',
        sort: item.sort ?? index,
        tenant_id: tenantId
      }))
    )
  }

  await publishAppMenus(req, await getAppById(req, id))
  return getAppById(req, id)
}

export async function getAppVersions(req: AuthRequest, id: number) {
  return db('lowcode_app_versions').where({ app_id: id }).where(tenantWhere(req)).orderBy('id', 'desc')
}

export async function exportApp(req: AuthRequest, id: number) {
  const app = await getAppById(req, id)
  const version = await db('lowcode_app_versions')
    .where({ app_id: id, is_published: 1 })
    .where(tenantWhere(req))
    .orderBy('id', 'desc')
    .first()

  const snapshot = version ? JSON.parse(version.snapshot) : { app: {}, items: [] }
  return {
    code: app.code,
    name: app.name,
    version: version?.version || 'draft',
    ...snapshot
  }
}

export async function importApp(req: AuthRequest, data: any) {
  const code = safeCode(data.code || data.name || '')
  if (!code) throw new AppError('应用编码不能为空', 400)

  const exists = await db('lowcode_apps').where({ code }).where(tenantWhere(req)).first()
  if (exists) throw new AppError('应用编码已存在，请修改后重新导入', 400)

  const appData: AppForm = {
    code,
    name: data.name,
    category: data.category,
    icon: data.icon,
    description: data.description,
    status: 0, // 导入后默认禁用，需手动发布
    isMarket: data.app?.is_market ?? 1,
    portalConfig: data.app?.portalConfig || data.portalConfig,
    items: (data.items || []).map((item: any) => ({
      type: item.type,
      refCode: item.refCode || item.ref_code,
      refName: item.refName || item.ref_name || '',
      sort: item.sort ?? 0
    }))
  }

  return saveApp(req, appData)
}

export async function grantAppToRole(req: AuthRequest, appId: number, roleId: number) {
  const exists = await db('role_apps').where({ app_id: appId, role_id: roleId }).where(tenantWhere(req)).first()
  if (exists) return
  const insertData = setTenantId({
    app_id: appId,
    role_id: roleId,
    status: 1
  }, req)
  await db('role_apps').insert(insertData)
}

export async function publishAppMenus(req: AuthRequest, app: any) {
  const lowcodeParent = await db('menus').where({ name: 'Lowcode', path: '/lowcode' }).where(tenantWhere(req)).first()
  if (!lowcodeParent) return

  // 应用根菜单
  const appPath = `/lowcode/app-run/${app.code}`
  let appMenu = await db('menus').where({ path: appPath }).where(tenantWhere(req)).first()
  if (!appMenu) {
    const insertData = setTenantId({
      parent_id: 0,
      name: `App_${app.code}`,
      path: appPath,
      title: app.name,
      icon: app.icon || 'app',
      sort: 200 + app.id,
      status: app.status,
      permission: `app:${app.code}`
    }, req)
    const [appMenuId] = await db('menus').insert(insertData)
    appMenu = await db('menus').where({ id: appMenuId }).first()
  } else {
    await db('menus').where({ id: appMenu.id }).where(tenantWhere(req)).update({
      title: app.name,
      icon: app.icon || 'app',
      status: app.status,
      permission: `app:${app.code}`
    })
  }

  // 同步应用市场上架状态
  await db('lowcode_apps').where({ id: app.id }).where(tenantWhere(req)).update({
    is_market: app.is_market ?? 1,
    update_time: db.fn.now()
  })

  // 清理旧子菜单
  await db('menus').where({ parent_id: appMenu.id }).where(tenantWhere(req)).del()

  // 根据应用项生成子菜单
  const items: any[] = app.items || []
  const pageCodes = items.filter((item) => item.type === 'page').map((item) => item.ref_code)
  const pagePermissionMap: Record<string, string> = {}
  if (pageCodes.length) {
    const pages = await db('lowcode_pages').whereIn('code', pageCodes).where(tenantWhere(req)).select('code', 'permission')
    pages.forEach((p: any) => {
      pagePermissionMap[p.code] = p.permission || `page:${p.code}`
    })
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const menuItem = await buildMenuItem(req, item, appMenu.id, i, pagePermissionMap)
    if (menuItem) await db('menus').insert(menuItem)
  }
}

async function buildMenuItem(req: AuthRequest, item: any, parentId: number, sort: number, pagePermissionMap: Record<string, string> = {}): Promise<any> {
  const base = {
    parent_id: parentId,
    name: `${item.type}_${item.ref_code}`,
    title: item.ref_name || item.ref_code,
    sort,
    status: 1,
    permission: item.type === 'page' ? (pagePermissionMap[item.ref_code] || `page:${item.ref_code}`) : `${item.type}:${item.ref_code}`
  }

  const menuData = setTenantId(base, req)

  switch (item.type) {
    case 'model':
      return {
        ...menuData,
        path: `/lowcode/run/${item.ref_code}`,
        component: 'views/lowcode/LowcodePage.vue',
        icon: 'table'
      }
    case 'report':
      return {
        ...menuData,
        path: `/report/run/${item.ref_code}`,
        component: 'views/report/ReportPage.vue',
        icon: 'chart'
      }
    case 'dashboard':
      return {
        ...menuData,
        path: `/dashboard/run/${item.ref_code}`,
        component: 'views/dashboard/Dashboard.vue',
        icon: 'dashboard'
      }
    case 'flow':
      return {
        ...menuData,
        path: '/flow/pending',
        component: 'views/flow/PendingTaskList.vue',
        icon: 'flow'
      }
    case 'print':
      return {
        ...menuData,
        path: `/print/preview/${item.ref_code}`,
        component: 'views/report/PrintPreview.vue',
        icon: 'printer'
      }
    case 'page':
      return {
        ...menuData,
        path: `/lowcode/page-run/${item.ref_code}`,
        component: 'views/lowcode/PageRunner.vue',
        icon: 'page'
      }
    default:
      return null
  }
}

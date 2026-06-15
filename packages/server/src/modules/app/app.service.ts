import { db } from '../../db'
import { AppError } from '../../utils/response'

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
  items?: AppItem[]
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

export async function getApps() {
  return db('lowcode_apps').orderBy('id', 'desc')
}

export async function getAppByCode(code: string) {
  const app = await db('lowcode_apps').where({ code }).first()
  if (!app) throw new AppError('应用不存在', 404)
  const items = await db('lowcode_app_items').where({ app_id: app.id }).orderBy('sort', 'asc')
  return { ...app, items }
}

export async function getAppById(id: number) {
  const app = await db('lowcode_apps').where({ id }).first()
  if (!app) throw new AppError('应用不存在', 404)
  const items = await db('lowcode_app_items').where({ app_id: app.id }).orderBy('sort', 'asc')
  return { ...app, items }
}

export async function saveApp(data: AppForm) {
  const code = safeCode(data.code || data.name || '')
  if (!code) throw new AppError('应用编码不能为空', 400)

  const items = data.items || []
  const exists = await db('lowcode_apps').where({ code }).first()

  let appId: number
  if (exists) {
    await db('lowcode_apps').where({ code }).update({
      name: data.name,
      category: data.category,
      icon: data.icon,
      description: data.description,
      status: data.status ?? 1,
      update_time: db.fn.now()
    })
    appId = exists.id
    await db('lowcode_app_items').where({ app_id: appId }).del()
  } else {
    const [id] = await db('lowcode_apps').insert({
      code,
      name: data.name,
      category: data.category,
      icon: data.icon,
      description: data.description,
      status: data.status ?? 1
    })
    appId = id
  }

  if (items.length) {
    await db('lowcode_app_items').insert(
      items.map((item, index) => ({
        app_id: appId,
        type: item.type,
        ref_code: item.refCode,
        ref_name: item.refName || '',
        sort: item.sort ?? index
      }))
    )
  }

  return getAppById(appId)
}

export async function deleteApp(id: number) {
  await db('lowcode_app_items').where({ app_id: id }).del()
  await db('lowcode_app_versions').where({ app_id: id }).del()
  await db('lowcode_apps').where({ id }).del()
  return true
}

export async function createSnapshot(id: number, data: { version: string; description?: string }) {
  const app = await getAppById(id)
  const version = data.version || `v${Date.now()}`
  const snapshot = JSON.stringify({
    app: {
      code: app.code,
      name: app.name,
      category: app.category,
      icon: app.icon,
      description: app.description,
      status: app.status
    },
    items: app.items
  })

  const [versionId] = await db('lowcode_app_versions').insert({
    app_id: id,
    version,
    snapshot,
    description: data.description || '',
    is_published: 0
  })

  return db('lowcode_app_versions').where({ id: versionId }).first()
}

export async function publishVersion(id: number, versionId: number) {
  const app = await getAppById(id)
  const version = await db('lowcode_app_versions').where({ id: versionId, app_id: id }).first()
  if (!version) throw new AppError('版本不存在', 404)

  await db('lowcode_app_versions').where({ app_id: id }).update({ is_published: 0 })
  await db('lowcode_app_versions').where({ id: versionId }).update({ is_published: 1 })
  await db('lowcode_apps').where({ id }).update({ published_version_id: versionId, update_time: db.fn.now() })

  // 自动发布应用菜单
  await publishAppMenus(app)

  return getAppById(id)
}

export async function rollbackVersion(id: number, versionId: number) {
  const app = await getAppById(id)
  const version = await db('lowcode_app_versions').where({ id: versionId, app_id: id }).first()
  if (!version) throw new AppError('版本不存在', 404)

  const snapshot = JSON.parse(version.snapshot)
  await db('lowcode_apps').where({ id }).update({
    name: snapshot.app.name,
    category: snapshot.app.category,
    icon: snapshot.app.icon,
    description: snapshot.app.description,
    status: snapshot.app.status,
    update_time: db.fn.now()
  })

  await db('lowcode_app_items').where({ app_id: id }).del()
  if (snapshot.items?.length) {
    await db('lowcode_app_items').insert(
      snapshot.items.map((item: any, index: number) => ({
        app_id: id,
        type: item.type,
        ref_code: item.refCode || item.ref_code,
        ref_name: item.refName || item.ref_name || '',
        sort: item.sort ?? index
      }))
    )
  }

  await publishAppMenus(await getAppById(id))
  return getAppById(id)
}

export async function getAppVersions(id: number) {
  return db('lowcode_app_versions').where({ app_id: id }).orderBy('id', 'desc')
}

export async function exportApp(id: number) {
  const app = await getAppById(id)
  const version = await db('lowcode_app_versions')
    .where({ app_id: id, is_published: 1 })
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

export async function importApp(data: any) {
  const code = safeCode(data.code || data.name || '')
  if (!code) throw new AppError('应用编码不能为空', 400)

  const exists = await db('lowcode_apps').where({ code }).first()
  if (exists) throw new AppError('应用编码已存在，请修改后重新导入', 400)

  const appData: AppForm = {
    code,
    name: data.name,
    category: data.category,
    icon: data.icon,
    description: data.description,
    status: 0, // 导入后默认禁用，需手动发布
    items: (data.items || []).map((item: any) => ({
      type: item.type,
      refCode: item.refCode || item.ref_code,
      refName: item.refName || item.ref_name || '',
      sort: item.sort ?? 0
    }))
  }

  return saveApp(appData)
}

async function publishAppMenus(app: any) {
  const lowcodeParent = await db('menus').where({ name: 'Lowcode', path: '/lowcode' }).first()
  if (!lowcodeParent) return

  // 应用根菜单
  const appPath = `/lowcode/app-run/${app.code}`
  let appMenu = await db('menus').where({ path: appPath }).first()
  if (!appMenu) {
    const [appMenuId] = await db('menus').insert({
      parent_id: 0,
      name: `App_${app.code}`,
      path: appPath,
      title: app.name,
      icon: app.icon || 'app',
      sort: 200 + app.id,
      status: app.status,
      permission: `app:${app.code}`
    })
    appMenu = await db('menus').where({ id: appMenuId }).first()
  } else {
    await db('menus').where({ id: appMenu.id }).update({
      title: app.name,
      icon: app.icon || 'app',
      status: app.status,
      permission: `app:${app.code}`
    })
  }

  // 清理旧子菜单
  await db('menus').where({ parent_id: appMenu.id }).del()

  // 根据应用项生成子菜单
  const items: any[] = app.items || []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const menuItem = buildMenuItem(item, appMenu.id, i)
    if (menuItem) await db('menus').insert(menuItem)
  }
}

function buildMenuItem(item: any, parentId: number, sort: number): any {
  const base = {
    parent_id: parentId,
    name: `${item.type}_${item.ref_code}`,
    title: item.ref_name || item.ref_code,
    sort,
    status: 1,
    permission: `${item.type}:${item.ref_code}`
  }

  switch (item.type) {
    case 'model':
      return {
        ...base,
        path: `/lowcode/run/${item.ref_code}`,
        component: 'views/lowcode/LowcodePage.vue',
        icon: 'table'
      }
    case 'report':
      return {
        ...base,
        path: `/report/run/${item.ref_code}`,
        component: 'views/report/ReportPage.vue',
        icon: 'chart'
      }
    case 'dashboard':
      return {
        ...base,
        path: `/dashboard/run/${item.ref_code}`,
        component: 'views/dashboard/Dashboard.vue',
        icon: 'dashboard'
      }
    case 'flow':
      return {
        ...base,
        path: '/flow/pending',
        component: 'views/flow/PendingTaskList.vue',
        icon: 'flow'
      }
    case 'print':
      return {
        ...base,
        path: `/print/preview/${item.ref_code}`,
        component: 'views/report/PrintPreview.vue',
        icon: 'printer'
      }
    default:
      return null
  }
}

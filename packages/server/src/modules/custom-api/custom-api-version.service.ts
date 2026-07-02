import { db } from '../../db'
import { AppError } from '../../utils/response'
import { tenantWhere, setTenantId } from '../../utils/tenant'
import type { AuthRequest } from '../../middleware/auth'
import { getCustomApiById, updateCustomApi } from './custom-api.service'

export async function getCustomApiVersions(req: AuthRequest, apiId: number) {
  await getCustomApiById(req, apiId)
  return db('lowcode_custom_api_versions')
    .where({ api_id: apiId })
    .where(tenantWhere(req))
    .orderBy('id', 'desc')
}

export async function createCustomApiVersion(req: AuthRequest, apiId: number, data: any) {
  const api = await getCustomApiById(req, apiId)

  const snapshot = {
    name: api.name,
    method: api.method,
    path: api.path,
    description: api.description,
    script: api.script,
    status: api.status,
    is_public: api.is_public
  }

  await db('lowcode_custom_api_versions')
    .where({ api_id: apiId })
    .where(tenantWhere(req))
    .update({ is_published: 0 })

  const [id] = await db('lowcode_custom_api_versions').insert(
    setTenantId(
      {
        api_id: apiId,
        version: data.version || generateVersion(),
        description: data.description || '',
        snapshot: JSON.stringify(snapshot),
        is_published: 1
      },
      req
    )
  )

  return db('lowcode_custom_api_versions').where({ id }).where(tenantWhere(req)).first()
}

export async function deleteCustomApiVersion(req: AuthRequest, apiId: number, versionId: number) {
  const version = await db('lowcode_custom_api_versions')
    .where({ id: versionId, api_id: apiId })
    .where(tenantWhere(req))
    .first()
  if (!version) throw new AppError('版本不存在', 404)
  await db('lowcode_custom_api_versions').where({ id: versionId }).where(tenantWhere(req)).del()
  return true
}

export async function rollbackCustomApiVersion(req: AuthRequest, apiId: number, versionId: number) {
  const version = await db('lowcode_custom_api_versions')
    .where({ id: versionId, api_id: apiId })
    .where(tenantWhere(req))
    .first()
  if (!version) throw new AppError('版本不存在', 404)

  const snapshot = parseJson(version.snapshot)
  if (!snapshot) throw new AppError('快照数据无效', 400)

  await updateCustomApi(req, apiId, {
    name: snapshot.name,
    method: snapshot.method,
    path: snapshot.path,
    description: snapshot.description,
    script: snapshot.script,
    status: snapshot.status,
    isPublic: snapshot.is_public
  })

  await db('lowcode_custom_api_versions')
    .where({ api_id: apiId })
    .where(tenantWhere(req))
    .update({ is_published: 0 })
  await db('lowcode_custom_api_versions')
    .where({ id: versionId })
    .where(tenantWhere(req))
    .update({ is_published: 1 })

  return getCustomApiById(req, apiId)
}

function parseJson(value: any) {
  if (value === null || value === undefined) return null
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function generateVersion() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0')
  return `v${date}.${time}`
}

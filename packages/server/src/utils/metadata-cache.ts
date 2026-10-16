/**
 * 低代码元数据进程内缓存。
 *
 * 模型/字段/表单/插件等元数据是典型的"低频写、高频读"数据，
 * 此前每个动态 CRUD 请求都会重复查询 10~20 次元数据。
 * 这里提供带 TTL 的进程内缓存，配合设计时变更的全量失效：
 * - TTL 30 秒兜底（防漏失效，字典等弱一致数据可接受秒级延迟）
 * - 任何模型/字段/插件变更后调用 invalidateMetadataCache() 全量清空
 * 当前为单实例部署；多实例部署需升级为 Redis 发布/订阅失效。
 */
const store = new Map<string, { value: any; expires: number }>()

const TTL_MS = 30 * 1000

export function getCachedMetadata<T = any>(key: string): T | undefined {
  const hit = store.get(key)
  if (!hit) return undefined
  if (hit.expires <= Date.now()) {
    store.delete(key)
    return undefined
  }
  return hit.value as T
}

export function setCachedMetadata(key: string, value: any) {
  store.set(key, { value, expires: Date.now() + TTL_MS })
}

/** 设计时变更后全量清空（元数据量级小，全量失效成本可忽略） */
export function invalidateMetadataCache() {
  store.clear()
}

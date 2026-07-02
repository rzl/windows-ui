import { config } from '../config'

export interface RateLimitRecord {
  count: number
  resetTime: number
}

export interface RateLimitStore {
  get(key: string): Promise<RateLimitRecord | undefined>
  set(key: string, record: RateLimitRecord): Promise<void>
  increment(key: string): Promise<number>
}

class MemoryRateLimitStore implements RateLimitStore {
  private map = new Map<string, RateLimitRecord>()

  async get(key: string) {
    return this.map.get(key)
  }

  async set(key: string, record: RateLimitRecord) {
    this.map.set(key, record)
  }

  async increment(key: string) {
    const record = this.map.get(key)
    if (!record) return 0
    record.count++
    return record.count
  }
}

class RedisRateLimitStore implements RateLimitStore {
  private redis: any

  constructor(redis: any) {
    this.redis = redis
  }

  async get(key: string) {
    const data = await this.redis.get(key)
    if (!data) return undefined
    try {
      return JSON.parse(data) as RateLimitRecord
    } catch {
      return undefined
    }
  }

  async set(key: string, record: RateLimitRecord) {
    const ttl = Math.max(1, Math.ceil((record.resetTime - Date.now()) / 1000))
    await this.redis.setex(key, ttl, JSON.stringify(record))
  }

  async increment(key: string) {
    const record = await this.get(key)
    if (!record) return 0
    record.count++
    await this.set(key, record)
    return record.count
  }
}

export async function createRateLimitStore(): Promise<RateLimitStore> {
  if (config.redis.url) {
    try {
      const { Redis } = await import('ioredis')
      const redis = new Redis(config.redis.url)
      return new RedisRateLimitStore(redis)
    } catch (err) {
      console.warn('Redis 频率限制存储初始化失败，降级为内存存储', err)
    }
  }
  return new MemoryRateLimitStore()
}

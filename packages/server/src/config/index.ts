import dotenv from 'dotenv'
import crypto from 'crypto'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// 内部服务调用密钥：脚本沙箱 / 仪表盘数据源访问本机 API 时使用，
// 默认每次启动随机生成，外部进程无法猜测；生产环境建议通过 .env 固定
const internalSecret = process.env.INTERNAL_API_SECRET || crypto.randomBytes(32).toString('hex')

export const config = {
  port: Number(process.env.PORT || 9002),
  nodeEnv: process.env.NODE_ENV || 'development',
  internalSecret,
  jwt: {
    secret: process.env.JWT_SECRET || 'windows-ui-lowcode-secret-key',
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '2h',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d'
  },
  db: {
    client: process.env.DB_CLIENT || 'sqlite3',
    filename: process.env.DB_FILENAME || './data/lowcode.sqlite'
  },
  redis: {
    url: process.env.REDIS_URL || ''
  }
}

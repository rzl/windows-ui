import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const config = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'windows-ui-lowcode-secret-key',
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '2h',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d'
  },
  db: {
    client: process.env.DB_CLIENT || 'sqlite3',
    filename: process.env.DB_FILENAME || './data/lowcode.sqlite'
  }
}

import knex from 'knex'
import path from 'path'
import { config } from '../config'

const dbPath = path.isAbsolute(config.db.filename)
  ? config.db.filename
  : path.resolve(__dirname, '../..', config.db.filename)

export const db = knex({
  client: config.db.client,
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, '../../migrations'),
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: path.resolve(__dirname, '../../seeds')
  }
})

export default db

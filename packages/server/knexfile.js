const path = require('path')

const DB_PATH = path.resolve(__dirname, 'data', 'lowcode.sqlite')

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: DB_PATH
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds')
  }
}

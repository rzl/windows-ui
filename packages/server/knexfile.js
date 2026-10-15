const path = require('path')

// Node < 22.6 无法直接加载 TS 迁移/种子文件，这里注册 tsx 的 require 钩子
// （迁移与种子均为 .ts，需要通过本文件顺带启用编译支持）
try {
  require('tsx/cjs')
} catch (e) {
  throw new Error('运行迁移/种子需要 tsx 依赖，请在 packages/server 下执行 pnpm install')
}

const DB_PATH = path.resolve(__dirname, 'data', 'lowcode.sqlite')

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: DB_PATH
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    tableName: 'knex_migrations',
    extension: 'ts',
    loadExtensions: ['.ts']
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
    extension: 'ts',
    loadExtensions: ['.ts']
  }
}

import { db } from '../db'

interface ColumnInfo {
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: any
  pk: number
}

const RESERVED_COLUMNS = ['id', 'create_time', 'update_time', 'create_by', 'dept_id']

/**
 * 重建物理表以移除指定列
 * @param tableName 表名
 * @param columnsToRemove 待移除列名数组
 * @param options 配置
 */
export async function rebuildTableWithoutColumns(
  tableName: string,
  columnsToRemove: string[],
  options: { preserveData?: boolean } = {}
) {
  const preserveData = options.preserveData !== false

  // 保留系统字段
  const removeSet = new Set(
    columnsToRemove.filter((c) => !RESERVED_COLUMNS.includes(c))
  )

  if (!removeSet.size) return true

  const client = db.client.config.client

  // 非 SQLite 数据库优先使用原生 DROP COLUMN
  if (client !== 'sqlite3') {
    for (const column of removeSet) {
      await db.schema.table(tableName, (table) => {
        table.dropColumn(column)
      })
    }
    return true
  }

  // SQLite 通过重建表删除列
  const columns = await getTableColumns(tableName)
  const keepColumns = columns.filter((c: ColumnInfo) => !removeSet.has(c.name))

  if (!keepColumns.length) {
    throw new Error('重建表失败：没有可保留的列')
  }

  const tempTable = `${tableName}_temp_${Date.now()}`
  const keepColumnNames = keepColumns.map((c: ColumnInfo) => c.name)

  await db.transaction(async (trx) => {
    // 关闭外键检查
    await trx.raw('PRAGMA foreign_keys = OFF')

    // 创建临时表
    await trx.schema.createTable(tempTable, (table) => {
      keepColumns.forEach((col: ColumnInfo) => {
        buildColumn(table, col)
      })
    })

    // 复制数据
    if (preserveData) {
      await trx.raw(
        `INSERT INTO ?? (${keepColumnNames.map(() => '??').join(', ')}) SELECT ${keepColumnNames.map(() => '??').join(', ')} FROM ??`,
        [tempTable, ...keepColumnNames, ...keepColumnNames, tableName]
      )
    }

    // 删除原表
    await trx.schema.dropTable(tableName)

    // 重命名临时表
    await trx.schema.renameTable(tempTable, tableName)

    // 恢复外键检查
    await trx.raw('PRAGMA foreign_keys = ON')
  })

  return true
}

async function getTableColumns(tableName: string) {
  const rows = await db.raw(`PRAGMA table_info(??)`, [tableName])
  return (rows || []).map((row: any) => ({
    cid: row.cid,
    name: row.name,
    type: row.type,
    notnull: row.notnull,
    dflt_value: row.dflt_value,
    pk: row.pk
  }))
}

function buildColumn(table: any, col: ColumnInfo) {
  if (col.pk) {
    table.increments(col.name).primary()
    return
  }

  const type = String(col.type || 'TEXT').toUpperCase()
  const isNotNull = col.notnull === 1
  const defaultValue = col.dflt_value

  let builder
  if (type.includes('INT')) {
    builder = table.integer(col.name)
  } else if (type.includes('TEXT')) {
    builder = table.text(col.name)
  } else if (type.includes('REAL') || type.includes('FLOAT') || type.includes('DOUBLE')) {
    builder = table.float(col.name)
  } else if (type.includes('NUMERIC') || type.includes('DECIMAL')) {
    builder = table.decimal(col.name)
  } else if (type.includes('BLOB')) {
    builder = table.binary(col.name)
  } else if (type.includes('DATETIME') || type.includes('TIMESTAMP')) {
    builder = table.datetime(col.name)
  } else if (type.includes('DATE')) {
    builder = table.date(col.name)
  } else {
    builder = table.specificType(col.name, col.type)
  }

  if (isNotNull) {
    builder.notNullable()
  } else {
    builder.nullable()
  }

  if (defaultValue !== null && defaultValue !== undefined) {
    builder.defaultTo(defaultValue)
  }
}

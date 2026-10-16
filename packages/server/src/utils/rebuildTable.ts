import { db } from '../db'

interface ColumnInfo {
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: any
  pk: number
}

// 动态表系统保留列（重建时永不删除）
const RESERVED_COLUMNS = ['id', 'create_time', 'update_time', 'create_by', 'update_by', 'dept_id', 'tenant_id']

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

  // SQLite 通过重建表删除列。
  // 说明：动态表没有外键约束（其余表不可能引用运行时才创建的表），
  // 且 PRAGMA foreign_keys 在事务内是 no-op，因此这里不做 pragma 切换
  const columns = await getTableColumns(tableName)
  const keepColumns = columns.filter((c: ColumnInfo) => !removeSet.has(c.name))

  if (!keepColumns.length) {
    throw new Error('重建表失败：没有可保留的列')
  }

  const tempTable = `${tableName}_temp_${Date.now()}`
  const keepColumnNames = keepColumns.map((c: ColumnInfo) => c.name)

  await db.transaction(async (trx) => {
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
  })

  // 重建表会连同索引一起丢弃，补回系统列索引
  await createSystemColumnIndexes(tableName)

  return true
}

/**
 * 重建物理表以应用列类型变更（保留数据）
 * @param tableName 表名
 * @param options.alterColumnName 待变更类型的列名
 * @param options.alterColumn 列构建回调（接收 knex table builder 与列名）
 */
export async function rebuildTableWithColumnTypes(
  tableName: string,
  options: { alterColumnName: string; alterColumn: (table: any, columnName: string) => void },
  executor: any = db
) {
  const columns = await getTableColumns(tableName)
  const target = columns.find((c: ColumnInfo) => c.name === options.alterColumnName)
  if (!target) return false

  const tempTable = `${tableName}_temp_${Date.now()}`
  const keepColumnNames = columns.map((c: ColumnInfo) => c.name)

  await executor.transaction(async (trx: any) => {
    await trx.schema.createTable(tempTable, (table: any) => {
      columns.forEach((col: ColumnInfo) => {
        if (col.name === options.alterColumnName) {
          options.alterColumn(table, col.name)
        } else {
          buildColumn(table, col)
        }
      })
    })

    await trx.raw(
      `INSERT INTO ?? (${keepColumnNames.map(() => '??').join(', ')}) SELECT ${keepColumnNames.map(() => '??').join(', ')} FROM ??`,
      [tempTable, ...keepColumnNames, ...keepColumnNames, tableName]
    )

    await trx.schema.dropTable(tableName)
    await trx.schema.renameTable(tempTable, tableName)
  })

  // 重建表会连同索引一起丢弃，补回系统列索引
  await createSystemColumnIndexes(tableName)

  return true
}

/** 动态表系统列索引（租户过滤/创建人/部门/时间排序是最高频查询条件） */
export async function createSystemColumnIndexes(tableName: string, executor: any = db) {
  // SQLite 无 CREATE INDEX IF NOT EXISTS（knex 不生成），依赖调用方幂等或忽略重复错误
  try {
    await executor.schema.table(tableName, (table: any) => {
      table.index(['tenant_id'], `idx_${tableName}_tenant_id`)
      table.index(['create_by'], `idx_${tableName}_create_by`)
      table.index(['dept_id'], `idx_${tableName}_dept_id`)
      table.index(['create_time'], `idx_${tableName}_create_time`)
    })
  } catch {
    // 索引已存在等情况直接忽略
  }
}

export async function getTableColumns(tableName: string, executor: any = db) {
  const rows = await executor.raw(`PRAGMA table_info(??)`, [tableName])
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
    // 主键为应用层生成的 ULID 字符串，重建时原样保留
    table.string(col.name, 36).primary()
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

# 仪表盘设计器

## 功能说明

仪表盘设计器用于创建数据可视化图表，支持从多种数据源获取数据并渲染为 ECharts 图表。

## 进入仪表盘设计器

1. 进入「系统监控」→「仪表盘管理」。
2. 点击「+ 新增仪表盘」或已有仪表盘的「设计」按钮。

## 配置仪表盘

### 基础信息

- **仪表盘编码**：唯一标识，用于在首页配置中引用。
- **仪表盘名称**：展示用名称。

### 数据源类型

设计器支持四种数据源：

| 类型 | 适用场景 | 说明 |
|------|----------|------|
| 静态配置 | 固定数据展示 | 直接编写 ECharts option |
| SQL 查询 | 从数据库查询 | 编写 SELECT 语句，再通过转换脚本生成 option |
| 内部 API | 调用系统内部接口 | 配置方法、URL、参数，再通过转换脚本生成 option |
| 在线脚本 | 复杂数据处理 | 在线编写 JavaScript，可直接调用 `db.raw()` 和 `http()` |

### SQL 数据源

1. 选择「SQL 查询」。
2. 在 SQL 查询框中输入 SELECT 语句，例如：

```sql
SELECT status, COUNT(*) as value FROM users GROUP BY status
```

3. 在「数据转换脚本」中返回 ECharts option：

```js
return {
  title: { text: '用户状态分布' },
  xAxis: { data: data.map(r => r.status) },
  series: [{ type: 'bar', data: data.map(r => r.value) }]
}
```

> 安全限制：只允许 SELECT 查询，禁止 INSERT/UPDATE/DELETE/DROP 等写入操作。

### 内部 API 数据源

1. 选择「内部 API」。
2. 配置请求方法（GET/POST/PUT/DELETE）。
3. 输入请求地址，例如 `/api/lowcode/customer`。
4. 可填写查询参数和请求体（JSON 格式）。
5. 在「数据转换脚本」中处理返回数据并生成 option。

### 在线脚本数据源

1. 选择「在线脚本」。
2. 在脚本框中编写 JavaScript，可用以下变量：
   - `ctx`：上下文对象
   - `db`：数据库对象，支持 `db.raw(sql)` 执行只读 SQL
   - `http`：HTTP 请求函数，支持 `http({ method, url, params, data })`
3. 脚本需返回完整 ECharts option。

示例：

```js
const rows = await db.raw('SELECT status, COUNT(*) as value FROM users GROUP BY status')
return {
  title: { text: '用户状态分布' },
  xAxis: { data: rows.map(r => r.status) },
  series: [{ type: 'bar', data: rows.map(r => r.value) }]
}
```

## 预览与保存

- 配置完成后，右侧预览区域会实时刷新。
- 点击「保存配置」保存仪表盘。
- 保存后可在「首页配置」中选择该仪表盘编码进行展示。

# 自定义接口

## 功能概述

自定义接口允许管理员在线编写 JavaScript 脚本，直接发布为 HTTP 接口。它适用于数据模型无法满足的复杂查询、聚合计算、跨系统数据整合等场景。

脚本运行在 `vm2` 沙箱中，默认只能执行 `SELECT` 查询，无法直接修改数据库。

## 使用入口

进入「低代码」→「自定义接口」菜单，可查看已有接口列表。

## 创建接口

1. 点击「新增接口」进入编辑页。
2. 填写表单：
   - **编码**：唯一标识，如 `user_stats`。
   - **名称**：接口显示名称。
   - **方法**：GET / POST / PUT / DELETE / ALL（ALL 表示不限制方法）。
   - **路径**：调用路径，支持多层结构，如 `user/stats`；为空时默认使用编码。
   - **公开访问**：默认关闭，关闭时调用需要登录；开启后任何人可访问。
   - **状态**：启用/禁用。
3. 在 Monaco 编辑器中编写脚本。
4. 点击「保存接口」。

## 脚本规范

脚本中可直接使用以下变量：

| 变量 | 说明 |
|------|------|
| `ctx` | 请求上下文，包含 `params`、`query`、`body`、`headers`、`method`、`user` |
| `db` | `{ raw(sql) }` 执行 SELECT 查询并返回数组 |
| `http` | 内部 HTTP 调用，自动代理到本服务 |
| `axios` | 外部 HTTP 调用，仅暴露 get/post/put/delete/request |
| `console` | 输出到后端日志 |

脚本需要返回一个对象，例如：

```js
async function main() {
  const rows = await db.raw("SELECT status, COUNT(*) as count FROM users GROUP BY status")
  return {
    code: 200,
    message: 'success',
    data: rows
  }
}

return await main()
```

## 调用接口

保存并启用后，可通过以下地址调用：

```
GET /api/custom/user/stats
```

其中 `user/stats` 为接口路径（或编码）。

### 请求示例

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/custom/user/stats?department=sales"
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "status": 1, "count": 12 }
  ]
}
```

## 安全配置

在接口编辑页的「安全配置」卡片中，可以配置：

### 频率限制

限制每个用户（登录态）或每个 IP（未登录态）在指定时间窗口内可请求的次数。

| 窗口单位 | 说明 |
|----------|------|
| 每秒 | 每秒最多 N 次 |
| 每分钟 | 每分钟最多 N 次 |
| 每小时 | 每小时最多 N 次 |
| 每天 | 每天最多 N 次 |

设置为 0 表示不限制。超过限制后调用方会收到 `429 Too Many Requests`。

### IP 白名单 / 黑名单

- **IP 白名单**：配置后，只有白名单内的 IP 才能访问该接口。
- **IP 黑名单**：配置后，黑名单内的 IP 会被直接拒绝。
- 每行填写一个 IP，支持简单 CIDR，如 `192.168.1.0/24`。
- 黑名单优先级高于白名单。

### 超时时间

设置脚本最大执行时间（毫秒），默认 5000ms，范围 100ms ~ 60000ms。脚本执行超时会返回执行失败。

## 执行日志

接口启用后，每次被调用都会记录执行日志，包含：

- 调用时间
- 调用者 IP
- 调用者用户名
- 请求方法
- 执行耗时
- 成功 / 失败状态
- 错误信息

在接口编辑页底部的「执行日志」卡片中可分页查看。

## 公开接口

若接口开启「公开访问」，则无需登录即可调用：

```bash
curl "http://localhost:3001/api/custom/public/hello"
```

> **注意**：公开接口会暴露服务能力，建议同时配置 IP 白名单或频率限制以降低风险。

## 测试接口

在编辑页右侧可填写 `Query` 和 `Body` 模拟参数，点击「运行测试」立即查看执行结果或错误信息。

> 测试接口不记录执行日志，也不触发频率限制和 IP 检查。

## 常见问题

**Q：脚本中如何获取当前登录用户？**
A：通过 `ctx.user`，包含 `id`、`username`、`roleId`、`deptId`、`permissions`。

**Q：脚本中能否修改数据库？**
A：默认不允许。`db.raw()` 仅允许 `SELECT` 语句，包含 `INSERT/UPDATE/DELETE` 等关键字会报错。

**Q：接口路径支持多深？**
A：支持任意多层路径，如 `a/b/c/d`，只要不与现有路由冲突即可。

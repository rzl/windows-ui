# 后端架构

## 技术栈

- Node.js + Express
- JWT 认证（jsonwebtoken + bcryptjs）
- Knex 查询构建器 + SQLite（默认）
- Winston 日志
- Joi / Zod 参数校验

## 分层结构

```
packages/server/src/
├── config/           # 环境配置
├── db/               # Knex 配置、迁移、种子
├── middleware/       # 中间件（auth、error、logger、cors）
├── modules/          # 业务模块
│   ├── auth/         # 认证
│   ├── rbac/         # 用户、角色、菜单、部门
│   └── system/       # 字典、公告等
├── routes/           # 路由聚合
├── utils/            # 工具函数
├── app.ts            # Express 应用实例
└── index.ts          # 服务入口
```

每个模块内部：

```
modules/<module>/
├── <module>.routes.ts      # 路由定义
├── <module>.controller.ts  # 控制器：解析请求、调用 service
├── <module>.service.ts     # 业务逻辑
└── <module>.dto.ts         # 请求参数校验
```

## 认证机制

1. 登录成功后签发 JWT（accessToken + refreshToken）
2. accessToken 有效期较短（默认 2 小时），refreshToken 有效期较长（默认 7 天）
3. 请求头携带 `Authorization: Bearer <accessToken>`
4. JWT 中间件校验 token 有效性
5. 登出时将 token 加入内存黑名单（生产环境建议 Redis）

## 统一响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

错误响应：

```json
{
  "code": 500,
  "message": "错误信息",
  "data": null
}
```

## 权限模型

- RBAC：用户 → 角色 → 权限
- 权限码格式：`模块:操作`，例如 `user:create`、`user:edit`、`user:delete`
- 按钮级权限：前端通过 `v-permission` 或 `WPermission` 组件控制
- 数据权限：通过部门、角色字段过滤（后续扩展）

## 数据库迁移

- 使用 Knex migrations
- 迁移文件按时间戳命名
- 默认数据库文件：`packages/server/data/lowcode.sqlite`

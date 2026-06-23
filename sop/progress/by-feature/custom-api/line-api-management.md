# 子线：自定义接口管理

## 来源阶段

[phase-18：在线 Monaco 接口编辑器](../../by-phase/phase-18.md)

## 目标

支持自定义接口的增删改查和动态调用。

## 关键实现

- `lowcode_custom_apis` 表
- `/api/custom-apis` 管理接口
- `/api/custom/*` 动态调用路由
- 支持 GET/POST/PUT/DELETE/ALL 方法
- 公开/登录访问控制

## 验收标准

- [x] 可保存自定义接口并通过多层路径调用
- [x] 默认接口需要登录，公开接口无需登录
- [x] 禁用的接口返回 404/403

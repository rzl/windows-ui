# 子线：插件元数据管理

## 来源阶段

[phase-19：插件化扩展体系](../../by-phase/phase-19.md)

## 目标

支持插件的安装、启用、禁用、删除。

## 关键实现

- `lowcode_plugins` 表
- `/api/plugins` 管理接口
- `/api/plugins/active` 公开接口
- 前端 `PluginList.vue` 与 `PluginEditor.vue`

## 验收标准

- [x] 管理员可安装/启用/禁用/删除插件
- [x] 前端启动时拉取启用插件

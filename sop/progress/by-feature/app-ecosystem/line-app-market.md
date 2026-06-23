# 子线：应用市场

## 来源阶段

[phase-11：应用市场 + 角色应用授权](../../by-phase/phase-11.md)

## 目标

普通用户可浏览已发布的应用，一键进入应用运行页。

## 关键实现

- `lowcode_apps.is_market` 字段
- `/api/apps/market` 接口
- 前端 `AppMarket.vue` 与 `AppRunner.vue`

## 验收标准

- [x] 管理员可设置应用上架到应用市场
- [x] 普通用户可在应用市场看到已上架应用
- [x] 点击应用卡片进入应用运行页

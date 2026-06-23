# 子线：脚本执行引擎

## 来源阶段

[phase-18：在线 Monaco 接口编辑器](../../by-phase/phase-18.md)

## 目标

安全地执行用户编写的脚本。

## 关键实现

- 抽取公共 `utils/script-runner.ts`
- 基于 `vm2` 的沙箱执行
- 脚本可调用 `db.raw()`、`http()`、`axios`
- 固定 5 秒超时

## 验收标准

- [x] 脚本中可访问数据库和内部 HTTP 接口
- [x] 脚本返回 JSON 数据

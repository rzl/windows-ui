# 子线：WebSocket 推送

## 来源阶段

[phase-4：消息中心、系统监控与页面模板](../../by-phase/phase-4.md)、[phase-17：消息通知与待办中心](../../by-phase/phase-17.md)

## 目标

通过 WebSocket 实现消息实时推送。

## 关键实现

- 后端集成 `ws` 模块
- 发消息时实时推送给接收人
- 前端登录后建立 WebSocket 连接，断线后自动重连

## 验收标准

- [x] 发送消息时接收人实时收到推送
- [x] 断网恢复后 WebSocket 自动重连

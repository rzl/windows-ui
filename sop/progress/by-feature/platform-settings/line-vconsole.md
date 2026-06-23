# 子线：VConsole 调试

## 来源阶段

[phase-15：顶部系统设置与国际化](../../by-phase/phase-15.md)

## 目标

在移动端或真机调试时快速开启 VConsole。

## 关键实现

- 设置面板新增「启用 VConsole」选项
- 从 CDN 动态加载 VConsole
- 关闭后销毁实例

## 验收标准

- [x] 开启后页面从 CDN 加载调试面板
- [x] 关闭后销毁 VConsole

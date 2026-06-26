# 项目进度跟踪

本目录提供低代码平台开发进度的双视图跟踪：

- **`by-phase/`**：按阶段组织的时间线视图，记录每个阶段的目标、任务清单、验收标准与运行记录。
- **`by-feature/`**：按功能模块组织的主子线视图，记录每个核心功能从基础到增强的完整演进。

## 什么时候看哪个视图

| 场景 | 推荐视图 |
|------|----------|
| 查看当前阶段完成了什么 | `by-phase/phase-*.md` |
| 查看某个功能是否完整 | `by-feature/<feature>/README.md` |
| 补充一个已有功能的增强 | `by-feature/<feature>/` 下新增 `line-*.md` |
| 开始一个新阶段 | `by-phase/` 下新增阶段文件，并在相关 `by-feature/` 中新增子线 |

## 阶段时间线

| 阶段 | 主题 |
|------|------|
| [phase-1](by-phase/phase-1.md) | 基础框架与 SOP 文档体系 |
| [phase-2](by-phase/phase-2.md) | 系统管理模块 |
| [phase-3](by-phase/phase-3.md) | 低代码核心（在线开发） |
| [phase-4](by-phase/phase-4.md) | 消息中心、系统监控与页面模板 |
| [phase-5-manuals](by-phase/phase-5-manuals.md) | 用户操作手册交付规范 |
| [phase-6-dashboard](by-phase/phase-6-dashboard.md) | 首页配置与仪表盘设计器 |
| [phase-7-data-permission-audit](by-phase/phase-7-data-permission-audit.md) | 数据权限与审计字段 |
| [phase-7-flow](by-phase/phase-7-flow.md) | 工作流引擎与业务模型打通 |
| [phase-7-schedule](by-phase/phase-7-schedule.md) | 定时任务调度 |
| [phase-8](by-phase/phase-8.md) | 报表设计器 + 数据导入导出增强 + 按钮级权限 |
| [phase-9](by-phase/phase-9.md) | 打印模板设计器 + 表单高级布局 + 外部数据集成 |
| [phase-10](by-phase/phase-10.md) | 应用发布与版本管理 + 数据审计日志 |
| [phase-11](by-phase/phase-11.md) | 应用市场 + 角色应用授权 |
| [phase-12](by-phase/phase-12.md) | 应用市场示例模板 |
| [phase-13](by-phase/phase-13.md) | 应用运行门户 / 工作台 |
| [phase-14](by-phase/phase-14.md) | 自定义页面设计器（Page Designer） |
| [phase-15](by-phase/phase-15.md) | 顶部系统设置与国际化 |
| [phase-16](by-phase/phase-16.md) | 数据权限与行级隔离 |
| [phase-17](by-phase/phase-17.md) | 消息通知与待办中心 |
| [phase-18](by-phase/phase-18.md) | 在线 Monaco 接口编辑器 |
| [phase-19](by-phase/phase-19.md) | 插件化扩展体系 |
| [phase-20](by-phase/phase-20.md) | 数据模型关联关系 |
| [phase-21](by-phase/phase-21.md) | 数据模型版本管理 |
| [phase-22](by-phase/phase-22.md) | 物理表字段删除 |
| [phase-23](by-phase/phase-23.md) | 数据模型导入导出 |
| [phase-24](by-phase/phase-24.md) | 自定义接口版本管理 |
| [phase-25](by-phase/phase-25.md) | 列表设计器增强（列宽记忆 + 列排序拖拽） |
| [phase-26](by-phase/phase-26.md) | 高级查询面板 |
| [phase-27](by-phase/phase-27.md) | 系统监控增强 |

## 功能模块主子线

| 功能模块 | 说明 |
|----------|------|
| [foundation](by-feature/foundation/README.md) | 基础平台 |
| [system-management](by-feature/system-management/README.md) | 系统管理 |
| [permission](by-feature/permission/README.md) | 权限体系 |
| [data-model](by-feature/data-model/README.md) | 数据模型与动态 CRUD |
| [form-designer](by-feature/form-designer/README.md) | 表单设计器 |
| [table-designer](by-feature/table-designer/README.md) | 列表设计器 |
| [dashboard](by-feature/dashboard/README.md) | 首页与仪表盘 |
| [workflow](by-feature/workflow/README.md) | 工作流引擎 |
| [schedule](by-feature/schedule/README.md) | 定时任务调度 |
| [message-center](by-feature/message-center/README.md) | 消息中心 |
| [system-monitor](by-feature/system-monitor/README.md) | 系统监控 |
| [report](by-feature/report/README.md) | 报表设计器 |
| [print](by-feature/print/README.md) | 打印模板设计器 |
| [import-export](by-feature/import-export/README.md) | 数据导入导出 |
| [external-datasource](by-feature/external-datasource/README.md) | 外部数据集成 |
| [app-ecosystem](by-feature/app-ecosystem/README.md) | 应用生态 |
| [page-designer](by-feature/page-designer/README.md) | 自定义页面设计器 |
| [platform-settings](by-feature/platform-settings/README.md) | 平台设置与国际化 |
| [custom-api](by-feature/custom-api/README.md) | 自定义接口 |
| [plugin](by-feature/plugin/README.md) | 插件化扩展体系 |

## 维护约定

1. **新增阶段时**：在 `by-phase/` 下创建阶段文件，完成后再把该阶段涉及的功能增强补充到对应 `by-feature/<feature>/` 下。
2. **增强已有功能时**：优先在 `by-feature/<feature>/` 下新增 `line-*.md`，并在 `README.md` 的子线清单中登记。
3. **文档同步**：每个阶段/子线完成后，同步更新 `sop/manuals/` 下对应用户手册和 `sop/lowcode/` 下设计规范。

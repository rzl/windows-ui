# 阶段九：打印模板设计器 + 表单高级布局 + 外部数据集成

## 目标

在阶段八基础上，补齐业务系统高频能力并扩展数据源：
1. **打印模板设计器**：用户可配置化设计业务单据/报表打印模板，支持变量绑定、表格循环与 PDF 导出；
2. **表单高级布局**：表单设计器支持分组、标签页、栅格布局与子表，提升复杂表单可用性；
3. **外部数据集成**：接入 REST API 与外部数据库作为数据源，供字段选项、关联字段、报表使用。

## 功能清单

### 打印模板设计器
- 打印模板元数据：编码、名称、关联模型、纸张大小、页边距、状态
- 画布设计器：文本、图片、表格、二维码、矩形框等组件
- 数据绑定：选择模型字段变量（如 `${name}`），支持聚合变量
- 明细表格：绑定子模型/主模型列表，循环渲染行
- 打印预览：根据模板 + 数据生成 HTML 预览
- PDF 导出：调用无头浏览器/纯 CSS 打印生成 PDF
- 在低代码列表/详情页面提供打印入口

### 表单高级布局
- 分组容器（FieldSet）：可折叠、可设标题
- 标签页容器（Tabs）：一个表单分多个 tab
- 栅格布局（Grid）：字段可配置占 1~4 列
- 子表/明细表（SubTable）：一对多嵌套编辑
- 设计器左侧增加“布局组件”区
- 表单渲染器按配置解析布局容器

### 外部数据集成
- 外部数据源元数据：名称、编码、类型（rest/mysql/postgresql）、连接配置
- REST 数据源：URL、请求方法、Headers、参数映射、响应解析路径
- 数据库数据源：host、port、database、user、password、SQL
- 字段选项支持选择外部数据源
- 报表支持选择外部数据源作为数据源
- 数据预览：测试连接并预览返回数据

## 数据表

| 表名 | 说明 |
|------|------|
| print_templates | 打印模板定义 |
| external_data_sources | 外部数据源定义 |

## 接口约定

### 打印模板
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /print/templates | 模板列表 |
| GET | /print/templates/:code | 模板详情 |
| POST | /print/templates | 保存模板 |
| DELETE | /print/templates/:id | 删除模板 |
| POST | /print/templates/:code/preview | 渲染 HTML 预览 |
| POST | /print/templates/:code/pdf | 导出 PDF |

### 外部数据源
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /external-datasources | 数据源列表 |
| GET | /external-datasources/:id | 数据源详情 |
| POST | /external-datasources | 创建数据源 |
| PUT | /external-datasources/:id | 更新数据源 |
| DELETE | /external-datasources/:id | 删除数据源 |
| POST | /external-datasources/:id/test | 测试连接 |
| POST | /external-datasources/:id/execute | 执行查询 |

## 任务清单

- [x] 创建 `print_templates` 表迁移
- [x] 后端打印模板 CRUD API
- [x] 后端打印模板渲染 API（HTML + PDF）
- [x] 前端打印模板列表/设计器/预览页面
- [x] 在低代码列表/详情页集成打印按钮
- [x] 扩展表单配置支持分组/标签页/栅格/子表
- [x] 表单设计器支持布局配置（JSON）
- [x] 表单渲染器解析布局容器
- [x] 创建 `external_data_sources` 表迁移
- [x] 后端外部数据源 CRUD 与测试连接 API
- [x] 后端外部数据源执行查询 API
- [x] 字段选项支持外部数据源
- [x] 报表设计器支持外部数据源
- [x] 前端外部数据源管理页面
- [x] 新增/更新菜单与用户手册
- [x] 全量构建验证

## 验收标准

- 可在打印模板设计器中拖拽组件、绑定字段并保存；
- 预览打印模板时能看到真实数据渲染结果；
- 表单设计器可配置分组、标签页、栅格列宽；
- 表单渲染时按布局容器正确展示；
- 可创建 REST 或数据库外部数据源并测试连接成功；
- 字段下拉选项可选择外部数据源；
- `pnpm build:server`、`pnpm build:lowcode`、`pnpm build` 通过。

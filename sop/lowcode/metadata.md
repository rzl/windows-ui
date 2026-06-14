# 低代码平台元数据模型

> 本文档描述低代码平台的核心元数据表及其关系，是理解动态 CRUD、表单/列表设计器的基础。

## 实体关系

```
lowcode_models
  ├── lowcode_fields
  ├── lowcode_forms
  ├── lowcode_tables
  ├── lowcode_coding_rules
  ├── lowcode_validation_rules
  └── flow_definitions
```

## 数据模型（lowcode_models）

| 字段 | 说明 |
|------|------|
| id | 主键 |
| code | 模型编码，唯一标识 |
| name | 模型显示名称 |
| table_name | 对应物理表名 |
| description | 描述 |
| data_permission | 数据权限规则：`all` / `self` / `dept` / `dept_and_child` |
| status | 状态：1 启用，0 禁用 |
| create_time / update_time | 创建/更新时间 |

**物理表审计字段**：

| 字段 | 说明 |
|------|------|
| create_by | 创建人用户 ID |
| dept_id | 创建人所属部门 ID |

**规则**：

- `code` 与 `table_name` 会转为小写 + 下划线，仅保留字母、数字、下划线。
- 创建模型时自动创建物理表（仅包含 `id`、 `create_time`、 `update_time`）。

## 模型字段（lowcode_fields）

| 字段 | 说明 |
|------|------|
| id | 主键 |
| model_id | 所属模型 ID |
| field_name | 字段名（英文） |
| display_name | 显示名称 |
| type | 字段类型：`string/text/number/boolean/date/datetime/select/radio` |
| length | 长度，默认 255 |
| required | 是否必填：1 / 0 |
| default_value | 默认值 |
| options | 选项 JSON 字符串 |
| dict_code | 关联字典编码。`select/radio` 类型可配置，运行时自动从字典表读取选项 |
| validation_rule | 后端校验规则编码 |
| sort | 排序 |
| status | 状态 |

**物理表同步**：

- 新增字段时自动 `ALTER TABLE` 添加列。
- 编辑字段时尝试修改列类型（SQLite 支持有限）。
- 删除字段时目前仅删除元数据，未重建物理表（SQLite 限制）。

**字典选项**：

当字段类型为 `select` 或 `radio` 且 `dict_code` 不为空时，后端在返回模型详情时会自动从 `dicts` / `dict_items` 表读取启用的字典项，并填充到字段的 `options` 字段。前端无需额外调用字典接口。

## 表单配置（lowcode_forms）

| 字段 | 说明 |
|------|------|
| id | 主键 |
| model_id | 所属模型 ID |
| name | 配置名称 |
| config | JSON 配置 |
| status | 状态 |

`config` 结构：

```json
{
  "fields": [
    {
      "field": "name",
      "label": "姓名",
      "type": "input",
      "required": true,
      "options": []
    }
  ]
}
```

## 列表配置（lowcode_tables）

`config` 结构：

```json
{
  "fields": [
    {
      "field": "name",
      "label": "姓名",
      "inTable": true,
      "searchable": true,
      "width": 120
    }
  ]
}
```

`searchable` 字段决定该字段是否在动态业务页面的查询区显示。

## 编码规则（lowcode_coding_rules）

| 字段 | 说明 |
|------|------|
| code | 规则编码 |
| name | 规则名称 |
| prefix | 前缀 |
| date_format | 日期格式，如 `YYYYMMDD` |
| seq_length | 序号位数 |
| current_seq | 当前序号 |

生成规则：`{prefix}{date}{seq}`。

## 校验规则（lowcode_validation_rules）

| 字段 | 说明 |
|------|------|
| code | 规则编码 |
| name | 规则名称 |
| pattern | 正则表达式 |
| message | 校验失败提示 |

通过后端接口 `/lowcode/validation-rules/:code/validate` 可校验字段值。

## 流程定义（flow_definitions）

| 字段 | 说明 |
|------|------|
| id | 主键 |
| code | 流程编码 |
| name | 流程名称 |
| model_code | 关联的低代码模型编码 |
| config | 流程配置 JSON（节点、流转） |
| status | 状态：1 启用，0 禁用 |

`config` 示例：

```json
{
  "nodes": [
    { "id": "start", "type": "start", "name": "开始" },
    { "id": "manager", "type": "approve", "name": "经理审批", "assigneeType": "role", "assigneeValue": "2" },
    { "id": "sign", "type": "sign", "name": "会签", "signType": "all", "assignees": [{ "type": "role", "value": "3" }] },
    { "id": "end", "type": "end", "name": "结束" }
  ],
  "transitions": [
    { "from": "start", "to": "manager", "condition": "submit" },
    { "from": "manager", "to": "sign", "condition": "approve" },
    { "from": "manager", "to": "start", "condition": "reject" },
    { "from": "sign", "to": "end", "condition": "approve" }
  ]
}
```

## 流程实例（flow_instances）

| 字段 | 说明 |
|------|------|
| id | 主键 |
| flow_code | 流程编码 |
| business_key | 业务主键（动态表记录 ID） |
| business_data | 业务表单数据快照（JSON） |
| status | 状态：`running` / `completed` / `rejected` |
| current_node_id | 当前节点 ID |

## 流程任务（flow_tasks）

| 字段 | 说明 |
|------|------|
| id | 主键 |
| instance_id | 所属流程实例 ID |
| node_id / node_name | 节点 ID 与名称 |
| assignee_type | 处理人类型：`role` / `user` |
| assignee_value | 处理人值（角色 ID 或用户 ID） |
| status | 状态：`pending` / `approved` / `rejected` |
| comment | 审批意见 |

## 字典分类（dict_categories）

| 字段 | 说明 |
|------|------|
| id | 主键 |
| code | 分类编码 |
| name | 分类名称 |
| sort | 排序 |
| status | 状态 |

`dicts` 表通过 `category_id` 关联字典分类。

## 系统公告（notices）

| 字段 | 说明 |
|------|------|
| id | 主键 |
| title | 标题 |
| content | 内容 |
| type | 类型：`notice` / `announcement` |
| sort | 排序 |
| status | 状态 |
| publish_time | 发布时间 |

## 职务（positions）

| 字段 | 说明 |
|------|------|
| id | 主键 |
| code | 职务编码 |
| name | 职务名称 |
| sort | 排序 |
| status | 状态 |

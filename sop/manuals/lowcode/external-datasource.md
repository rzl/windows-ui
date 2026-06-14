# 外部数据源使用手册

## 功能说明

外部数据源用于接入低代码平台之外的数据，支持 REST API 和 MySQL/PostgreSQL 数据库。配置后可在字段下拉选项、报表数据源等场景使用。

## 入口

进入【低代码开发】→【外部数据源】

## 创建数据源

1. 点击“新增数据源”
2. 填写编码、名称、类型
3. 根据类型填写连接配置（JSON 格式）
4. 点击“测试连接”验证
5. 保存

## 配置说明

### REST API

```json
{
  "url": "https://api.example.com/items",
  "method": "GET",
  "headers": { "Authorization": "Bearer xxx" },
  "params": { "page": 1 },
  "body": {},
  "resultPath": "data.list",
  "labelField": "name",
  "valueField": "id"
}
```

- `url`：请求地址，支持 `${参数名}` 模板变量
- `method`：GET / POST
- `resultPath`：从响应中提取数组的路径，如 `data.list`
- `labelField` / `valueField`：生成下拉选项时使用的字段

### MySQL / PostgreSQL

```json
{
  "host": "localhost",
  "port": 3306,
  "database": "test",
  "user": "root",
  "password": "123456",
  "sql": "SELECT id AS value, name AS label FROM category",
  "labelField": "label",
  "valueField": "value"
}
```

- SQL 中支持 `${参数名}` 模板变量
- 需要运行环境安装对应的数据库驱动（mysql2 / pg）

## 使用场景

### 字段下拉选项

1. 进入模型设计 → 表单设计
2. 点击字段的“动态选项”配置
3. 数据源类型选择“外部数据源”
4. 选择已配置的数据源，填写标签字段、值字段和额外参数

### 报表数据源

1. 进入报表设计器
2. 在“外部数据源”下拉框中选择数据源
3. 报表列会自动从数据源样例中提取字段
4. 保存后运行报表即可查看外部数据

## 注意事项

- 外部数据源编码必须唯一
- REST 接口需要保证可访问，超时时间为 30 秒
- 数据库连接信息请妥善保管，建议生产环境使用只读账号

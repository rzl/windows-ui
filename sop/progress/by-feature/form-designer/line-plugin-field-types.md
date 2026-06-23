# 子线：插件字段类型

## 来源阶段

[phase-19：插件化扩展体系](../../by-phase/phase-19.md)

## 目标

通过插件扩展表单可使用的字段类型。

## 关键实现

- `pluginManager` 维护 `fieldTypeRegistry`
- `ModelDesigner` 字段类型下拉使用注册表
- `LowcodePage` 表单控件映射使用注册表

## 验收标准

- [x] 安装插件后，新字段类型可在模型设计器中使用
- [x] 运行页表单正确渲染插件字段类型

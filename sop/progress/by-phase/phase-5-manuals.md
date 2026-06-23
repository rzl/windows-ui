# 阶段五：用户操作手册交付

## 目标

伴随系统实现过程，同步编写并交付给最终用户的操作手册。

## 手册目录

```
sop/manuals/
├── README.md
├── overview.md
├── getting-started/
│   ├── login.md
│   └── homepage.md
├── system/
│   ├── user.md
│   ├── role.md
│   ├── menu.md
│   ├── dept.md
│   └── dict.md
├── lowcode/
│   ├── model.md
│   ├── form-designer.md
│   ├── table-designer.md
│   └── run-page.md
├── monitor/
│   ├── message.md
│   └── server-monitor.md
└── appendix/
    └── faq.md
```

## 任务清单

- [x] 建立 `sop/manuals/` 目录结构与索引
- [x] 编写系统简介与快速开始
- [x] 编写登录、首页、导航手册
- [x] 编写系统管理操作手册
- [x] 编写低代码开发操作手册
- [x] 编写消息中心与系统监控操作手册
- [x] 编写常见问题附录
- [x] 在 SOP README 中补充用户手册规范

## 验收标准

- 每个已实现功能模块都有对应的用户操作手册
- 手册语言为中文，面向最终用户而非开发人员
- 手册包含操作步骤、字段说明、常见问题
- 后续新增/修改功能时，必须同步更新对应手册

## 维护约定

- 新增功能模块时，在 `sop/manuals/` 下新增对应章节
- 修改交互方式时，同步修订相关手册
- 重大版本发布前，由专人统一审校手册内容

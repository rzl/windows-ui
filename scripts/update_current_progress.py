#!/usr/bin/env python3
import re
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).parent.parent
DEVELOPS = ROOT / "develops"
TODAY = datetime.now().strftime("%Y-%m-%d")

CHANGES = {
    "form": {
        "entry": "新增异步验证支持：rules 中 validator 可返回 Promise",
        "checklist": ["异步验证支持（validator 返回 Promise）"],
        "todos_done": ["异步验证支持"],
    },
    "form-item": {
        "entry": "新增异步验证支持：配合 form 校验 Promise 返回错误信息",
    },
    "select": {
        "entry": "新增多选（multiple）、远程搜索（remote + remoteMethod）支持",
        "checklist": ["多选支持", "远程搜索支持"],
    },
    "table": {
        "entry": "新增行拖拽排序（rowDraggable）与 empty-text 国际化支持；暴露 resetColumnWidths 方法",
        "checklist": ["行拖拽排序", "empty-text 国际化"],
        "todos_done": ["行拖拽排序", "empty-text 接入 ConfigProvider", "国际化支持"],
    },
    "scrollbar": {
        "entry": "新增自定义滑块插槽（thumb）与 height/width 等尺寸 props",
        "checklist": ["自定义滑块插槽", "height/width props"],
    },
    "rich-text": {
        "entry": "新增更多格式工具按钮与纯文本模式（plainText）支持",
        "checklist": ["更多格式工具", "纯文本模式"],
    },
    "search-form": {
        "entry": "新增高级查询模式（advanced）与查询方案保存能力",
        "checklist": ["高级查询模式", "查询方案保存"],
    },
    "monaco-editor": {
        "entry": "新增 theme、options、width、loading 等 props，支持自定义 Monaco 配置",
        "checklist": ["theme/options 配置", "width/loading props"],
    },
    "page-container": {
        "entry": "新增 tabs 标签页支持与响应式布局适配",
        "checklist": ["tabs 标签页支持", "响应式布局"],
    },
    "advanced-query-builder": {
        "entry": "新增字段类型输入组件、maxLevel 层级限制与自定义运算符支持",
        "checklist": ["字段类型输入组件", "maxLevel", "自定义运算符"],
    },
    "admin-layout": {
        "entry": "新增完整 Admin 布局壳：logo、菜单、标签页、内容区与响应式折叠",
        "checklist": ["Logo", "菜单", "标签页", "内容区", "响应式折叠"],
    },
    "query-builder": {
        "entry": "重写为分组结构：支持 AND/OR 分组、字段类型自动匹配输入组件、保存查询方案",
        "checklist": ["条件分组（AND/OR）", "字段类型自动匹配输入组件", "保存查询方案"],
        "todos_done": ["支持条件分组（AND/OR）", "支持字段类型自动匹配输入组件", "支持保存常用查询方案"],
    },
    "loading": {
        "entry": "新增 v-loading 指令支持，支持布尔值、字符串与对象绑定",
        "checklist": ["v-loading 指令"],
    },
    "infinite-scroll": {
        "entry": "新增 v-infinite-scroll 指令支持，支持 disabled/distance/immediate 属性",
        "checklist": ["v-infinite-scroll 指令"],
    },
    "permission": {
        "entry": "新增 v-permission 指令支持，支持全局权限校验函数配置",
        "checklist": ["v-permission 指令"],
    },
}


def add_checklist(text: str, items: list[str]) -> str:
    section_match = re.search(r"## 实现清单\n(.*?)(?=\n## |\Z)", text, re.DOTALL)
    if not section_match:
        return text
    section = section_match.group(1)
    for item in items:
        if item in section:
            continue
        # 在实现清单末尾追加
        section = section.rstrip() + f"\n- [x] {item}"
    text = text[:section_match.start(1)] + section + text[section_match.end(1):]
    return text


def mark_todos_done(text: str, keywords: list[str]) -> str:
    section_match = re.search(r"## 待优化项.*?\n(.*?)(?=\n## |\Z)", text, re.DOTALL)
    if not section_match:
        return text
    section = section_match.group(1)
    for kw in keywords:
        # 将包含关键字的未勾选项改为已勾选
        pattern = re.compile(rf"^- \[ \](.*?{re.escape(kw)}.*?)$", re.MULTILINE)
        section = pattern.sub(r"- [x]\1", section)
    text = text[:section_match.start(1)] + section + text[section_match.end(1):]
    return text


def main():
    for name, cfg in CHANGES.items():
        progress_file = DEVELOPS / name / "progress.md"
        if not progress_file.exists():
            print(f"Skip missing: {progress_file}")
            continue
        text = progress_file.read_text(encoding="utf-8")
        original = text

        entry = f"- {TODAY}: {cfg['entry']}"
        if entry in text:
            print(f"Already recorded: {name}")
            continue

        if cfg.get("checklist"):
            text = add_checklist(text, cfg["checklist"])
        if cfg.get("todos_done"):
            text = mark_todos_done(text, cfg["todos_done"])

        text = text.rstrip() + f"\n{entry}\n"
        text = re.sub(r"\n{3,}", "\n\n", text)

        if text != original:
            progress_file.write_text(text, encoding="utf-8")
            print(f"Updated: develops/{name}/progress.md")


if __name__ == "__main__":
    main()

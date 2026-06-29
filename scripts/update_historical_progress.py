#!/usr/bin/env python3
import re
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).parent.parent
DEVELOPS = ROOT / "develops"
TODAY = datetime.now().strftime("%Y-%m-%d")

BATCHES = {
    "A": {
        "components": [
            "affix", "avatar", "breadcrumb", "date-picker", "date-time-picker",
            "link", "menu", "pagination", "popover", "segmented", "text",
            "time-picker", "time-select", "tour", "transfer",
        ],
        "entry": "修复 v-model 同步与声明未生效的 API，确保文档/示例中的 Props 行为一致",
    },
    "B": {
        "components": [
            "breadcrumb", "carousel", "checkbox", "collapse", "dropdown",
            "radio", "steps", "tabs", "timeline",
        ],
        "entry": "实现文档示例中缺失的子组件（如 item/group/pane 等），完善组件组合能力",
    },
    "C": {
        "components": [
            "calendar", "card", "cascader", "color-picker", "color-picker-panel",
            "descriptions", "dialog", "divider", "drawer", "empty", "form",
            "form-item", "image", "layout", "permission", "popconfirm", "popover",
            "result", "tooltip", "virtualized-table", "virtualized-tree", "watermark",
        ],
        "entry": "补齐文档中已声明但缺失的 Props/API（如 size、border、contentPosition、preview-src-list、row/col 等）",
    },
}


def main():
    for batch, cfg in BATCHES.items():
        entry = f"- {TODAY}: {cfg['entry']}"
        for name in cfg["components"]:
            progress_file = DEVELOPS / name / "progress.md"
            if not progress_file.exists():
                continue
            text = progress_file.read_text(encoding="utf-8")
            if entry in text:
                continue
            text = text.rstrip() + f"\n{entry}\n"
            text = re.sub(r"\n{3,}", "\n\n", text)
            progress_file.write_text(text, encoding="utf-8")
            print(f"[{batch}] Updated: develops/{name}/progress.md")


if __name__ == "__main__":
    main()

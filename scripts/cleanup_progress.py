#!/usr/bin/env python3
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from sync_docs import extract_props

ROOT = Path(__file__).parent.parent
SRC = ROOT / "packages/windows-ui/src/components"
DEVELOPS = ROOT / "develops"

SIZE_LINE = "统一尺寸规范：新增 size 支持，组件高度与内部图标随尺寸联动（small/default/large）"


def has_size_prop(vue_path: Path) -> bool:
    if not vue_path.exists():
        return False
    content = vue_path.read_text(encoding="utf-8")
    props = extract_props(content)
    return any(p["name"] == "size" for p in props)


def main():
    for comp_dir in sorted(SRC.iterdir()):
        if not comp_dir.is_dir():
            continue
        name = comp_dir.name
        vue_file = comp_dir / f"{name}.vue"
        progress_file = DEVELOPS / name / "progress.md"
        if not progress_file.exists():
            continue
        text = progress_file.read_text(encoding="utf-8")
        original = text

        # 如果组件没有 size prop，删除所有尺寸统一条目
        if not has_size_prop(vue_file):
            text = re.sub(rf"^- \d{{4}}-\d{{2}}-\d{{2}}: {re.escape(SIZE_LINE)}\n", "", text, flags=re.MULTILINE)
        else:
            # 保留已有的尺寸条目；若 2026-06-29 与之前重复则删除 2026-06-29 条目
            dates = re.findall(rf"^- (\d{{4}}-\d{{2}}-\d{{2}}): {re.escape(SIZE_LINE)}", text, flags=re.MULTILINE)
            if len(dates) > 1 and "2026-06-29" in dates:
                text = re.sub(rf"^- 2026-06-29: {re.escape(SIZE_LINE)}\n", "", text, count=1, flags=re.MULTILINE)

        # 清理连续空行
        text = re.sub(r"\n{3,}", "\n\n", text)
        if text != original:
            progress_file.write_text(text, encoding="utf-8")
            print(f"Cleaned: develops/{name}/progress.md")


if __name__ == "__main__":
    main()

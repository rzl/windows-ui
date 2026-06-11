#!/usr/bin/env python3
"""
同步组件文档：根据当前组件源码更新 docs、designs、develops 中的文档。
- usage.md：更新 Props 表格（保留示例和主题定制）。
- design.md：若组件支持 size，则同步尺寸规范说明。
- progress.md：追加本次尺寸/图标统一变更记录（若不存在）。
"""
import os, re, json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).parent.parent
SRC = ROOT / "packages/windows-ui/src/components"
DOCS = ROOT / "docs"
DESIGNS = ROOT / "designs"
DEVELOPS = ROOT / "develops"

EXAMPLES = {}
_examples_path = Path(__file__).parent / "examples.json"
if _examples_path.exists():
    EXAMPLES = json.loads(_examples_path.read_text(encoding="utf-8"))


def extract_props(content):
    props = []
    # 定位 defineProps({ 并做括号深度解析
    start = content.find("defineProps({")
    if start == -1:
        return props
    i = start + len("defineProps(")
    depth = 0
    in_string = False
    string_char = ""
    body_parts = []
    while i < len(content):
        ch = content[i]
        if in_string:
            if ch == "\\" and i + 1 < len(content):
                body_parts.append(ch)
                i += 1
                body_parts.append(content[i])
            elif ch == string_char:
                in_string = False
                body_parts.append(ch)
            else:
                body_parts.append(ch)
        else:
            if ch in "'\"":
                in_string = True
                string_char = ch
                body_parts.append(ch)
            elif ch in "{[":
                depth += 1
                body_parts.append(ch)
            elif ch in "}]":
                depth -= 1
                body_parts.append(ch)
                if depth == 0 and ch == "}":
                    # 跳过可能的空白和右括号
                    i += 1
                    while i < len(content) and content[i] in " \t\r\n":
                        i += 1
                    if i < len(content) and content[i] == ")":
                        break
                    else:
                        continue
            else:
                body_parts.append(ch)
        i += 1
    body = "".join(body_parts).strip()
    # 去掉外层花括号
    if body.startswith("{") and body.endswith("}"):
        body = body[1:-1]

    items = []
    depth = 0
    in_string = False
    string_char = ""
    cur = ""
    for ch in body:
        if in_string:
            if ch == "\\":
                cur += ch
            elif ch == string_char:
                in_string = False
                cur += ch
            else:
                cur += ch
        else:
            if ch in "'\"":
                in_string = True
                string_char = ch
                cur += ch
            elif ch in "{[":
                depth += 1
                cur += ch
            elif ch in "}]":
                depth -= 1
                cur += ch
            elif ch == "," and depth == 0:
                items.append(cur.strip())
                cur = ""
            else:
                cur += ch
    if cur.strip():
        items.append(cur.strip())

    for item in items:
        if ":" not in item:
            continue
        key, val = item.split(":", 1)
        key = key.strip()
        val = val.strip()
        ptype = "-"
        default = "-"
        val_clean = re.sub(r"\s+as\s+\w+", "", val)
        if val_clean in ("String", "Number", "Boolean", "Array", "Object", "Function"):
            ptype = val_clean.lower()
        elif val_clean.startswith("["):
            types = re.findall(r"[A-Za-z]+", val_clean)
            ptype = "/".join(t.lower() for t in types if t in ("String", "Number", "Boolean", "Array", "Object", "Function"))
        elif val_clean.startswith("{"):
            tm = re.search(r"type\s*:\s*([A-Za-z]+)", val_clean)
            if tm:
                ptype = tm.group(1).lower()
            dm = re.search(r"default\s*:\s*('[^']*'|\"[^\"]*\"|[^,\}]+)", val_clean)
            if dm:
                default = dm.group(1).strip().strip("'\"")
                if default.startswith("() =>"):
                    default = "[]" if "[]" in default else "{}"
        else:
            tm = re.search(r"([A-Za-z]+)", val_clean)
            if tm:
                ptype = tm.group(1).lower()
        props.append({"name": key, "type": ptype, "default": default})
    return props


def extract_emits(content):
    emits = []
    m = re.search(r"defineEmits\(\s*\[([^\]]*)\]\s*\)", content, re.DOTALL)
    if m:
        for s in m.group(1).split(","):
            s = s.strip().strip("'\"")
            if s:
                emits.append(s)
    m2 = re.search(r"defineEmits\(\s*\{([^}]*)\}\s*\)", content, re.DOTALL)
    if m2:
        for line in m2.group(1).split(","):
            if ":" in line:
                key = line.split(":")[0].strip().strip("'\"")
                if key:
                    emits.append(key)
    return emits


def extract_slots(content):
    slots = set()
    for m in re.finditer(r"<slot\s*(?:name=[\"']([^\"']+)[\"'])?[^>]*>", content):
        slots.add(m.group(1) or "default")
    for m in re.finditer(r"\$slots\.([A-Za-z0-9_]+)", content):
        slots.add(m.group(1))
    return sorted(slots)


def extract_expose(content):
    methods = []
    m = re.search(r"defineExpose\(\s*\{([^}]*)\}\s*\)", content, re.DOTALL)
    if m:
        for line in m.group(1).split(","):
            line = line.strip()
            if ":" in line:
                methods.append(line.split(":")[0].strip())
            elif line:
                methods.append(line)
    return methods


DESC_MAP = {
    "modelValue": "绑定值（支持 v-model）",
    "type": "类型",
    "size": "尺寸",
    "disabled": "是否禁用",
    "placeholder": "占位提示文本",
    "clearable": "是否可清空",
    "readonly": "是否只读",
    "icon": "图标名称",
    "title": "标题",
    "description": "描述文本",
    "closable": "是否可关闭",
    "center": "是否居中",
    "src": "图片地址",
    "alt": "替代文本",
    "shape": "形状",
    "round": "是否圆角",
    "plain": "是否朴素样式",
    "offset": "偏移量",
    "links": "锚点链接列表",
    "options": "选项数据",
    "bgColor": "背景颜色",
    "color": "文字颜色",
    "prefixIcon": "前缀图标",
    "suffixIcon": "后缀图标",
    "name": "名称",
    "label": "标签文本",
    "value": "值",
    "min": "最小值",
    "max": "最大值",
    "step": "步长",
    "maxlength": "最大长度",
    "rows": "行数",
    "loading": "是否加载中",
    "visible": "是否可见",
    "width": "宽度",
    "height": "高度",
    "data": "数据",
    "columns": "列配置",
    "format": "格式",
    "precision": "精度",
    "showTooltip": "是否显示提示",
    "range": "是否为范围选择",
    "multiple": "是否多选",
    "filterable": "是否可搜索",
    "allowCreate": "是否允许创建",
    "remote": "是否远程搜索",
    "collapseTags": "是否折叠标签",
    "pageSize": "每页条数",
    "total": "总条数",
    "currentPage": "当前页",
    "layout": "布局",
    "percentage": "百分比",
    "status": "状态",
    "strokeWidth": "线条宽度",
    "indeterminate": "是否不确定状态",
    "text": "文本内容",
    "href": "链接地址",
    "target": "打开方式",
    "underline": "是否下划线",
    "direction": "方向",
    "borderStyle": "边框样式",
    "contentPosition": "内容位置",
    "activeName": "当前激活项",
    "accordion": "是否手风琴模式",
    "position": "位置",
    "zIndex": "层级",
    "message": "消息内容",
    "duration": "持续时间(ms)",
    "showClose": "是否显示关闭按钮",
    "teleport": "传送目标",
    "appendToBody": "是否挂载到 body",
    "destroyOnClose": "关闭时是否销毁",
    "beforeClose": "关闭前回调",
    "fullscreen": "是否全屏",
    "modal": "是否显示遮罩",
    "modalClass": "遮罩类名",
    "closeOnClickModal": "点击遮罩是否关闭",
    "closeOnPressEscape": "ESC 是否关闭",
    "draggable": "是否可拖拽",
    "alignCenter": "是否居中对齐",
    "showCancelButton": "是否显示取消按钮",
    "showConfirmButton": "是否显示确认按钮",
    "cancelButtonText": "取消按钮文本",
    "confirmButtonText": "确认按钮文本",
    "cancelButtonClass": "取消按钮类名",
    "confirmButtonClass": "确认按钮类名",
    "inputType": "输入框类型",
    "inputValue": "输入框默认值",
    "inputPattern": "输入验证正则",
    "inputErrorMessage": "输入错误提示",
    "roundButton": "是否圆角按钮",
    "closeIcon": "关闭图标",
    "showInput": "是否显示输入框",
    "distinguishCancelAndClose": "区分取消与关闭",
    "lockScroll": "是否锁定滚动",
    "customClass": "自定义类名",
    "customStyle": "自定义样式",
    "top": "顶部距离",
    "bottom": "底部距离",
    "left": "左侧距离",
    "right": "右侧距离",
    "trigger": "触发方式",
    "placement": "弹出位置",
    "content": "内容",
    "rawContent": "是否原始 HTML",
    "enterable": "是否可进入",
    "hideAfter": "隐藏延迟(ms)",
    "showAfter": "显示延迟(ms)",
    "showArrow": "是否显示箭头",
    "popperClass": "弹出层类名",
    "popperStyle": "弹出层样式",
    "popperOptions": "弹出层选项",
    "tabindex": "tabindex",
    "virtualTriggering": "虚拟触发",
    "virtualRef": "虚拟引用元素",
    "persistent": "是否持久化",
    "ariaLabel": "ARIA 标签",
    "effect": "主题效果",
    "transition": "过渡动画",
    "stopPopperMouseEvent": "是否阻止鼠标事件",
    "gpuAcceleration": "GPU 加速",
    "boundariesPadding": "边界内边距",
    "fallbackPlacements": "回退位置",
    "containerPadding": "容器内边距",
    "strategy": "定位策略",
    "transformOrigin": "变换原点",
    "autoClose": "自动关闭时间(ms)",
    "showIcon": "是否显示图标",
    "confirmButtonType": "确认按钮类型",
    "cancelButtonType": "取消按钮类型",
    "iconColor": "图标颜色",
    "hideIcon": "是否隐藏图标",
    "teleported": "是否使用 teleport",
    "items": "菜单项列表",
    "mode": "菜单模式",
    "defaultActive": "默认激活项",
    "defaultOpeneds": "默认展开项",
    "uniqueOpened": "是否只保持一个子菜单展开",
    "menuTrigger": "子菜单触发方式",
    "collapse": "是否水平折叠",
    "ellipsis": "是否省略",
    "backgroundColor": "背景颜色",
    "textColor": "文字颜色",
    "activeTextColor": "激活文字颜色",
    "collapseTransition": "是否启用折叠动画",
    "popperOffset": "弹出层偏移",
    "closeOnClickOutside": "点击外部是否关闭",
    "showTimeout": "展开延迟(ms)",
    "hideTimeout": "收起延迟(ms)",
    "index": "唯一标识",
    "route": "路由路径",
    "to": "路由目标",
    "replace": "是否替换当前路由",
    "activeClass": "激活类名",
    "exactActiveClass": "精确激活类名",
    "ariaCurrentValue": "ARIA 当前值",
    "router": "是否使用 vue-router",
    "infiniteScrollDisabled": "是否禁用无限滚动",
    "infiniteScrollDistance": "触发距离",
    "infiniteScrollImmediate": "是否立即执行",
    "infiniteScrollDelay": "延迟时间(ms)",
    "imageSrc": "图片地址",
    "previewSrcList": "预览图片列表",
    "initialIndex": "初始索引",
    "infinite": "是否无限循环",
    "hideOnClickModal": "点击遮罩是否隐藏",
    "appendTo": "挂载目标",
    "zoomRate": "缩放比例",
    "minScale": "最小缩放",
    "maxScale": "最大缩放",
    "fit": "图片适应模式",
    "lazy": "是否懒加载",
    "scrollContainer": "滚动容器",
    "previewTeleported": "预览是否 teleport",
    "crossorigin": "跨域属性",
    "referrerPolicy": "引用策略",
    "dateFormat": "日期格式",
    "timeFormat": "时间格式",
    "startPlaceholder": "开始占位符",
    "endPlaceholder": "结束占位符",
    "startDate": "开始日期",
    "endDate": "结束日期",
    "unlinkPanels": "是否取消面板联动",
    "defaultTime": "默认时间",
    "valueFormat": "值格式",
    "shortcuts": "快捷选项",
    "disabledDate": "禁用日期函数",
    "cellClassName": "单元格类名",
    "modelModifiers": "修饰符",
    "isRange": "是否为范围选择",
    "arrowControl": "是否箭头控制",
    "pickerOptions": "选择器选项",
    "rangeSeparator": "范围分隔符",
    "defaultValue": "默认值",
    "selectableRange": "可选时间范围",
    "spinnerOptions": "Spinner 选项",
    "defaultOpenValue": "默认打开值",
    "clearIcon": "清空图标",
    "renderLabel": "标签渲染函数",
    "start": "开始时间",
    "end": "结束时间",
    "minTime": "最小时间",
    "maxTime": "最大时间",
    "editable": "是否可编辑",
    "activeColor": "激活颜色",
    "inactiveColor": "未激活颜色",
    "activeText": "激活文本",
    "inactiveText": "未激活文本",
    "activeValue": "激活值",
    "inactiveValue": "未激活值",
    "activeIconClass": "激活图标类名",
    "inactiveIconClass": "未激活图标类名",
    "beforeChange": "改变前钩子",
    "inlinePrompt": "是否行内提示",
    "validateEvent": "是否触发验证",
    "activeActionIcon": "激活操作图标",
    "inactiveActionIcon": "未激活操作图标",
    "borderColor": "边框颜色",
    "activeBorderColor": "激活边框颜色",
    "autosize": "是否自适应高度",
    "resize": "是否可以拖动调整大小",
    "showWordLimit": "是否显示字数统计",
    "showPassword": "是否显示密码切换",
    "inputStyle": "输入框样式",
    "autocomplete": "自动完成",
    "controls": "是否显示控制按钮",
    "stepStrictly": "是否只能输入步长的倍数",
    "debounce": "防抖延迟(ms)",
    "controlsPosition": "控制按钮位置",
    "length": "长度",
    "otp": "OTP 值",
    "separator": "分隔符",
    "mask": "是否遮罩",
    "avatar": "头像",
    "timestamp": "时间戳",
    "hideTimestamp": "是否隐藏时间戳",
    "hollow": "是否空心",
    "nodeKey": "节点唯一标识字段",
    "props": "配置选项",
    "renderAfterExpand": "是否在首次展开后才渲染",
    "load": "加载子树数据的方法",
    "renderContent": "节点渲染函数",
    "highlightCurrent": "是否高亮当前选中节点",
    "defaultExpandAll": "是否默认展开所有节点",
    "expandOnClickNode": "是否在点击节点时展开/收缩",
    "checkOnClickNode": "是否在点击节点时选中",
    "autoExpandParent": "是否自动展开父节点",
    "defaultCheckedKeys": "默认选中节点的 key 数组",
    "defaultExpandedKeys": "默认展开节点的 key 数组",
    "currentNodeKey": "当前选中节点的 key",
    "filterNodeMethod": "过滤节点方法",
    "indent": "缩进",
    "iconClass": "图标类名",
    "allowDrag": "是否允许拖拽",
    "allowDrop": "是否允许放置",
    "emptyText": "空文本",
    "showCheckbox": "是否显示复选框",
    "checkStrictly": "是否严格遵循父子不互相关联",
    "checkable": "是否可选中",
    "selectable": "是否可选择",
    "selectedKeys": "选中项 key",
    "checkedKeys": "勾选项 key",
    "expandedKeys": "展开项 key",
    "showLine": "是否显示连接线",
    "showIcon": "是否显示图标",
    "switcherIcon": "展开/折叠图标",
    "blockNode": "是否块状节点",
    "filterTreeNode": "过滤节点",
    "loadData": "异步加载数据",
    "loadedKeys": "已加载 key",
    "directory": "是否目录树",
    "treeData": "树形数据",
    "fieldNames": "字段映射",
    "virtual": "是否虚拟滚动",
    "itemHeight": "项高度",
    "buffer": "缓冲区大小",
    "showHeader": "是否显示表头",
    "highlightCurrentRow": "是否高亮当前行",
    "rowKey": "行 key",
    "tooltipEffect": "提示效果",
    "tooltipOptions": "提示选项",
    "showSummary": "是否显示合计行",
    "sumText": "合计文本",
    "summaryMethod": "合计方法",
    "spanMethod": "合并行/列方法",
    "selectOnIndeterminate": "全选时选中不确定状态",
    "treeProps": "树形配置",
    "tableLayout": "表格布局",
    "scrollbarAlwaysOn": "滚动条是否常显",
    "showOverflowTooltip": "溢出提示",
    "flexible": "是否弹性",
    "stripe": "是否斑马纹",
    "border": "是否纵向边框",
    "maxHeight": "最大高度",
    "rowClassName": "行类名",
    "headerRowClassName": "表头行类名",
    "headerCellClassName": "表头单元格类名",
    "headerCellStyle": "表头单元格样式",
    "cellStyle": "单元格样式",
    "rowStyle": "行样式",
    "headerRowStyle": "表头行样式",
    "sortMethod": "排序方法",
    "sortBy": "排序依据",
    "sortOrders": "排序顺序",
    "reserveSelection": "是否保留选中状态",
    "defaultSort": "默认排序",
    "className": "表格类名",
    "style": "表格样式",
    "scrollbarTabindex": "滚动条 tabindex",
    "id": "ID",
    "expandRowKeys": "展开行 key",
    "tagType": "标签类型",
    "tagEffect": "标签效果",
    "tagProps": "标签 props",
    "maxCollapseTags": "最大折叠标签数",
    "loadingText": "加载文本",
    "noMatchText": "无匹配文本",
    "noDataText": "无数据文本",
    "automaticDropdown": "是否自动展开",
    "multipleLimit": "多选限制",
    "remoteMethod": "远程搜索方法",
    "reserveKeyword": "是否保留关键字",
    "defaultFirstOption": "是否默认选中第一项",
    "filterMethod": "过滤方法",
    "remoteShowSuffix": "远程搜索显示后缀",
    "suffixTransition": "后缀过渡",
    "fitInputWidth": "是否适配输入框宽度",
    "prefix": "前缀内容",
    "suffix": "后缀内容",
    "empty": "空状态内容",
    "header": "头部内容",
    "footer": "底部内容",
    "action": "操作区内容",
    "prepend": "前置内容",
    "append": "后置内容",
    "prop": "字段名",
    "rules": "验证规则",
    "inline": "是否行内表单",
    "labelPosition": "标签位置",
    "labelWidth": "标签宽度",
    "labelSuffix": "标签后缀",
    "hideRequiredAsterisk": "是否隐藏必填星号",
    "showMessage": "是否显示验证信息",
    "inlineMessage": "是否行内显示信息",
    "statusIcon": "是否显示状态图标",
    "validateOnRuleChange": "规则改变时是否验证",
    "scrollToError": "是否滚动到错误项",
    "scrollIntoViewOptions": "滚动选项",
    "requireAsteriskPosition": "必填星号位置",
    "validate": "验证方法",
    "validateField": "验证字段方法",
    "resetFields": "重置字段方法",
    "scrollToField": "滚动到字段方法",
    "clearValidate": "清除验证方法",
    "block": "是否独占一行",
    "delete": "是否添加删除线",
    "code": "是否代码样式",
    "mark": "是否标记样式",
    "keyboard": "是否键盘样式",
    "strong": "是否加粗",
    "minDate": "最小日期",
    "maxDate": "最大日期",
    "focus": "是否聚焦",
    "dateCell": "日期单元格渲染",
    "rangeStartLabel": "范围开始标签",
    "rangeEndLabel": "范围结束标签",
    "rangeStartPlaceholder": "范围开始占位符",
    "rangeEndPlaceholder": "范围结束占位符",
    "cellRender": "单元格渲染函数",
    "prefix-icon": "前缀图标",
    "suffix-icon": "后缀图标",
    "show-password": "是否显示密码切换",
    "model-value": "绑定值（支持 v-model）",
    "update:modelValue": "绑定值更新时触发",
    "wordLimit": "是否显示字数统计",
}


def infer_desc(name):
    return DESC_MAP.get(name, "-")


def emit_desc(name):
    MAP = {
        "update:modelValue": "绑定值更新",
        "input": "输入时触发",
        "change": "值改变时触发",
        "focus": "获取焦点时触发",
        "blur": "失去焦点时触发",
        "clear": "清空时触发",
        "click": "点击时触发",
        "close": "关闭时触发",
        "select": "选中时触发",
        "check": "选中/取消时触发",
        "current-change": "当前页改变时触发",
        "size-change": "每页条数改变时触发",
        "prev-click": "上一页点击时触发",
        "next-click": "下一页点击时触发",
        "tab-click": "标签页点击时触发",
        "tab-remove": "标签页移除时触发",
        "tab-add": "标签页添加时触发",
        "edit": "编辑时触发",
        "delete": "删除时触发",
        "command": "菜单项点击时触发",
        "open": "打开时触发",
        "opened": "打开动画结束后触发",
        "closed": "关闭动画结束后触发",
        "confirm": "确认时触发",
        "cancel": "取消时触发",
        "submit": "提交时触发",
        "validate": "验证时触发",
        "error": "错误时触发",
        "success": "成功时触发",
        "warning": "警告时触发",
        "node-click": "节点点击时触发",
        "node-expand": "节点展开时触发",
        "node-collapse": "节点折叠时触发",
        "check-change": "选中状态改变时触发",
        "node-drop": "节点拖拽完成时触发",
        "node-drag-start": "节点拖拽开始时触发",
        "node-drag-enter": "节点拖拽进入时触发",
        "node-drag-leave": "节点拖拽离开时触发",
        "node-drag-over": "节点拖拽经过时触发",
        "node-drag-end": "节点拖拽结束时触发",
        "sort-change": "排序改变时触发",
        "filter-change": "筛选改变时触发",
        "header-click": "表头点击时触发",
        "header-contextmenu": "表头右键时触发",
        "row-click": "行点击时触发",
        "row-contextmenu": "行右键时触发",
        "row-dblclick": "行双击时触发",
        "cell-click": "单元格点击时触发",
        "cell-contextmenu": "单元格右键时触发",
        "cell-dblclick": "单元格双击时触发",
        "expand-change": "展开行改变时触发",
        "selection-change": "选中项改变时触发",
        "select-all": "全选时触发",
        "visible-change": "下拉框出现/隐藏时触发",
        "remove-tag": "移除标签时触发",
        "active-change": "颜色值改变时触发",
        "active-item-change": "父级选项改变时触发",
        "scroll": "滚动时触发",
        "load": "加载时触发",
        "switch": "切换时触发",
        "prev": "上一张时触发",
        "next": "下一张时触发",
        "rate": "评分改变时触发",
        "step": "步进时触发",
        "keydown": "按键按下时触发",
        "keyup": "按键松开时触发",
        "keypress": "按键按压时触发",
        "paste": "粘贴时触发",
        "compositionstart": "输入法开始输入时触发",
        "compositionupdate": "输入法更新时触发",
        "compositionend": "输入法结束输入时触发",
        "mouseenter": "鼠标进入时触发",
        "mouseleave": "鼠标离开时触发",
        "mouseover": "鼠标悬停时触发",
        "mouseout": "鼠标移出时触发",
        "mousedown": "鼠标按下时触发",
        "mouseup": "鼠标松开时触发",
        "touchstart": "触摸开始时触发",
        "touchend": "触摸结束时触发",
        "touchmove": "触摸移动时触发",
        "resize": "调整大小时触发",
        "hook-updated": "更新时触发",
        "hook-mounted": "挂载时触发",
        "hook-unmounted": "卸载时触发",
        "update:activeName": "激活项更新时触发",
        "update:visible": "可见性更新时触发",
        "update:currentPage": "当前页更新时触发",
        "update:pageSize": "每页条数更新时触发",
        "update:current-node-key": "当前节点 key 更新时触发",
        "update:expanded-keys": "展开项更新时触发",
        "update:checked-keys": "勾选项更新时触发",
        "update:selected-keys": "选中项更新时触发",
        "update:openeds": "展开项更新时触发",
    }
    return MAP.get(name, "-")


def emit_args(name):
    MAP = {
        "update:modelValue": "value",
        "input": "value",
        "change": "value",
        "focus": "event",
        "blur": "event",
        "clear": "-",
        "click": "event",
        "select": "item",
        "check": "(checked, node)",
        "current-change": "currentPage",
        "size-change": "pageSize",
        "prev-click": "currentPage",
        "next-click": "currentPage",
        "tab-click": "tab",
        "tab-remove": "name",
        "tab-add": "-",
        "edit": "(index, row)",
        "delete": "(index, row)",
        "command": "command",
        "open": "-",
        "opened": "-",
        "close": "-",
        "closed": "-",
        "confirm": "-",
        "cancel": "-",
        "submit": "-",
        "validate": "(valid, fields)",
        "error": "error",
        "success": "-",
        "warning": "-",
        "node-click": "(data, node)",
        "node-expand": "(data, node)",
        "node-collapse": "(data, node)",
        "check-change": "(data, checked)",
        "node-drop": "(draggingNode, dropNode, dropType)",
        "node-drag-start": "(node, event)",
        "node-drag-enter": "(draggingNode, dropNode, event)",
        "node-drag-leave": "(draggingNode, dropNode, event)",
        "node-drag-over": "(draggingNode, dropNode, event)",
        "node-drag-end": "(draggingNode, dropNode, dropType, event)",
        "sort-change": "(column, prop, order)",
        "filter-change": "filters",
        "header-click": "(column, event)",
        "header-contextmenu": "(column, event)",
        "row-click": "(row, column, event)",
        "row-contextmenu": "(row, column, event)",
        "row-dblclick": "(row, column, event)",
        "cell-click": "(row, column, cell, event)",
        "cell-contextmenu": "(row, column, cell, event)",
        "cell-dblclick": "(row, column, cell, event)",
        "expand-change": "(row, expandedRows)",
        "selection-change": "selection",
        "select": "(selection, row)",
        "select-all": "selection",
        "visible-change": "visible",
        "remove-tag": "tagValue",
        "active-change": "value",
        "active-item-change": "(activePath, activeValue)",
        "scroll": "(e, position)",
        "load": "(node, resolve)",
        "error": "event",
        "switch": "index",
        "prev": "index",
        "next": "index",
        "rate": "value",
        "step": "(currentValue, oldValue)",
        "keydown": "event",
        "keyup": "event",
        "keypress": "event",
        "paste": "event",
        "compositionstart": "event",
        "compositionupdate": "event",
        "compositionend": "event",
        "mouseenter": "event",
        "mouseleave": "event",
        "mouseover": "event",
        "mouseout": "event",
        "mousedown": "event",
        "mouseup": "event",
        "touchstart": "event",
        "touchend": "event",
        "touchmove": "event",
        "scroll": "event",
        "resize": "event",
        "hook-updated": "-",
        "hook-mounted": "-",
        "hook-unmounted": "-",
        "update:activeName": "activeName",
        "update:visible": "visible",
        "update:currentPage": "currentPage",
        "update:pageSize": "pageSize",
        "update:current-node-key": "currentNodeKey",
        "update:expanded-keys": "expandedKeys",
        "update:checked-keys": "checkedKeys",
        "update:selected-keys": "selectedKeys",
        "update:openeds": "openeds",
    }
    return MAP.get(name, "-")


def slot_desc(name):
    MAP = {
        "default": "默认内容",
        "prefix": "前缀内容",
        "suffix": "后缀内容",
        "empty": "空状态内容",
        "header": "头部内容",
        "footer": "底部内容",
        "action": "操作区内容",
        "prepend": "前置内容",
        "append": "后置内容",
        "loading": "加载状态插槽",
        "icon": "图标插槽",
        "title": "标题插槽",
        "content": "内容插槽",
        "label": "标签内容",
        "item": "选项内容",
        "option": "选项内容",
        "trigger": "触发元素插槽",
        "reference": "触发元素插槽",
        "dropdown": "下拉菜单内容",
        "dateCell": "日期单元格内容",
        "range-start": "范围开始插槽",
        "range-end": "范围结束插槽",
        "left": "左侧内容",
        "right": "右侧内容",
        "top": "顶部内容",
        "bottom": "底部内容",
        "prev": "上一页插槽",
        "next": "下一页插槽",
        "jumper": "跳转插槽",
        "total": "总条数插槽",
        "sizes": "每页条数插槽",
        "expand": "展开行内容",
        "emptyText": "空数据文本插槽",
        "more": "更多插槽",
        "prevText": "上一页文本",
        "nextText": "下一页文本",
        "prev-icon": "上一页图标",
        "next-icon": "下一页图标",
        "bar-icon": "滚动条图标",
        "thumb": "滚动条滑块",
        "empty-image": "空状态图片",
        "empty-description": "空状态描述",
        "empty-button": "空状态按钮",
        "error": "错误状态插槽",
        "placeholder": "占位符插槽",
        "editor": "编辑器插槽",
        "toolbar": "工具栏插槽",
        "panel": "面板插槽",
        "pane": "面板插槽",
        "left-pane": "左侧面板",
        "right-pane": "右侧面板",
        "top-pane": "顶部面板",
        "bottom-pane": "底部面板",
        "header-left": "头部左侧",
        "header-right": "头部右侧",
        "body": "主体内容",
        "backtop": "回到顶部图标",
        "tip": "提示内容",
        "progress": "进度条内容",
        "format": "格式插槽",
        "node": "节点插槽",
        "scoped": "作用域插槽",
        "tree-node": "树节点插槽",
        "tree-node-content": "树节点内容",
        "column": "列插槽",
        "operation": "操作列插槽",
        "buttons": "按钮组插槽",
        "menu": "菜单插槽",
        "submenu": "子菜单插槽",
        "group": "分组插槽",
        "breadcrumb-item": "面包屑项插槽",
        "step": "步骤插槽",
        "description": "描述插槽",
        "avatar": "头像插槽",
        "badge": "徽标插槽",
        "tag": "标签插槽",
        "image": "图片插槽",
        "preview": "预览插槽",
        "carousel-item": "轮播项插槽",
        "timeline-item": "时间轴项插槽",
        "tab-pane": "标签页插槽",
        "collapse-item": "折叠面板项插槽",
        "color": "颜色插槽",
        "input": "输入框插槽",
        "textarea": "文本域插槽",
        "select": "选择器插槽",
        "cascader": "级联选择器插槽",
        "datepicker": "日期选择器插槽",
        "timepicker": "时间选择器插槽",
        "datetimepicker": "日期时间选择器插槽",
        "colorpicker": "颜色选择器插槽",
        "transfer": "穿梭框插槽",
        "upload": "上传插槽",
        "form-item": "表单项插槽",
        "form-item-label": "表单项标签插槽",
        "form-item-error": "表单项错误插槽",
        "statistic": "统计插槽",
        "countdown": "倒计时插槽",
        "skeleton": "骨架屏插槽",
        "skeleton-item": "骨架屏项插槽",
        "result": "结果插槽",
        "result-icon": "结果图标插槽",
        "result-title": "结果标题插槽",
        "result-subtitle": "结果副标题插槽",
        "result-extra": "结果额外内容插槽",
        "tour": "漫游引导插槽",
        "tour-step": "漫游引导步骤插槽",
        "mention": "提及插槽",
        "segmented": "分段控制器插槽",
        "virtualized-select": "虚拟选择器插槽",
        "virtualized-table": "虚拟表格插槽",
        "virtualized-tree": "虚拟树插槽",
        "watermark": "水印插槽",
        "drawer": "抽屉插槽",
        "drawer-header": "抽屉头部插槽",
        "drawer-body": "抽屉主体插槽",
        "drawer-footer": "抽屉底部插槽",
        "dialog": "对话框插槽",
        "dialog-header": "对话框头部插槽",
        "dialog-body": "对话框主体插槽",
        "dialog-footer": "对话框底部插槽",
        "message": "消息插槽",
        "message-box": "消息框插槽",
        "notification": "通知插槽",
        "popover": "弹出框插槽",
        "popconfirm": "确认弹出框插槽",
        "tooltip": "文字提示插槽",
        "dropdown-item": "下拉项插槽",
        "dropdown-menu": "下拉菜单插槽",
        "submenu-title": "子菜单标题插槽",
        "menu-item": "菜单项插槽",
        "anchor-link": "锚点链接插槽",
        "backtop-icon": "回到顶部图标插槽",
        "affix": "固钉插槽",
        "autocomplete": "自动补全插槽",
        "backtop": "回到顶部插槽",
        "otp": "OTP 插槽",
        "input-number": "数字输入插槽",
        "input-tag": "标签输入插槽",
        "color-picker": "颜色选择插槽",
        "color-picker-panel": "颜色面板插槽",
        "date-picker": "日期选择插槽",
        "date-picker-panel": "日期面板插槽",
        "date-time-picker": "日期时间选择插槽",
        "time-picker": "时间选择插槽",
        "time-select": "时间选择插槽",
        "tree-select": "树选择插槽",
        "page-header": "页头插槽",
        "page-header-left": "页头左侧插槽",
        "page-header-right": "页头右侧插槽",
        "page-header-title": "页头标题插槽",
        "page-header-subtitle": "页头副标题插槽",
        "page-header-back": "页头返回插槽",
        "page-header-content": "页头内容插槽",
        "page-header-extra": "页头额外插槽",
        "page-header-breadcrumb": "页头面包屑插槽",
        "page-header-footer": "页头底部插槽",
        "infinite-scroll": "无限滚动插槽",
        "scrollbar": "滚动条插槽",
        "splitter": "分割器插槽",
        "splitter-pane": "分割器面板插槽",
        "container": "容器插槽",
        "layout": "布局插槽",
        "layout-header": "布局头部插槽",
        "layout-footer": "布局底部插槽",
        "layout-aside": "布局侧边栏插槽",
        "layout-main": "布局主内容插槽",
        "space": "间距插槽",
        "link": "链接插槽",
        "divider": "分割线插槽",
        "border": "边框插槽",
        "text": "文本插槽",
        "typography": "排版插槽",
        "empty": "空状态插槽",
        "image-preview": "图片预览插槽",
        "image-error": "图片错误插槽",
        "image-placeholder": "图片占位插槽",
        "image-loading": "图片加载插槽",
        "carousel": "轮播插槽",
        "calendar": "日历插槽",
        "calendar-header": "日历头部插槽",
        "calendar-cell": "日历单元格插槽",
        "statistic": "统计插槽",
        "statistic-title": "统计标题插槽",
        "statistic-prefix": "统计前缀插槽",
        "statistic-suffix": "统计后缀插槽",
        "statistic-value": "统计值插槽",
        "statistic-separator": "统计分隔符插槽",
        "steps": "步骤条插槽",
        "step-title": "步骤标题插槽",
        "step-description": "步骤描述插槽",
        "step-icon": "步骤图标插槽",
        "pagination": "分页插槽",
        "transfer-panel": "穿梭框面板插槽",
        "transfer-panel-header": "穿梭框面板头部插槽",
        "transfer-panel-footer": "穿梭框面板底部插槽",
        "transfer-panel-body": "穿梭框面板主体插槽",
        "transfer-panel-empty": "穿梭框面板空状态插槽",
        "transfer-panel-item": "穿梭框面板项插槽",
        "tree": "树插槽",
        "tree-node-icon": "树节点图标插槽",
        "tree-node-label": "树节点标签插槽",
        "table": "表格插槽",
        "table-column": "表格列插槽",
        "table-header": "表格头部插槽",
        "table-body": "表格主体插槽",
        "table-footer": "表格底部插槽",
        "table-empty": "表格空状态插槽",
        "table-loading": "表格加载插槽",
        "table-expand": "表格展开行插槽",
        "table-append": "表格附加插槽",
        "table-column-default": "表格列默认插槽",
        "table-column-header": "表格列头部插槽",
        "form": "表单插槽",
        "form-item-default": "表单项默认插槽",
        "form-item-label": "表单项标签插槽",
        "form-item-error": "表单项错误插槽",
        "descriptions": "描述列表插槽",
        "descriptions-item": "描述列表项插槽",
        "descriptions-title": "描述列表标题插槽",
        "descriptions-extra": "描述列表额外插槽",
        "tabs": "标签页插槽",
        "tabs-nav": "标签页导航插槽",
        "tabs-nav-left": "标签页导航左侧插槽",
        "tabs-nav-right": "标签页导航右侧插槽",
        "tabs-nav-extra": "标签页导航额外插槽",
        "tab-pane": "标签页面板插槽",
        "collapse": "折叠面板插槽",
        "collapse-item-title": "折叠面板项标题插槽",
        "collapse-item-content": "折叠面板项内容插槽",
        "card": "卡片插槽",
        "card-header": "卡片头部插槽",
        "card-body": "卡片主体插槽",
        "card-footer": "卡片底部插槽",
        "card-cover": "卡片封面插槽",
        "card-actions": "卡片操作插槽",
        "skeleton": "骨架屏插槽",
        "skeleton-item": "骨架屏项插槽",
        "result": "结果插槽",
        "result-icon": "结果图标插槽",
        "result-title": "结果标题插槽",
        "result-subtitle": "结果副标题插槽",
        "result-extra": "结果额外内容插槽",
        "alert": "警告插槽",
        "alert-title": "警告标题插槽",
        "alert-description": "警告描述插槽",
        "alert-icon": "警告图标插槽",
        "alert-close": "警告关闭插槽",
        "badge": "徽标插槽",
        "breadcrumb": "面包屑插槽",
        "breadcrumb-item": "面包屑项插槽",
        "breadcrumb-separator": "面包屑分隔符插槽",
        "dropdown": "下拉插槽",
        "dropdown-menu": "下拉菜单插槽",
        "dropdown-item": "下拉项插槽",
        "menu": "菜单插槽",
        "menu-item": "菜单项插槽",
        "submenu": "子菜单插槽",
        "submenu-title": "子菜单标题插槽",
        "page-header": "页头插槽",
        "anchor": "锚点插槽",
        "anchor-link": "锚点链接插槽",
        "backtop": "回到顶部插槽",
        "tour": "漫游引导插槽",
        "tour-step": "漫游引导步骤插槽",
        "watermark": "水印插槽",
        "loading": "加载插槽",
        "message": "消息插槽",
        "message-box": "消息框插槽",
        "notification": "通知插槽",
        "dialog": "对话框插槽",
        "drawer": "抽屉插槽",
        "popover": "弹出框插槽",
        "popconfirm": "确认弹出框插槽",
        "tooltip": "文字提示插槽",
        "config-provider": "配置提供者插槽",
    }
    return MAP.get(name, "自定义内容")


def normalize_default(p):
    name = p["name"]
    default = p["default"]
    if name == "size" and default in ("-", "undefined"):
        return "default（继承全局 size）"
    if default == "-" or default == "undefined":
        return "-"
    return default


def generate_props_table(props):
    if not props:
        return ""
    lines = ["### Props", "", "| 属性名 | 说明 | 类型 | 默认值 |", "|--------|------|------|--------|"]
    for p in props:
        desc = infer_desc(p["name"])
        default = normalize_default(p)
        lines.append(f"| {p['name']} | {desc} | {p['type']} | {default} |")
    lines.append("")
    return "\n".join(lines)


def generate_events_table(emits):
    if not emits:
        return ""
    lines = ["### Events", "", "| 事件名 | 说明 | 回调参数 |", "|--------|------|----------|"]
    for e in emits:
        lines.append(f"| {e} | {emit_desc(e)} | {emit_args(e)} |")
    lines.append("")
    return "\n".join(lines)


def generate_slots_table(slots):
    if not slots:
        return ""
    lines = ["### Slots", "", "| 插槽名 | 说明 |", "|--------|------|"]
    for s in slots:
        lines.append(f"| {s} | {slot_desc(s)} |")
    lines.append("")
    return "\n".join(lines)


def generate_methods_table(methods):
    if not methods:
        return ""
    lines = ["### Methods", "", "| 方法名 | 说明 |", "|--------|------|"]
    for m in methods:
        lines.append(f"| {m} | 组件暴露的方法 |")
    lines.append("")
    return "\n".join(lines)


def update_usage_md(name, content, vue_path):
    doc_dir = DOCS / name
    doc_dir.mkdir(parents=True, exist_ok=True)
    doc_file = doc_dir / "usage.md"

    props = extract_props(content)
    emits = extract_emits(content)
    slots = extract_slots(content)
    methods = extract_expose(content)

    if doc_file.exists():
        text = doc_file.read_text(encoding="utf-8")
    else:
        # 新建文件，使用 gen_docs 风格的标题
        title = name.replace("-", " ").title()
        text = f"# {title} - 使用说明\n\n## 基础用法\n\n```vue\n<w-{name} />\n```\n\n## API\n\n## 主题定制\n\n可通过 CSS 变量自定义主题色。\n"

    # 替换/插入 Props 表格
    props_table = generate_props_table(props)
    events_table = generate_events_table(emits)
    slots_table = generate_slots_table(slots)
    methods_table = generate_methods_table(methods)

    api_parts = []
    if props_table:
        api_parts.append(props_table)
    if events_table:
        api_parts.append(events_table)
    if slots_table:
        api_parts.append(slots_table)
    if methods_table:
        api_parts.append(methods_table)
    api_block = "\n".join(api_parts).rstrip() + "\n"

    # 先移除散落的 Props/Events/Slots/Methods 区块（不论是否在 ## API 下）
    section_pattern = re.compile(r"\n### (Props|Events|Slots|Methods)\n\n.*?\n(?=\n## |\n### |\Z)", re.DOTALL)
    text = section_pattern.sub("\n", text)

    # 统一放到 ## API 下
    api_pattern = re.compile(r"\n## API\s*\n(.*?)(?=\n## [^#]|\Z)", re.DOTALL)
    if api_pattern.search(text):
        text = api_pattern.sub(f"\n## API\n\n{api_block}", text)
    else:
        theme_pattern = re.compile(r"(\n## 主题定制)")
        if theme_pattern.search(text):
            text = theme_pattern.sub(f"\n## API\n\n{api_block}\\1", text)
        else:
            text = text.rstrip() + f"\n\n## API\n\n{api_block}"

    # 统一主题定制段落
    theme_block = (
        "## 主题定制\n\n"
        "可通过 CSS 变量自定义主题色：\n\n"
        "```css\n"
        ":root {\n"
        "  --w-color-primary: #245edb;\n"
        "  --w-bg-color: #ece9d8;\n"
        "  --w-text-color-primary: #000;\n"
        "  --w-border-radius-base: 3px;\n"
        "  --w-font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;\n"
        "}\n"
        "```"
    )
    theme_pattern = re.compile(r"\n## 主题定制\s*\n.*?(?=\n## |\Z)", re.DOTALL)
    if theme_pattern.search(text):
        text = theme_pattern.sub(f"\n{theme_block}\n", text)
    else:
        text = text.rstrip() + f"\n\n{theme_block}\n"

    # 清理多余空行
    text = re.sub(r"\n{3,}", "\n\n", text)

    doc_file.write_text(text, encoding="utf-8")
    return True


def update_design_md(name, content):
    design_dir = DESIGNS / name
    design_dir.mkdir(parents=True, exist_ok=True)
    design_file = design_dir / "design.md"

    has_size = any(p["name"] == "size" for p in extract_props(content))

    if design_file.exists():
        text = design_file.read_text(encoding="utf-8")
    else:
        title = name.replace("-", " ").title()
        text = f"# {title} - 设计文档\n\n## 组件分类\nOthers\n\n## 视觉设计\n\n### 设计理念\n该组件采用 Windows XP 经典视觉风格。\n\n### 色彩规范\n- 主色: #245edb (XP Blue)\n- 背景色: #ece9d8\n- 边框色: #919b9c\n\n### 尺寸规范\n- 字体基础大小: 11px\n- 圆角: 3px\n\n## 交互设计\n- 悬停状态: 颜色加深/高亮\n- 禁用状态: 透明度 0.5\n\n## 可访问性\n- 支持键盘导航\n"

    if has_size:
        size_section = """### 尺寸规范
- 尺寸可选：small / default / large
- 默认高度：32px（default），跟随 CSS 变量 `--w-component-size`
- 小尺寸：24px（`--w-component-size-small`）
- 大尺寸：40px（`--w-component-size-large`）
- 组件内部图标（如有）随组件 size 联动"""

        # 替换已有的 ### 尺寸规范 区块
        pattern = re.compile(r"\n### 尺寸规范\n(.*?)(?=\n### |\n## |\Z)", re.DOTALL)
        if pattern.search(text):
            text = pattern.sub(f"\n{size_section}\n", text)
        else:
            # 在 ### 色彩规范 后插入
            insert_after = re.compile(r"(\n### 色彩规范\n(?:.*?)(?=\n### |\n## |\Z))", re.DOTALL)
            if insert_after.search(text):
                text = insert_after.sub(r"\1\n\n" + size_section, text, count=1)
            else:
                # 在 ## 视觉设计 后插入
                insert_after_visual = re.compile(r"(\n## 视觉设计\n(?:.*?)(?=\n## |\Z))", re.DOTALL)
                text = insert_after_visual.sub(r"\1\n\n" + size_section, text, count=1)

    design_file.write_text(text, encoding="utf-8")
    return True


def update_progress_md(name):
    progress_dir = DEVELOPS / name
    progress_dir.mkdir(parents=True, exist_ok=True)
    progress_file = progress_dir / "progress.md"

    today = datetime.now().strftime("%Y-%m-%d")
    entry = f"- {today}: 统一尺寸规范：新增 size 支持，组件高度与内部图标随尺寸联动（small/default/large）"

    if progress_file.exists():
        text = progress_file.read_text(encoding="utf-8")
    else:
        title = name.replace("-", " ").title()
        text = f"# {title} - 开发进度\n\n## 状态\n已完成\n\n## 实现清单\n- [x] 基础结构实现\n- [x] Windows XP 样式设计\n- [x] Props 定义\n- [x] Events 定义\n- [x] 基础交互逻辑\n- [x] 示例代码\n\n## 待优化项\n- [ ] 单元测试覆盖\n- [ ] 性能优化\n- [ ] 无障碍支持完善\n- [ ] 国际化支持\n\n## 变更记录\n"

    # 避免重复追加同一天相同条目
    if entry in text:
        return False

    text = text.rstrip() + f"\n{entry}\n"
    progress_file.write_text(text, encoding="utf-8")
    return True


def main():
    updated = []
    for comp_dir in sorted(SRC.iterdir()):
        if not comp_dir.is_dir():
            continue
        name = comp_dir.name
        vue_file = comp_dir / f"{name}.vue"
        if not vue_file.exists():
            continue
        content = vue_file.read_text(encoding="utf-8")
        update_usage_md(name, content, vue_file)
        update_design_md(name, content)
        if update_progress_md(name):
            updated.append(name)
        print(f"Synced docs for {name}")

    print(f"\nUpdated progress.md for {len(updated)} components")


if __name__ == "__main__":
    main()

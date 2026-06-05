import json, os

with open('scripts/examples.json', 'r', encoding='utf-8') as f:
    examples = json.load(f)

def add(name, template, script='', style=''):
    code = '<template>\n' + template + '\n</template>'
    if script:
        code += '\n\n<script setup>\n' + script + '\n</script>'
    if style:
        code += '\n\n<style scoped>\n' + style + '\n</style>'
    examples[name] = code

# Infinite Scroll
add('infinite-scroll',
'''  <ul v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled">
    <li v-for="i in count" :key="i" class="list-item">{{ i }}</li>
  </ul>
  <p v-if="loading">加载中...</p>
  <p v-if="noMore">没有更多了</p>''',
"""import { ref, computed } from 'vue'
const count = ref(10)
const loading = ref(false)
const noMore = computed(() => count.value >= 20)
const disabled = computed(() => loading.value || noMore.value)
const load = () => {
  loading.value = true
  setTimeout(() => {
    count.value += 2
    loading.value = false
  }, 2000)
}""",
""".list { height: 300px; overflow: auto; padding: 0; margin: 0; list-style: none; }
.list-item { display: flex; align-items: center; justify-content: center; height: 50px; border-bottom: 1px solid #e8e8e8; }""")

# Mention
add('mention',
'''  <w-mention v-model="text" :options="options" placeholder="输入 @ 提及用户" />''',
"""import { ref } from 'vue'
import { WMention } from '@windows-ui/core'
const text = ref('')
const options = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' }
]""")

# Page Header
add('page-header',
'''  <w-page-header title="详情页面" content="详情内容" @back="goBack" />''',
"import { WPageHeader } from '@windows-ui/core'\nconst goBack = () => console.log('返回上一页')")

# Segmented
add('segmented',
'''  <w-segmented v-model="value" :options="options" />''',
"""import { ref } from 'vue'
import { WSegmented } from '@windows-ui/core'
const value = ref('Mon')
const options = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']""")

# Tour
add('tour',
'''  <w-button ref="ref1">上传文件</w-button>
  <w-button ref="ref2">保存</w-button>
  <w-tour :steps="steps" />''',
"""import { ref } from 'vue'
import { WTour, WButton } from '@windows-ui/core'
const ref1 = ref()
const ref2 = ref()
const steps = [
  { title: '上传文件', description: '将文件上传到服务器', target: () => ref1.value?.$el },
  { title: '保存', description: '保存当前更改', target: () => ref2.value?.$el }
]""")

# Tree Select
add('tree-select',
'''  <w-tree-select v-model="value" :data="data" placeholder="请选择" />''',
"""import { ref } from 'vue'
import { WTreeSelect } from '@windows-ui/core'
const value = ref('')
const data = [
  { label: '一级 1', children: [{ label: '二级 1-1' }] },
  { label: '一级 2', children: [{ label: '二级 2-1' }] }
]""")

# Upload
add('upload',
'''  <w-upload action="https://example.com/upload" :on-success="handleSuccess">
    <w-button type="primary">点击上传</w-button>
  </w-upload>''',
"import { WUpload, WButton } from '@windows-ui/core'\nconst handleSuccess = (res, file) => console.log(file.name + ' 上传成功')")

# Virtualized Select
add('virtualized-select',
'''  <w-virtualized-select v-model="value" :options="options" placeholder="请选择" />''',
"""import { ref } from 'vue'
import { WVirtualizedSelect } from '@windows-ui/core'
const value = ref('')
const options = Array.from({ length: 1000 }, (_, i) => ({ label: '选项 ' + (i + 1), value: String(i + 1) }))""")

# Virtualized Table
add('virtualized-table',
'''  <w-virtualized-table :data="data" :columns="columns" :height="400" />''',
"""import { WVirtualizedTable } from '@windows-ui/core'
const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '名称' },
  { prop: 'date', label: '日期' }
]
const data = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  date: '2024-01-01'
}))""")

# Virtualized Tree
add('virtualized-tree',
'''  <w-virtualized-tree :data="data" :props="defaultProps" :height="400" />''',
"""import { WVirtualizedTree } from '@windows-ui/core'
const defaultProps = { children: 'children', label: 'label' }
const data = Array.from({ length: 100 }, (_, i) => ({
  label: '节点 ' + (i + 1),
  children: Array.from({ length: 10 }, (_, j) => ({ label: '子节点 ' + (i + 1) + '-' + (j + 1) }))
}))""")

# Watermark
add('watermark',
'''  <w-watermark content="Windows UI" :font="{ color: 'rgba(0,0,0,0.1)' }">
    <div style="height: 300px;">内容区域</div>
  </w-watermark>''',
"import { WWatermark } from '@windows-ui/core'")

# Message
add('message',
'''  <w-space>
    <w-button @click="$message.info('这是一条消息')">消息</w-button>
    <w-button @click="$message.success('成功消息')">成功</w-button>
    <w-button @click="$message.warning('警告消息')">警告</w-button>
    <w-button @click="$message.error('错误消息')">错误</w-button>
  </w-space>''',
"import { WButton, WSpace } from '@windows-ui/core'")

# Message Box
add('message-box',
'''  <w-space>
    <w-button @click="openMsgBox">打开消息框</w-button>
    <w-button @click="openConfirm">确认框</w-button>
  </w-space>''',
"import { WButton, WSpace } from '@windows-ui/core'\nconst openMsgBox = () => {}\nconst openConfirm = () => {}")

# Notification
add('notification',
'''  <w-space>
    <w-button @click="notify">通知</w-button>
    <w-button @click="notifySuccess">成功通知</w-button>
  </w-space>''',
"import { WButton, WSpace } from '@windows-ui/core'\nconst notify = () => {}\nconst notifySuccess = () => {}")

with open('scripts/examples.json', 'w', encoding='utf-8') as f:
    json.dump(examples, f, ensure_ascii=False, indent=2)
print('Part 7 done, count:', len(examples))

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

# Text
add('text',
'''  <w-space direction="vertical">
    <w-text>默认文本</w-text>
    <w-text type="primary">主要文本</w-text>
    <w-text type="success">成功文本</w-text>
    <w-text type="warning">警告文本</w-text>
    <w-text type="danger">危险文本</w-text>
    <w-text size="large">大号文本</w-text>
    <w-text size="small">小号文本</w-text>
    <w-text truncated>这是一段会被截断的文本内容...</w-text>
    <w-text tag="b">加粗文本</w-text>
  </w-space>''',
"import { WText, WSpace } from '@windows-ui/core'")

# Typography
add('typography',
'''  <w-typography>
    <h1>标题一</h1>
    <h2>标题二</h2>
    <p>这是一段普通文本，包含 <strong>加粗</strong> 和 <em>斜体</em> 样式。</p>
    <p>代码片段：<code>const a = 1</code></p>
  </w-typography>''',
"import { WTypography } from '@windows-ui/core'")

# Empty
add('empty',
'''  <w-empty description="暂无数据" />''',
"import { WEmpty } from '@windows-ui/core'")

# Result
add('result',
'''  <w-result icon="success" title="成功提示" sub-title="请根据提示进行操作">
    <template #extra>
      <w-button type="primary">返回</w-button>
    </template>
  </w-result>''',
"import { WResult, WButton } from '@windows-ui/core'")

# Skeleton
add('skeleton',
'''  <w-skeleton :rows="5" animated />''',
"import { WSkeleton } from '@windows-ui/core'")

# Statistic
add('statistic',
'''  <w-row :gutter="20">
    <w-col :span="8">
      <w-statistic title="DAU" :value="268500" />
    </w-col>
    <w-col :span="8">
      <w-statistic title="订单" :value="128" />
    </w-col>
  </w-row>''',
"import { WStatistic, WRow, WCol } from '@windows-ui/core'")

# Descriptions
add('descriptions',
'''  <w-descriptions title="用户信息" border>
    <w-descriptions-item label="用户名">kooriookami</w-descriptions-item>
    <w-descriptions-item label="手机号">18100000000</w-descriptions-item>
    <w-descriptions-item label="居住地">苏州市</w-descriptions-item>
  </w-descriptions>''',
"import { WDescriptions, WDescriptionsItem } from '@windows-ui/core'")

# Image
add('image',
'''  <w-image
    style="width: 100px; height: 100px"
    src="https://example.com/image.jpg"
    :preview-src-list="['https://example.com/image.jpg']"
  />''',
"import { WImage } from '@windows-ui/core'")

# Icon
add('icon',
'''  <w-space>
    <w-icon name="search" />
    <w-icon name="edit" />
    <w-icon name="delete" />
    <w-icon name="share" />
    <w-icon name="arrow-up" />
    <w-icon name="arrow-down" />
    <w-icon name="close" />
    <w-icon name="check" />
    <w-icon name="info" />
    <w-icon name="warning" />
  </w-space>''',
"import { WIcon, WSpace } from '@windows-ui/core'")

# Loading
add('loading',
'''  <w-button @click="handleClick">显示加载中</w-button>
  <div v-loading="loading" style="height: 100px; margin-top: 20px;">
    加载区域
  </div>''',
"""import { ref } from 'vue'
import { WButton } from '@windows-ui/core'
const loading = ref(false)
const handleClick = () => {
  loading.value = true
  setTimeout(() => loading.value = false, 2000)
}""")

# Scrollbar
add('scrollbar',
'''  <w-scrollbar height="200px">
    <p v-for="item in 20" :key="item">{{ item }}</p>
  </w-scrollbar>''',
"import { WScrollbar } from '@windows-ui/core'")

# Splitter
add('splitter',
'''  <w-splitter style="height: 200px">
    <w-splitter-pane>左侧面板</w-splitter-pane>
    <w-splitter-pane>右侧面板</w-splitter-pane>
  </w-splitter>''',
"import { WSplitter, WSplitterPane } from '@windows-ui/core'")

with open('scripts/examples.json', 'w', encoding='utf-8') as f:
    json.dump(examples, f, ensure_ascii=False, indent=2)
print('Part 5 done, count:', len(examples))

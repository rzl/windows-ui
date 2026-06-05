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

# Calendar
add('calendar',
'''  <w-calendar v-model="value" />''',
"""import { ref } from 'vue'
import { WCalendar } from '@windows-ui/core'
const value = ref(new Date())""")

# Card
add('card',
'''  <w-card style="width: 400px">
    <template #header>
      <span>卡片名称</span>
      <w-button type="text">操作按钮</w-button>
    </template>
    <div v-for="o in 4" :key="o" class="text item">{{ "列表内容 " + o }}</div>
  </w-card>''',
"import { WCard, WButton } from '@windows-ui/core'",
".text { font-size: 14px; }\n.item { margin-bottom: 18px; }")

# Carousel
add('carousel',
'''  <w-carousel height="200px">
    <w-carousel-item v-for="item in 4" :key="item">
      <div class="carousel-item">{{ item }}</div>
    </w-carousel-item>
  </w-carousel>''',
"import { WCarousel, WCarouselItem } from '@windows-ui/core'",
""".carousel-item {
  height: 200px;
  background-color: #d3dce6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}""")

# Collapse
add('collapse',
'''  <w-collapse v-model="activeNames">
    <w-collapse-item title="一致性 Consistency" name="1">
      <div>与现实生活一致：与现实生活的流程、逻辑保持一致。</div>
    </w-collapse-item>
    <w-collapse-item title="反馈 Feedback" name="2">
      <div>控制反馈：通过界面样式和交互动效让用户感知操作。</div>
    </w-collapse-item>
  </w-collapse>''',
"""import { ref } from 'vue'
import { WCollapse, WCollapseItem } from '@windows-ui/core'
const activeNames = ref(['1'])""")

# Timeline
add('timeline',
'''  <w-timeline>
    <w-timeline-item timestamp="2024-01-01" placement="top">
      <w-card><h4>更新 Github 模板</h4></w-card>
    </w-timeline-item>
    <w-timeline-item timestamp="2024-01-02">
      <w-card><h4>更新组件库</h4></w-card>
    </w-timeline-item>
  </w-timeline>''',
"import { WTimeline, WTimelineItem, WCard } from '@windows-ui/core'")

# Divider
add('divider',
'''  <span>雨纷纷</span>
  <w-divider direction="vertical" />
  <span>旧故里</span>
  <w-divider direction="vertical" />
  <span>草木深</span>
  <w-divider content-position="left">左侧文本</w-divider>
  <w-divider content-position="right">右侧文本</w-divider>''',
"import { WDivider } from '@windows-ui/core'")

# Space
add('space',
'''  <w-space wrap>
    <w-button v-for="i in 10" :key="i">按钮{{ i }}</w-button>
  </w-space>''',
"import { WSpace, WButton } from '@windows-ui/core'")

# Container
add('container',
'''  <w-container>
    <w-header>Header</w-header>
    <w-main>Main</w-main>
    <w-footer>Footer</w-footer>
  </w-container>''',
"import { WContainer, WHeader, WMain, WFooter } from '@windows-ui/core'",
""".w-header, .w-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.w-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}""")

# Layout
add('layout',
'''  <w-row :gutter="20">
    <w-col :span="6"><div class="grid-content">1</div></w-col>
    <w-col :span="6"><div class="grid-content">2</div></w-col>
    <w-col :span="6"><div class="grid-content">3</div></w-col>
    <w-col :span="6"><div class="grid-content">4</div></w-col>
  </w-row>''',
"import { WRow, WCol } from '@windows-ui/core'",
""".grid-content {
  background: #d3dce6;
  border-radius: 4px;
  min-height: 36px;
  text-align: center;
  line-height: 36px;
}""")

# Link
add('link',
'''  <w-space>
    <w-link href="https://example.com" target="_blank">默认链接</w-link>
    <w-link type="primary">主要链接</w-link>
    <w-link type="success">成功链接</w-link>
    <w-link type="warning">警告链接</w-link>
    <w-link type="danger">危险链接</w-link>
    <w-link :underline="false">无下划线</w-link>
    <w-link disabled>禁用状态</w-link>
  </w-space>''',
"import { WLink, WSpace } from '@windows-ui/core'")

with open('scripts/examples.json', 'w', encoding='utf-8') as f:
    json.dump(examples, f, ensure_ascii=False, indent=2)
print('Part 4 done, count:', len(examples))

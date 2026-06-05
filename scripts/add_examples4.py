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

# Affix
add('affix',
'''  <w-affix :offset="80">
    <w-button type="primary">固定在顶部 80px</w-button>
  </w-affix>''',
"import { WAffix, WButton } from '@windows-ui/core'")

# Anchor
add('anchor',
'''  <w-anchor :links="links" />''',
"""import { WAnchor } from '@windows-ui/core'
const links = [
  { href: '#basic', title: '基础用法' },
  { href: '#api', title: 'API' },
  { href: '#theme', title: '主题定制' }
]""")

# Autocomplete
add('autocomplete',
'''  <w-autocomplete
    v-model="state"
    :options="restaurants"
    placeholder="请输入内容"
    @select="handleSelect"
  />''',
"""import { ref } from 'vue'
import { WAutocomplete } from '@windows-ui/core'
const state = ref('')
const restaurants = [
  { value: '三全鲜食（北新泾店）', label: '三全鲜食（北新泾店）' },
  { value: 'Hot honey 首尔炸鸡（仙霞路）', label: 'Hot honey 首尔炸鸡（仙霞路）' }
]
const handleSelect = (item) => console.log(item)""")

# Backtop
add('backtop',
'''  <div style="height: 2000px;">
    <p>向下滚动查看 Backtop 组件</p>
  </div>
  <w-backtop />''',
"import { WBacktop } from '@windows-ui/core'")

# Border
add('border',
'''  <w-border>
    <div class="content">带边框的内容区域</div>
  </w-border>''',
"import { WBorder } from '@windows-ui/core'",
".content { padding: 20px; }")

# Cascader
add('cascader',
'''  <w-cascader v-model="value" :options="options" placeholder="请选择" />''',
"""import { ref } from 'vue'
import { WCascader } from '@windows-ui/core'
const value = ref([])
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      { value: 'disciplines', label: 'Disciplines' },
      { value: 'navigation', label: 'Navigation' }
    ]
  }
]""")

# Color
add('color',
'''  <w-color @select="handleSelect" />''',
"import { WColor } from '@windows-ui/core'\nconst handleSelect = (color) => console.log(color)")

# Color Picker
add('color-picker',
'''  <w-color-picker v-model="color" />''',
"import { ref } from 'vue'\nimport { WColorPicker } from '@windows-ui/core'\nconst color = ref('#409EFF')")

# Color Picker Panel
add('color-picker-panel',
'''  <w-color-picker-panel @change="handleChange" />''',
"import { WColorPickerPanel } from '@windows-ui/core'\nconst handleChange = (color) => console.log(color)")

# Config Provider
add('config-provider',
'''  <w-config-provider :locale="locale" prefix="w">
    <w-button>默认按钮</w-button>
  </w-config-provider>''',
"""import { WConfigProvider, WButton } from '@windows-ui/core'
const locale = {
  name: 'zh-cn',
  button: { confirm: '确定', cancel: '取消' }
}""")

# Date Picker
add('date-picker',
'''  <w-date-picker v-model="value" placeholder="选择日期" />
  <w-date-picker v-model="valueRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />''',
"""import { ref } from 'vue'
import { WDatePicker } from '@windows-ui/core'
const value = ref('')
const valueRange = ref('')""")

# Date Picker Panel
add('date-picker-panel',
'''  <w-date-picker-panel v-model="value" />''',
"import { ref } from 'vue'\nimport { WDatePickerPanel } from '@windows-ui/core'\nconst value = ref(new Date())")

# Date Time Picker
add('date-time-picker',
'''  <w-date-time-picker v-model="value" placeholder="选择日期时间" />''',
"import { ref } from 'vue'\nimport { WDateTimePicker } from '@windows-ui/core'\nconst value = ref('')")

# Time Picker
add('time-picker',
'''  <w-time-picker v-model="value" placeholder="选择时间" />''',
"import { ref } from 'vue'\nimport { WTimePicker } from '@windows-ui/core'\nconst value = ref('')")

# Time Select
add('time-select',
'''  <w-time-select v-model="value" start="08:30" step="00:15" end="18:30" placeholder="选择时间" />''',
"import { ref } from 'vue'\nimport { WTimeSelect } from '@windows-ui/core'\nconst value = ref('')")

with open('scripts/examples.json', 'w', encoding='utf-8') as f:
    json.dump(examples, f, ensure_ascii=False, indent=2)
print('Part 6 done, count:', len(examples))

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

# Tabs
add('tabs',
'''  <w-tabs v-model="activeName">
    <w-tab-pane label="用户管理" name="first">用户管理内容</w-tab-pane>
    <w-tab-pane label="配置管理" name="second">配置管理内容</w-tab-pane>
    <w-tab-pane label="角色管理" name="third">角色管理内容</w-tab-pane>
  </w-tabs>''',
"""import { ref } from 'vue'
import { WTabs, WTabPane } from '@windows-ui/core'
const activeName = ref('first')""")

# Breadcrumb
add('breadcrumb',
'''  <w-breadcrumb separator="/">
    <w-breadcrumb-item :to="{ path: '/' }">首页</w-breadcrumb-item>
    <w-breadcrumb-item>活动管理</w-breadcrumb-item>
    <w-breadcrumb-item>活动列表</w-breadcrumb-item>
  </w-breadcrumb>''',
"import { WBreadcrumb, WBreadcrumbItem } from '@windows-ui/core'")

# Steps
add('steps',
'''  <w-steps :active="1">
    <w-step title="步骤 1" description="描述信息" />
    <w-step title="步骤 2" description="描述信息" />
    <w-step title="步骤 3" description="描述信息" />
  </w-steps>''',
"import { WSteps, WStep } from '@windows-ui/core'")

# Pagination
add('pagination',
'''  <w-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="100"
    layout="total, prev, pager, next"
  />''',
"""import { ref } from 'vue'
import { WPagination } from '@windows-ui/core'
const currentPage = ref(1)
const pageSize = ref(10)""")

# Avatar
add('avatar',
'''  <w-space>
    <w-avatar src="https://example.com/avatar.jpg" />
    <w-avatar icon="user" />
    <w-avatar>User</w-avatar>
    <w-avatar shape="square" icon="user" />
    <w-avatar :size="40" bg-color="#245edb">U</w-avatar>
  </w-space>''',
"import { WAvatar, WSpace } from '@windows-ui/core'")

# Progress
add('progress',
'''  <w-progress :percentage="50" />
  <w-progress :percentage="100" status="success" />
  <w-progress :percentage="80" status="warning" />
  <w-progress :percentage="30" status="exception" />''',
"import { WProgress } from '@windows-ui/core'")

# Table
add('table',
'''  <w-table :data="tableData" :columns="columns">
    <template #name="{ row }">
      <w-tag>{{ row.name }}</w-tag>
    </template>
  </w-table>''',
"""import { WTable, WTag } from '@windows-ui/core'
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'date', label: '日期' },
  { prop: 'address', label: '地址' }
]
const tableData = [
  { name: '张三', date: '2024-01-01', address: '北京市' },
  { name: '李四', date: '2024-01-02', address: '上海市' }
]""")

# Tree
add('tree',
'''  <w-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />''',
"""import { WTree } from '@windows-ui/core'
const defaultProps = { children: 'children', label: 'label' }
const data = [
  { label: '一级 1', children: [{ label: '二级 1-1' }] },
  { label: '一级 2', children: [{ label: '二级 2-1' }, { label: '二级 2-2' }] }
]
const handleNodeClick = (data) => console.log(data)""")

# Transfer
add('transfer',
'''  <w-transfer v-model="value" :data="data" />''',
"""import { ref } from 'vue'
import { WTransfer } from '@windows-ui/core'
const data = Array.from({ length: 15 }, (_, i) => ({ key: i + 1, label: '备选项 ' + (i + 1) }))
const value = ref([1, 4])""")

# Form
add('form',
'''  <w-form :model="form" :rules="rules" ref="formRef">
    <w-form-item label="用户名" prop="name">
      <w-input v-model="form.name" />
    </w-form-item>
    <w-form-item label="邮箱" prop="email">
      <w-input v-model="form.email" />
    </w-form-item>
    <w-form-item>
      <w-button type="primary" @click="submitForm">提交</w-button>
      <w-button @click="resetForm">重置</w-button>
    </w-form-item>
  </w-form>''',
"""import { ref, reactive } from 'vue'
import { WForm, WFormItem, WInput, WButton } from '@windows-ui/core'
const formRef = ref()
const form = reactive({ name: '', email: '' })
const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
}
const submitForm = () => formRef.value.validate()
const resetForm = () => formRef.value.resetFields()""")

with open('scripts/examples.json', 'w', encoding='utf-8') as f:
    json.dump(examples, f, ensure_ascii=False, indent=2)
print('Part 3 done, count:', len(examples))

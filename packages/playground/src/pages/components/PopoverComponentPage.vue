<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('悬浮内容面板，比 Tooltip 更丰富')" id="popover" doc="popover">

      <demo-block :title="t('基础弹出框')" :code="PopoverCode1">
        <w-popover title="用户信息" :content="t('这是用户详细信息面板')">
          <w-button>{{ t('查看用户') }}</w-button>
        </w-popover>
      </demo-block>
      <demo-block :title="t('hover 触发')" :code="PopoverCode2">
        <w-popover title="快捷操作" :content="t('鼠标悬停触发')" trigger="hover">
          <w-button>{{ t('hover 触发') }}</w-button>
        </w-popover>
      </demo-block>
      <demo-block :title="t('自定义宽度')" :code="PopoverCode3">
        <w-popover title="宽面板" :content="t('这是一个比较宽的内容面板')" :width="300">
          <w-button>{{ t('宽面板') }}</w-button>
        </w-popover>
      </demo-block>
      <demo-block :title="t('嵌套内容')" :code="PopoverCode4">
        <w-popover title="操作菜单">
          <template #content>
            <w-space direction="vertical">
              <w-link>编辑</w-link>
              <w-link type="danger">删除</w-link>
            </w-space>
          </template>
          <w-button>操作</w-button>
        </w-popover>
      </demo-block>
      <demo-block :title="t('自定义标题')" :code="PopoverCode5">
        <w-popover>
          <template #header>
            <w-icon name="warning" size="small" />
            <span style="margin-left:4px">警告</span>
          </template>
          <template #content>使用 header 插槽自定义标题区。</template>
          <w-button>自定义标题</w-button>
        </w-popover>
      </demo-block>
      <demo-block :title="t('自定义操作')" :code="PopoverCode6">
        <w-popover title="操作面板">
          <template #action>
            <w-icon name="close" size="small" style="cursor:pointer" />
          </template>
          <template #content>使用 action 插槽在标题右侧插入操作。</template>
          <w-button>自定义操作</w-button>
        </w-popover>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive, ref } from 'vue'
const { t } = useI18n()

const dialogs = reactive({ basic: false, wide: false, mask: false, nested: false })
const drawers = reactive({ right: false, bottom: false, left: false, stay: false })
const msgRef = ref<any>(null)
const notifyRef = ref<any>(null)
const msgBoxRef = ref<any>(null)

const alert = (msg: string) => window.alert(msg)

const title = t('Popover 弹出框')

const PopoverCode1 = `<w-popover title="用户信息" content="这是用户详细信息面板">
  <w-button>查看用户</w-button>
</w-popover>`
const PopoverCode2 = `<w-popover title="快捷操作" content="鼠标悬停触发" trigger="hover">
  <w-button>hover 触发</w-button>
</w-popover>`
const PopoverCode3 = `<w-popover title="宽面板" content="这是一个比较宽的内容面板" :width="300">
  <w-button>宽面板</w-button>
</w-popover>`
const PopoverCode4 = `<w-popover title="操作菜单">
  <template #content>
    <w-space direction="vertical">
      <w-link>编辑</w-link>
      <w-link type="danger">删除</w-link>
    </w-space>
  </template>
  <w-button>操作</w-button>
</w-popover>`
const PopoverCode5 = `<w-popover>
  <template #header>
    <w-icon name="warning" size="small" />
    <span style="margin-left:4px">警告</span>
  </template>
  <template #content>使用 header 插槽自定义标题区。</template>
  <w-button>自定义标题</w-button>
</w-popover>`
const PopoverCode6 = `<w-popover title="操作面板">
  <template #action>
    <w-icon name="close" size="small" style="cursor:pointer" />
  </template>
  <template #content>使用 action 插槽在标题右侧插入操作。</template>
  <w-button>自定义操作</w-button>
</w-popover>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>

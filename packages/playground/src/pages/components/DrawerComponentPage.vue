<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('侧边滑出面板')" id="drawer" doc="drawer">

      <demo-block :title="t('右侧抽屉')" :code="DrawerCode1">
        <w-button @click="drawers.right = true">{{ t('右侧滑出') }}</w-button>
        <w-drawer v-model="drawers.right" title="设置">
          <p>抽屉内容区域</p>
          <w-form>
            <w-form-item :label="t('主题')">
              <w-select :options="[{label:'蓝色',value:'blue'}]" />
            </w-form-item>
            <w-form-item :label="t('语言')">
              <w-select :options="[{label:'中文',value:'zh'}]" />
            </w-form-item>
          </w-form>
        </w-drawer>
      </demo-block>

      <demo-block :title="t('底部抽屉')" :code="DrawerCode2">
        <w-button @click="drawers.bottom = true">{{ t('底部滑出') }}</w-button>
        <w-drawer v-model="drawers.bottom" title="详情" direction="bottom" size="200px">
          <p>从底部滑出的抽屉</p>
        </w-drawer>
      </demo-block>

      <demo-block :title="t('左侧抽屉')" :code="DrawerCode3">
        <w-button @click="drawers.left = true">{{ t('左侧滑出') }}</w-button>
        <w-drawer v-model="drawers.left" title="导航" direction="left" size="250px">
          <w-menu :items="[{label:'首页'},{label:'产品'},{label:'关于'}]" />
        </w-drawer>
      </demo-block>

      <demo-block :title="t('不点击遮罩关闭')" :code="DrawerCode4">
        <w-button @click="drawers.stay = true">{{ t('需手动关闭') }}</w-button>
        <w-drawer v-model="drawers.stay" title="重要操作" :close-on-click-modal="false">
          <p>请点击右上角 X 或按钮关闭</p>
          <template #footer>
            <w-button @click="drawers.stay = false">{{ t('关闭') }}</w-button>
          </template>
        </w-drawer>
      </demo-block>

      <demo-block :title="t('自定义标题')" :code="DrawerCode5">
        <w-button @click="drawers.customHeader = true">自定义标题</w-button>
        <w-drawer v-model="drawers.customHeader">
          <template #header>
            <w-icon name="warning" size="small" />
            <span style="margin-left:6px">警告</span>
          </template>
          <p>使用 header 插槽自定义抽屉标题。</p>
        </w-drawer>
      </demo-block>

      <demo-block :title="t('自定义操作')" :code="DrawerCode6">
        <w-button @click="drawers.customAction = true">自定义操作</w-button>
        <w-drawer v-model="drawers.customAction" title="操作">
          <template #action>
            <w-icon name="info" size="small" style="cursor:pointer" @click="alert('更多信息')" />
          </template>
          <p>使用 action 插槽在关闭按钮左侧插入自定义操作。</p>
        </w-drawer>
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
const drawers = reactive({ right: false, bottom: false, left: false, stay: false, customHeader: false, customAction: false })
const msgRef = ref<any>(null)
const notifyRef = ref<any>(null)
const msgBoxRef = ref<any>(null)

const alert = (msg: string) => window.alert(msg)

const title = t('Drawer 抽屉')

const DrawerCode1 = `<w-button @click="drawers.right = true">右侧滑出</w-button>
<w-drawer v-model="drawers.right" title="设置">
  <p>抽屉内容区域</p>
  <w-form>
    <w-form-item label="主题">
      <w-select :options="[{ label: '蓝色', value: 'blue' }]" />
    </w-form-item>
    <w-form-item label="语言">
      <w-select :options="[{ label: '中文', value: 'zh' }]" />
    </w-form-item>
  </w-form>
</w-drawer>`
const DrawerCode2 = `<w-button @click="drawers.bottom = true">底部滑出</w-button>
<w-drawer v-model="drawers.bottom" title="详情" direction="bottom" size="200px">
  <p>从底部滑出的抽屉</p>
</w-drawer>`
const DrawerCode3 = `<w-button @click="drawers.left = true">左侧滑出</w-button>
<w-drawer v-model="drawers.left" title="导航" direction="left" size="250px">
  <w-menu :items="[{ label: '首页' }, { label: '产品' }, { label: '关于' }]" />
</w-drawer>`
const DrawerCode4 = `<w-button @click="drawers.stay = true">需手动关闭</w-button>
<w-drawer v-model="drawers.stay" title="重要操作" :close-on-click-modal="false">
  <p>请点击右上角 X 或按钮关闭</p>
  <template #footer>
    <w-button @click="drawers.stay = false">关闭</w-button>
  </template>
</w-drawer>`
const DrawerCode5 = `<w-button @click="drawers.customHeader = true">自定义标题</w-button>
<w-drawer v-model="drawers.customHeader">
  <template #header>
    <w-icon name="warning" size="small" />
    <span style="margin-left:6px">警告</span>
  </template>
  <p>使用 header 插槽自定义抽屉标题。</p>
</w-drawer>`
const DrawerCode6 = `<w-button @click="drawers.customAction = true">自定义操作</w-button>
<w-drawer v-model="drawers.customAction" title="操作">
  <template #action>
    <w-icon name="info" size="small" style="cursor:pointer" @click="alert('更多信息')" />
  </template>
  <p>使用 action 插槽在关闭按钮左侧插入自定义操作。</p>
</w-drawer>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>

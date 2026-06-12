<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('侧边滑出面板')" id="drawer" doc="drawer">

            <demo-block :title="t('右侧抽屉')" code="&lt;w-button @click=&quot;drawers.right = true&quot;&gt;右侧滑出&lt;/w-button&gt;
      &lt;w-drawer v-model=&quot;drawers.right&quot; title=&quot;设置&quot;&gt;&lt;p&gt;抽屉内容区域&lt;/p&gt;&lt;w-form&gt;&lt;w-form-item label=&quot;主题&quot;&gt;&lt;w-select :options=&quot;[{label:'蓝色',value:'blue'}]&quot; /&gt;&lt;/w-form-item&gt;&lt;w-form-item label=&quot;语言&quot;&gt;&lt;w-select :options=&quot;[{label:'中文',value:'zh'}]&quot; /&gt;&lt;/w-form-item&gt;&lt;/w-form&gt;&lt;/w-drawer&gt;">
              <w-button @click="drawers.right = true">{{ t('右侧滑出') }}</w-button>
              <w-drawer v-model="drawers.right" title="设置"><p>抽屉内容区域</p><w-form><w-form-item :label="t('主题')"><w-select :options="[{label:'蓝色',value:'blue'}]" /></w-form-item><w-form-item :label="t('语言')"><w-select :options="[{label:'中文',value:'zh'}]" /></w-form-item></w-form></w-drawer>
            </demo-block>
            <demo-block :title="t('底部抽屉')" code="&lt;w-button @click=&quot;drawers.bottom = true&quot;&gt;底部滑出&lt;/w-button&gt;
      &lt;w-drawer v-model=&quot;drawers.bottom&quot; title=&quot;详情&quot; direction=&quot;bottom&quot; size=&quot;200px&quot;&gt;&lt;p&gt;从底部滑出的抽屉&lt;/p&gt;&lt;/w-drawer&gt;">
              <w-button @click="drawers.bottom = true">{{ t('底部滑出') }}</w-button>
              <w-drawer v-model="drawers.bottom" title="详情" direction="bottom" size="200px"><p>从底部滑出的抽屉</p></w-drawer>
            </demo-block>
            <demo-block :title="t('左侧抽屉')" code="&lt;w-button @click=&quot;drawers.left = true&quot;&gt;左侧滑出&lt;/w-button&gt;
      &lt;w-drawer v-model=&quot;drawers.left&quot; title=&quot;导航&quot; direction=&quot;left&quot; size=&quot;250px&quot;&gt;&lt;w-menu :items=&quot;[{label:'首页'},{label:'产品'},{label:'关于'}]&quot; /&gt;&lt;/w-drawer&gt;">
              <w-button @click="drawers.left = true">{{ t('左侧滑出') }}</w-button>
              <w-drawer v-model="drawers.left" title="导航" direction="left" size="250px"><w-menu :items="[{label:'首页'},{label:'产品'},{label:'关于'}]" /></w-drawer>
            </demo-block>
            <demo-block :title="t('不点击遮罩关闭')" code="&lt;w-button @click=&quot;drawers.stay = true&quot;&gt;需手动关闭&lt;/w-button&gt;
      &lt;w-drawer v-model=&quot;drawers.stay&quot; title=&quot;重要操作&quot; :close-on-click-modal=&quot;false&quot;&gt;&lt;p&gt;请点击右上角 X 或按钮关闭&lt;/p&gt;&lt;template #footer&gt;&lt;w-button @click=&quot;drawers.stay = false&quot;&gt;关闭&lt;/w-button&gt;&lt;/template&gt;&lt;/w-drawer&gt;">
              <w-button @click="drawers.stay = true">{{ t('需手动关闭') }}</w-button>
              <w-drawer v-model="drawers.stay" title="重要操作" :close-on-click-modal="false"><p>请点击右上角 X 或按钮关闭</p><template #footer><w-button @click="drawers.stay = false">{{ t('关闭') }}</w-button></template></w-drawer>
            </demo-block>
            <demo-block :title="t('自定义标题')" code="&lt;w-button @click=&quot;drawers.customHeader = true&quot;&gt;自定义标题&lt;/w-button&gt;
      &lt;w-drawer v-model=&quot;drawers.customHeader&quot;&gt;&lt;template #header&gt;&lt;w-icon name=&quot;warning&quot; size=&quot;small&quot; /&gt;&lt;span style=&quot;margin-left:6px&quot;&gt;警告&lt;/span&gt;&lt;/template&gt;&lt;p&gt;使用 header 插槽自定义抽屉标题。&lt;/p&gt;&lt;/w-drawer&gt;">
              <w-button @click="drawers.customHeader = true">自定义标题</w-button>
              <w-drawer v-model="drawers.customHeader"><template #header><w-icon name="warning" size="small" /><span style="margin-left:6px">警告</span></template><p>使用 header 插槽自定义抽屉标题。</p></w-drawer>
            </demo-block>
            <demo-block :title="t('自定义操作')" code="&lt;w-button @click=&quot;drawers.customAction = true&quot;&gt;自定义操作&lt;/w-button&gt;
      &lt;w-drawer v-model=&quot;drawers.customAction&quot; title=&quot;操作&quot;&gt;&lt;template #action&gt;&lt;w-icon name=&quot;info&quot; size=&quot;small&quot; style=&quot;cursor:pointer&quot; @click=&quot;alert('更多信息')&quot; /&gt;&lt;/template&gt;&lt;p&gt;使用 action 插槽在关闭按钮左侧插入自定义操作。&lt;/p&gt;&lt;/w-drawer&gt;">
              <w-button @click="drawers.customAction = true">自定义操作</w-button>
              <w-drawer v-model="drawers.customAction" title="操作"><template #action><w-icon name="info" size="small" style="cursor:pointer" @click="alert('更多信息')" /></template><p>使用 action 插槽在关闭按钮左侧插入自定义操作。</p></w-drawer>
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
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
